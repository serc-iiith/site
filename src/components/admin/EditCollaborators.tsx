import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, Link as LinkIcon, Building, Tag } from 'lucide-react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface Collaborator {
    id: string;
    name: string;
    logo: string;
    website: string;
    description: string;
    category: string;
}

const EditCollaborators: React.FC = () => {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        collaboratorId: string | null;
        collaboratorName: string;
    }>({
        isOpen: false,
        collaboratorId: null,
        collaboratorName: '',
    });
    const [formData, setFormData] = useState<Collaborator>({
        id: '',
        name: '',
        logo: '',
        website: '',
        description: '',
        category: ''
    });

    // Available categories for the dropdown
    const categories = ['academic', 'industry', 'governmen</div>t'];

    useEffect(() => {
        fetchCollaborators();
    }, []);

    const fetchCollaborators = async () => {
        try {
            const response = await fetch('/api/collaborators');
            const data = await response.json();
            setCollaborators(data);
        } catch (error) {
            console.error('Error fetching collaborators data:', error);
            toast.error('Failed to load collaborators data');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const startEditing = (collaborator: Collaborator) => {
        setEditingId(collaborator.id);
        setFormData({ ...collaborator });
    };

    const startAdding = () => {
        setEditingId('new');
        setFormData({
            id: '',
            name: '',
            logo: '',
            website: '',
            description: '',
            category: ''
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const saveCollaborator = async () => {
        if (!formData.name || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            if (editingId === 'new') {
                // Add new collaborator
                const response = await fetch('/api/collaborators', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to add collaborator');
                }

                toast.success('Collaborator added successfully');
            } else {
                // Update existing collaborator
                const response = await fetch('/api/collaborators', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update collaborator');
                }

                toast.success('Collaborator updated successfully');
            }

            // Refresh the data
            await fetchCollaborators();
            cancelEditing();
        } catch (error) {
            console.error('Error saving collaborator:', error);
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (collaborator: Collaborator) => {
        setDeleteModal({
            isOpen: true,
            collaboratorId: collaborator.id,
            collaboratorName: collaborator.name,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            collaboratorId: null,
            collaboratorName: '',
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.collaboratorId) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/collaborators?id=${deleteModal.collaboratorId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete collaborator');
            }

            toast.success('Collaborator deleted successfully');
            await fetchCollaborators();
        } catch (error) {
            console.error('Error deleting collaborator:', error);
            toast.error('Failed to delete. Please try again.');
        } finally {
            setIsLoading(false);
            closeDeleteModal();
        }
    };

    // Get collaborators filtered by search term
    const filteredCollaborators = collaborators.filter(collaborator =>
        collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborator.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group collaborators by category
    const groupedCollaborators = filteredCollaborators.reduce<Record<string, Collaborator[]>>((acc, collaborator) => {
        const category = collaborator.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(collaborator);
        return acc;
    }, {});

    return (
        <div className="bg-[color:var(--background)] rounded-lg shadow-lg p-4 sm:p-6 border border-[color:var(--border-color)]">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--background)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)'
                    },
                    success: {
                        icon: '✅',
                    },
                    error: {
                        icon: '❌',
                    }
                }}
            />

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                isLoading={isLoading}
                title="Delete Collaborator"
                message={`Are you sure you want to delete "${deleteModal.collaboratorName}"? This action cannot be undone.`}
            />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] mb-2 sm:mb-0">Collaborators Management</h2>
                <button
                    onClick={startAdding}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                >
                    <Plus size={16} /> <span>Add Collaborator</span>
                </button>
            </div>

            {editingId !== null && (
                <div className="mb-8 bg-[color:var(--foreground)] p-4 rounded-lg border border-[color:var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-color)] flex items-center">
                        {editingId === 'new' ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                        {editingId === 'new' ? 'Add New Collaborator' : 'Edit Collaborator'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Name*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="Organization name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Category*
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {editingId !== 'new' && (
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    ID
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={true}
                                    placeholder="ID (auto-generated)"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Website URL
                            </label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Logo URL
                            </label>
                            <input
                                type="text"
                                name="logo"
                                value={formData.logo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="https://example.com/logo.png or /images/logo.png"
                            />
                            {formData.logo && (
                                <div className="mt-2 p-2 border border-[color:var(--border-color)] rounded-md inline-flex items-center">
                                    <span className="mr-2 text-xs text-[color:var(--secondary-color)]">Logo Preview:</span>
                                    <div className="h-8 w-8">
                                        <Image
                                            src={formData.logo}
                                            width={32}
                                            height={32}
                                            alt="Logo preview"
                                            className="max-h-8 object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder.png';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                            disabled={isLoading}
                            placeholder="Brief description of the collaborator..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={cancelEditing}
                            disabled={isLoading}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-[color:var(--border-color)] rounded-md text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)] flex items-center disabled:opacity-50"
                        >
                            <X size={16} className="mr-1" /> Cancel
                        </button>
                        <button
                            onClick={saveCollaborator}
                            disabled={isLoading}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 flex items-center disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : <><Save size={16} className="mr-1" /> Save</>}
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <div className="flex items-center mb-4">
                    <Search size={18} className="text-[color:var(--secondary-color)] mr-2" />
                    <input
                        type="text"
                        placeholder="Search collaborators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] w-full"
                    />
                </div>
            </div>

            {isLoading && !editingId ? (
                <div className="text-center py-8 text-[color:var(--secondary-color)]">
                    Loading collaborators...
                </div>
            ) : filteredCollaborators.length === 0 ? (
                <div className="text-center py-8 text-[color:var(--secondary-color)]">
                    {searchTerm
                        ? 'No collaborators found matching your search criteria.'
                        : 'No collaborators found. Add your first collaborator!'
                    }
                </div>
            ) : (
                <div>
                    {Object.entries(groupedCollaborators).map(([category, categoryCollaborators]) => (
                        <div key={category} className="mb-8">
                            <h3 className="text-lg font-medium text-[color:var(--text-color)] flex items-center mb-3">
                                <Tag size={18} className="mr-2" />
                                <span className="capitalize">{category}</span>
                                <span className="ml-2 text-sm text-[color:var(--secondary-color)]">
                                    ({categoryCollaborators.length})
                                </span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {categoryCollaborators.map((collaborator) => (
                                    <div
                                        key={collaborator.id}
                                        className="bg-[color:var(--foreground)] p-4 rounded-lg border border-[color:var(--border-color)] relative group"
                                    >
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                            <button
                                                onClick={() => startEditing(collaborator)}
                                                disabled={isLoading || editingId !== null}
                                                className="p-1 rounded hover:bg-[color:var(--hover-bg)] text-[color:var(--primary-color)]"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(collaborator)}
                                                disabled={isLoading || editingId !== null}
                                                className="p-1 rounded hover:bg-[color:var(--hover-bg)] text-[color:var(--error-color)]"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-center mb-3">
                                            {collaborator.logo ? (
                                                <div className="h-12 w-12 flex items-center justify-center mr-3 bg-white rounded overflow-hidden p-1">
                                                    <Image
                                                        src={collaborator.logo}
                                                        alt={`${collaborator.name} logo`}
                                                        width={48}
                                                        height={48}
                                                        className="max-h-10 max-w-full object-contain"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/images/placeholder.png';
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 flex items-center justify-center mr-3 bg-gray-100 rounded">
                                                    <Building size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                            <h4 className="font-medium text-[color:var(--text-color)] line-clamp-2">{collaborator.name}</h4>
                                        </div>

                                        {collaborator.description && (
                                            <p className="text-sm text-[color:var(--secondary-color)] mb-2 line-clamp-2">
                                                {collaborator.description}
                                            </p>
                                        )}

                                        {collaborator.website && (
                                            <a
                                                href={collaborator.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs flex items-center text-[color:var(--primary-color)] hover:underline"
                                            >
                                                <LinkIcon size={12} className="mr-1" /> Visit website
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditCollaborators;
