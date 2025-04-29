import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, Tag } from 'lucide-react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import ImageDropzone from '@/components/common/ImageDropzone';

interface Collaborator {
    name: string;
    logo: string;
    url: string;
}

interface Link {
    label: string;
    url: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    collaborators: Collaborator[];
    links: Link[];
    demoLink?: string;
}

const EditProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newCollaborator, setNewCollaborator] = useState<Collaborator>({ name: '', logo: '', url: '' });
    const [newLink, setNewLink] = useState<Link>({ label: '', url: '' });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        projectId: string | null;
        projectTitle: string;
    }>({
        isOpen: false,
        projectId: null,
        projectTitle: '',
    });
    const [formData, setFormData] = useState<Project>({
        id: '',
        title: '',
        description: '',
        category: '',
        image: '',
        collaborators: [],
        links: [],
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects data:', error);
            toast.error('Failed to load projects data');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCollaboratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCollaborator(prev => ({ ...prev, [name]: value }));
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewLink(prev => ({ ...prev, [name]: value }));
    };

    const addCollaborator = () => {
        if (!newCollaborator.name) return;

        setFormData(prev => ({
            ...prev,
            collaborators: [...prev.collaborators, newCollaborator]
        }));

        setNewCollaborator({ name: '', logo: '', url: '' });
    };

    const removeCollaborator = (index: number) => {
        setFormData(prev => {
            const updatedCollaborators = [...prev.collaborators];
            updatedCollaborators.splice(index, 1);
            return { ...prev, collaborators: updatedCollaborators };
        });
    };

    const addLink = () => {
        if (!newLink.label || !newLink.url) return;

        setFormData(prev => ({
            ...prev,
            links: [...prev.links, newLink]
        }));

        setNewLink({ label: '', url: '' });
    };

    const removeLink = (index: number) => {
        setFormData(prev => {
            const updatedLinks = [...prev.links];
            updatedLinks.splice(index, 1);
            return { ...prev, links: updatedLinks };
        });
    };

    const startEditing = (project: Project) => {
        setEditingId(project.id);
        setFormData({
            ...project
        });

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startAdding = () => {
        setEditingId('new');
        setFormData({
            id: '',
            title: '',
            description: '',
            category: '',
            image: '',
            collaborators: [],
            links: [],
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewCollaborator({ name: '', logo: '', url: '' });
        setNewLink({ label: '', url: '' });
    };

    const saveProject = async () => {
        if (!formData.title || !formData.description || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            if (editingId === 'new') {
                // Add new project
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to add project');
                }

                toast.success('Project added successfully');
            } else {
                // Update existing project
                const response = await fetch('/api/projects', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update project');
                }

                toast.success('Project updated successfully');
            }

            // Refresh the data
            await fetchProjects();
            cancelEditing();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (project: Project) => {
        setDeleteModal({
            isOpen: true,
            projectId: project.id,
            projectTitle: project.title,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            projectId: null,
            projectTitle: '',
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.projectId) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/projects?id=${deleteModal.projectId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            toast.success('Project deleted successfully');
            await fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete. Please try again.');
        } finally {
            setIsLoading(false);
            closeDeleteModal();
        }
    };

    // Function to handle project image upload
    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Generate a slug-like ID from the project title for the image filename
            const fileId = formData.id || (formData.title ? formData.title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '') : '');

            const formDataObj = new FormData();
            formDataObj.append('file', file);
            formDataObj.append('type', 'projects');

            // Only pass the slug if we have one, otherwise the API will use the original filename
            if (fileId) {
                formDataObj.append('slug', fileId);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataObj,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload image');
            }

            if (result.filePath) {
                setFormData(prev => ({
                    ...prev,
                    image: result.filePath
                }));
                // Success toast removed
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Available categories for the dropdown
    const categories = [
        'AI',
        'Education',
        'Security',
        'Software-Engineering',
        'Blockchain',
        'Usability',
        'Medical',
        'Other'
    ];

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
                title="Delete Project"
                message={`Are you sure you want to delete "${deleteModal.projectTitle}"? This action cannot be undone.`}
            />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] mb-2 sm:mb-0">Projects Management</h2>
                <button
                    onClick={startAdding}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                >
                    <Plus size={16} /> <span>Add Project</span>
                </button>
            </div>

            {editingId !== null && (
                <div className="mb-8 bg-[color:var(--foreground)] p-4 rounded-lg border border-[color:var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-color)] flex items-center">
                        {editingId === 'new' ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                        {editingId === 'new' ? 'Add New Project' : 'Edit Project'}
                    </h3>

                    {/* Basic Information Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Project Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Title*
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="Project title"
                                />
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
                                        placeholder="Project ID (auto-generated)"
                                    />
                                </div>
                            )}
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
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.toLowerCase()}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="URL to project image"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Project Image
                                </label>
                                <div className="grid grid-cols-1 gap-4">
                                    <ImageDropzone
                                        onImageUpload={handleImageUpload}
                                        currentImage={formData.image}
                                        isLoading={isUploading}
                                        fallbackImage="/images/project_fallback.png"
                                        roundedFull={false}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Demo Link
                                </label>
                                <input
                                    type="text"
                                    name="demoLink"
                                    value={formData.demoLink || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="URL to demo/video"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Description*</h4>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                            disabled={isLoading}
                            placeholder="Project description..."
                        />
                    </div>

                    {/* Collaborators Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Collaborators</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                            {formData.collaborators.map((collaborator, index) => (
                                <div key={index} className="flex flex-col bg-[color:var(--background)] p-3 rounded-md relative">
                                    <button
                                        type="button"
                                        onClick={() => removeCollaborator(index)}
                                        className="absolute top-2 right-2 text-[color:var(--error-color)] hover:text-red-700"
                                        disabled={isLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="font-medium text-[color:var(--text-color)]">{collaborator.name}</div>
                                    <div className="text-xs text-[color:var(--secondary-color)] truncate">{collaborator.url}</div>
                                    {collaborator.logo && (
                                        <div className="text-xs text-[color:var(--secondary-color)] truncate mt-1">Has logo</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCollaborator.name}
                                    onChange={handleCollaboratorChange}
                                    placeholder="Collaborator name"
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="logo"
                                    value={newCollaborator.logo}
                                    onChange={handleCollaboratorChange}
                                    placeholder="Logo URL"
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="url"
                                    value={newCollaborator.url}
                                    onChange={handleCollaboratorChange}
                                    placeholder="Website URL"
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={addCollaborator}
                            disabled={isLoading || !newCollaborator.name}
                            className="px-3 py-1.5 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center text-sm"
                        >
                            <Plus size={14} className="mr-1" /> Add Collaborator
                        </button>
                    </div>

                    {/* Links Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Links</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {formData.links.map((link, index) => (
                                <div key={index} className="flex items-center justify-between bg-[color:var(--background)] p-3 rounded-md">
                                    <div>
                                        <div className="font-medium text-[color:var(--text-color)]">{link.label}</div>
                                        <div className="text-xs text-[color:var(--secondary-color)] truncate">{link.url}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeLink(index)}
                                        className="text-[color:var(--error-color)] hover:text-red-700"
                                        disabled={isLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                            <div>
                                <input
                                    type="text"
                                    name="label"
                                    value={newLink.label}
                                    onChange={handleLinkChange}
                                    placeholder="Link label"
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="url"
                                    value={newLink.url}
                                    onChange={handleLinkChange}
                                    placeholder="URL"
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={addLink}
                            disabled={isLoading || !newLink.label || !newLink.url}
                            className="px-3 py-1.5 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center text-sm"
                        >
                            <Plus size={14} className="mr-1" /> Add Link
                        </button>
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
                            onClick={saveProject}
                            disabled={isLoading}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 flex items-center disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : <><Save size={16} className="mr-1" /> Save</>}
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="flex items-center mb-4 px-4 sm:px-0">
                    <Search size={18} className="text-[color:var(--secondary-color)] mr-2" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] w-full sm:w-64"
                    />
                </div>
                <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-[color:var(--border-color)]">
                            <thead>
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Project
                                    </th>
                                    <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Collaborators
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[color:var(--background)] divide-y divide-[color:var(--border-color)]">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id}>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className="flex items-center">
                                                {project.image && (
                                                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={project.image || '/images/project_fallback.png'}
                                                            alt={project.title}
                                                            className="object-cover"
                                                            unoptimized={true}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = '/images/project_fallback.png';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-[color:var(--text-color)]">{project.title}</div>
                                                    <div className="text-xs text-[color:var(--secondary-color)] line-clamp-1 sm:hidden">
                                                        {project.description.substring(0, 50)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-3 sm:px-6 py-4">
                                            <div className="text-sm text-[color:var(--text-color)] flex items-center">
                                                <Tag size={14} className="mr-1 flex-shrink-0" />
                                                <span className="capitalize">{project.category}</span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                                            <div className="text-sm text-[color:var(--text-color)]">
                                                {project.collaborators.length > 0
                                                    ? project.collaborators.map(c => c.name).join(', ')
                                                    : <span className="text-xs text-[color:var(--secondary-color)] italic">None</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-2 sm:space-x-4">
                                                <button
                                                    onClick={() => startEditing(project)}
                                                    disabled={isLoading}
                                                    className="text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] flex items-center disabled:opacity-50"
                                                >
                                                    <Edit size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(project)}
                                                    disabled={isLoading}
                                                    className="text-[color:var(--error-color)] hover:text-red-700 flex items-center disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProjects.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-[color:var(--secondary-color)]">
                                            {searchTerm ? 'No projects found matching your search.' : 'No projects found. Add your first project!'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProjects;
