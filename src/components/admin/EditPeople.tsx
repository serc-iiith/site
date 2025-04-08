import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, Upload, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface SocialLinks {
    [key: string]: string;
}

interface Education {
    degree: string;
    institution: string;
    year: number;
}

interface Person {
    name: string;
    title: string;
    email: string;
    imageURL: string;
    slug: string;
    social_links: SocialLinks;
    interests?: string[];
    education?: Education[];
    bio?: string;
    category?: string; // To track which category this person belongs to
}

// A custom modal component for confirming deletion
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    personName: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, personName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[color:var(--foreground)] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-[color:var(--border-color)]">
                <div className="flex items-center mb-4">
                    <AlertTriangle size={24} className="text-[color:var(--error-color)] mr-3" />
                    <h3 className="text-lg font-bold text-[color:var(--text-color)]">Confirm Deletion</h3>
                </div>
                <p className="mb-6 text-[color:var(--text-color)]">
                    Are you sure you want to delete <span className="font-semibold">{personName}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-[color:var(--border-color)] rounded-md text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[color:var(--error-color)] text-white rounded-md hover:bg-opacity-90"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PeopleData {
    [key: string]: Person[];
}

const EditPeople: React.FC = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [newSocialPlatform, setNewSocialPlatform] = useState<string>('');
    const [newSocialLink, setNewSocialLink] = useState<string>('');
    const [newInterest, setNewInterest] = useState<string>('');
    const [newEducation, setNewEducation] = useState<Education>({
        degree: '',
        institution: '',
        year: new Date().getFullYear(),
    });
    const [formData, setFormData] = useState<Person>({
        name: '',
        title: '',
        email: '',
        imageURL: '',
        slug: '',
        social_links: {},
        interests: [],
        education: [],
        bio: '',
        category: '',
    });

    // New state for deletion modal
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        slug: string;
        name: string;
    }>({
        isOpen: false,
        slug: '',
        name: '',
    });

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const response = await fetch('/api/people');
            const data = await response.json();

            // Flatten the people data from all categories
            const allCategories = Object.keys(data);
            setCategories(allCategories);

            const allPeople: Person[] = [];
            allCategories.forEach(category => {
                const peopleInCategory = data[category].map((person: Person) => ({
                    ...person,
                    category
                }));
                allPeople.push(...peopleInCategory);
            });

            setPeople(allPeople);
        } catch (error) {
            console.error('Error fetching people data:', error);
            toast.error('Failed to load people data');
        }
    };

    // Generate a slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            // If name is being changed and we're adding a new person, auto-generate the slug
            if (name === 'name' && editingSlug === 'new' && (!prev.slug || prev.slug === generateSlug(prev.name))) {
                return { ...prev, [name]: value, slug: generateSlug(value) };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, category: e.target.value }));
    };

    // Handle social links
    const addSocialLink = () => {
        if (!newSocialPlatform || !newSocialLink) return;

        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [newSocialPlatform]: newSocialLink
            }
        }));

        setNewSocialPlatform('');
        setNewSocialLink('');
    };

    const removeSocialLink = (platform: string) => {
        setFormData(prev => {
            const updatedLinks = { ...prev.social_links };
            delete updatedLinks[platform];
            return { ...prev, social_links: updatedLinks };
        });
    };

    // Handle interests
    const addInterest = () => {
        if (!newInterest) return;

        setFormData(prev => ({
            ...prev,
            interests: [...(prev.interests || []), newInterest]
        }));

        setNewInterest('');
    };

    const removeInterest = (index: number) => {
        setFormData(prev => {
            const updatedInterests = [...(prev.interests || [])];
            updatedInterests.splice(index, 1);
            return { ...prev, interests: updatedInterests };
        });
    };

    // Handle education
    const addEducation = () => {
        if (!newEducation.degree || !newEducation.institution) return;

        setFormData(prev => ({
            ...prev,
            education: [...(prev.education || []), newEducation]
        }));

        setNewEducation({
            degree: '',
            institution: '',
            year: new Date().getFullYear()
        });
    };

    const removeEducation = (index: number) => {
        setFormData(prev => {
            const updatedEducation = [...(prev.education || [])];
            updatedEducation.splice(index, 1);
            return { ...prev, education: updatedEducation };
        });
    };

    const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEducation(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
        }));
    };

    const startEditing = (person: Person) => {
        setEditingSlug(person.slug);
        setFormData({
            ...person,
            interests: person.interests || [],
            education: person.education || [],
            bio: person.bio || '',
        });
    };

    const startAdding = () => {
        setEditingSlug('new');
        setFormData({
            name: '',
            title: '',
            email: '',
            imageURL: '',
            slug: '',
            social_links: {},
            interests: [],
            education: [],
            bio: '',
            category: categories[0] || '',
        });
    };

    const cancelEditing = () => {
        setEditingSlug(null);
        setFormData({
            name: '',
            title: '',
            email: '',
            imageURL: '',
            slug: '',
            social_links: {},
            interests: [],
            education: [],
            bio: '',
            category: '',
        });
        setNewSocialPlatform('');
        setNewSocialLink('');
        setNewInterest('');
        setNewEducation({
            degree: '',
            institution: '',
            year: new Date().getFullYear()
        });
    };

    const savePerson = async () => {
        if (!formData.name || !formData.title || !formData.category) {
            // Simple validation - note that slug is no longer required
            toast.error('Please fill in all required fields');
            return;
        }

        // Generate slug if not provided
        if (!formData.slug) {
            formData.slug = generateSlug(formData.name);
        }

        setIsLoading(true);

        try {
            // Remove the category field from the person object as it's not stored in the JSON structure
            const { category, ...personData } = formData;

            if (editingSlug === 'new') {
                // Add new person
                const response = await fetch('/api/people', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        person: personData,
                        category: formData.category
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to add person');
                }

                toast.success('Person added successfully');
            } else {
                // Update existing person
                const response = await fetch('/api/people', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        person: personData,
                        category: formData.category,
                        oldCategory: people.find(p => p.slug === editingSlug)?.category,
                        oldSlug: editingSlug
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update person');
                }

                toast.success('Person updated successfully');
            }

            // Refresh the data
            await fetchPeople();
            cancelEditing();
        } catch (error) {
            console.error('Error saving person:', error);
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (person: Person) => {
        setDeleteModal({
            isOpen: true,
            slug: person.slug,
            name: person.name,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            slug: '',
            name: '',
        });
    };

    const confirmDelete = async () => {
        const slug = deleteModal.slug;
        const person = people.find(p => p.slug === slug);

        if (!person || !person.category) {
            toast.error('Person not found');
            closeDeleteModal();
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/people?slug=${slug}&category=${person.category}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete person');
            }

            toast.success('Person deleted successfully');
            await fetchPeople();
        } catch (error) {
            console.error('Error deleting person:', error);
            toast.error('Failed to delete. Please try again.');
        } finally {
            setIsLoading(false);
            closeDeleteModal();
        }
    };

    // Replace the deletePerson function
    const deletePerson = (person: Person) => {
        openDeleteModal(person);
    };

    const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.category && person.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-[color:var(--background)] rounded-lg shadow-lg p-4 sm:p-6 border border-[color:var(--border-color)]">
            {/* Delete confirmation modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                personName={deleteModal.name}
            />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] mb-2 sm:mb-0">People Management</h2>
                <button
                    onClick={startAdding}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                >
                    <Plus size={16} /> <span>Add Person</span>
                </button>
            </div>

            {editingSlug !== null && (
                <div className="mb-8 bg-[color:var(--foreground)] p-4 rounded-lg border border-[color:var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-color)] flex items-center">
                        {editingSlug === 'new' ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                        {editingSlug === 'new' ? 'Add New Person' : 'Edit Person'}
                    </h3>

                    {/* Basic Information Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Basic Information</h4>
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
                                />
                            </div>
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
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Upload size={16} className="mr-1" /> Image URL
                                </label>
                                <input
                                    type="text"
                                    name="imageURL"
                                    value={formData.imageURL || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Slug (URL identifier - auto-generated if empty)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading || editingSlug !== 'new'} // Only allow slug editing for new people
                                />
                                {editingSlug === 'new' && formData.name && (
                                    <p className="text-xs text-[color:var(--secondary-color)] mt-1">
                                        Auto-generated from name: {generateSlug(formData.name)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Category*
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Biography Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Biography</h4>
                        <textarea
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                            disabled={isLoading}
                            placeholder="Enter biography..."
                        />
                    </div>

                    {/* Social Links Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Social Links</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {Object.entries(formData.social_links || {}).map(([platform, link]) => (
                                <div key={platform} className="flex items-center bg-[color:var(--background)] p-2 rounded-md">
                                    <span className="text-sm text-text mr-2">{platform}: {link}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSocialLink(platform)}
                                        className="text-[color:var(--error-color)] hover:text-red-700"
                                        disabled={isLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                                type="text"
                                value={newSocialPlatform}
                                onChange={(e) => setNewSocialPlatform(e.target.value)}
                                placeholder="Platform (e.g., LinkedIn)"
                                className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                value={newSocialLink}
                                onChange={(e) => setNewSocialLink(e.target.value)}
                                placeholder="URL"
                                className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={addSocialLink}
                                disabled={isLoading || !newSocialPlatform || !newSocialLink}
                                className="px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center"
                            >
                                <Plus size={16} className="mr-1" /> Add Link
                            </button>
                        </div>
                    </div>

                    {/* Interests Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Research Interests</h4>
                        <div className="flex flex-wrap gap-2 mb-3 text-text">
                            {(formData.interests || []).map((interest, index) => (
                                <div key={index} className="flex items-center bg-[color:var(--background)] p-2 rounded-md">
                                    <span className="text-sm mr-2">{interest}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeInterest(index)}
                                        className="text-[color:var(--error-color)] hover:text-red-700"
                                        disabled={isLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                placeholder="Add a research interest"
                                className="flex-grow px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={addInterest}
                                disabled={isLoading || !newInterest}
                                className="px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center"
                            >
                                <Plus size={16} className="mr-1" /> Add
                            </button>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Education</h4>
                        <div className="space-y-3 mb-4">
                            {(formData.education || []).map((edu, index) => (
                                <div key={index} className="flex items-center justify-between bg-[color:var(--background)] p-3 rounded-md">
                                    <div>
                                        <p className="font-medium text-[color:var(--text-color)]">{edu.degree}</p>
                                        <p className="text-sm text-[color:var(--secondary-color)]">{edu.institution}, {edu.year}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="text-[color:var(--error-color)] hover:text-red-700"
                                        disabled={isLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            <input
                                type="text"
                                name="degree"
                                value={newEducation.degree}
                                onChange={handleEducationChange}
                                placeholder="Degree"
                                className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                name="institution"
                                value={newEducation.institution}
                                onChange={handleEducationChange}
                                placeholder="Institution"
                                className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <input
                                type="number"
                                name="year"
                                value={newEducation.year}
                                onChange={handleEducationChange}
                                placeholder="Year"
                                className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={addEducation}
                                disabled={isLoading || !newEducation.degree || !newEducation.institution}
                                className="px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center"
                            >
                                <Plus size={16} className="mr-1" /> Add Education
                            </button>
                        </div>
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
                            onClick={savePerson}
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
                        placeholder="Search people..."
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
                                        Person
                                    </th>
                                    <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[color:var(--background)] divide-y divide-[color:var(--border-color)]">
                                {filteredPeople.map((person) => (
                                    <tr key={person.slug}>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-100">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        src={person.imageURL && person.imageURL.trim() !== '' ? person.imageURL : '/images/person_fallback.png'}
                                                        alt={person.name}
                                                        className="object-cover transition-transform duration-500 hover:scale-110"
                                                        unoptimized={true}
                                                        onError={() => {
                                                            const img = document.querySelector(`img[alt="${person.name}"]`) as HTMLImageElement;
                                                            if (img && img.src !== window.location.origin + '/images/person_fallback.png') {
                                                                img.src = '/images/person_fallback.png';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-2 sm:ml-4">
                                                    <div className="text-xs sm:text-sm font-medium text-[color:var(--text-color)]">{person.name}</div>
                                                    <div className="sm:hidden text-xs text-[color:var(--secondary-color)]">{person.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[color:var(--text-color)]">{person.title}</div>
                                        </td>
                                        <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[color:var(--text-color)]">{person.category}</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-2 sm:space-x-4">
                                                <button
                                                    onClick={() => startEditing(person)}
                                                    disabled={isLoading}
                                                    className="text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] flex items-center disabled:opacity-50"
                                                >
                                                    <Edit size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => deletePerson(person)}
                                                    disabled={isLoading}
                                                    className="text-[color:var(--error-color)] hover:text-red-700 flex items-center disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPeople;