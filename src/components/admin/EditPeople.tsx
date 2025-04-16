import React, { useState, useEffect, useCallback } from 'react';
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

interface ImageDropzoneProps {
    onImageUpload: (file: File) => void;
    currentImage?: string;
    isLoading: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageUpload, currentImage, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        // Clear the preview when the component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setIsDragging(true);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            // Check if file is an image
            if (!file.type.match('image.*')) {
                toast.error('Please upload an image file');
                return;
            }

            // Create preview
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));

            // Pass the file to parent component
            onImageUpload(file);
        }
    }, [onImageUpload, previewUrl]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Create preview
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));

            // Pass the file to parent component
            onImageUpload(file);
        }
    }, [onImageUpload, previewUrl]);

    // Decide what image to show
    const imageToShow = previewUrl || currentImage || '/images/person_fallback.png';

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isDragging
                ? 'border-[color:var(--primary-color)] bg-[color:var(--primary-color)] bg-opacity-10'
                : 'border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]'
                }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
                disabled={isLoading}
            />

            <div className="mb-4 relative mx-auto w-32 h-32 overflow-hidden rounded-full bg-gray-100">
                <Image
                    src={imageToShow}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    unoptimized={true}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + '/images/person_fallback.png') {
                            target.src = '/images/person_fallback.png';
                        }
                    }}
                />
            </div>

            <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-4 bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)] transition-colors"
            >
                <Upload size={16} /> Choose Image
            </label>

            <p className="mt-2 text-sm text-[color:var(--secondary-color)]">
                Drag & drop an image or click to browse
            </p>
            <p className="mt-1 text-xs text-[color:var(--secondary-color)]">
                JPEG, PNG, or WebP (max 5MB)
            </p>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[color:var(--primary-color)]"></div>
                </div>
            )}
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
    const [isUploading, setIsUploading] = useState(false);
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
    // New state for unique titles
    const [uniqueTitles, setUniqueTitles] = useState<string[]>([]);
    const [customTitle, setCustomTitle] = useState<string>('');

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
            // Extract unique titles
            const titles = new Set<string>();

            allCategories.forEach(category => {
                const peopleInCategory = data[category].map((person: Person) => {
                    // Add title to the set
                    if (person.title) {
                        titles.add(person.title);
                    }
                    return {
                        ...person,
                        category
                    };
                });
                allPeople.push(...peopleInCategory);
            });

            setPeople(allPeople);
            // Set unique titles
            setUniqueTitles(Array.from(titles).sort());
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

    // New handler for title dropdown
    const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "custom") {
            // Do not change the title if "custom" is selected
            return;
        }
        setFormData((prev) => ({ ...prev, title: value }));
    };

    // New handler for custom title input
    const handleCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomTitle(value);
        setFormData((prev) => ({ ...prev, title: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, category: e.target.value }));
    };

    // New function to handle image upload
    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Generate a slug if it exists
            const slug = formData.slug || (formData.name ? generateSlug(formData.name) : '');

            const formDataObj = new FormData();
            formDataObj.append('file', file);
            formDataObj.append('type', 'people');

            // Only pass the slug if we have one, otherwise the API will use the original filename
            if (slug) {
                formDataObj.append('slug', slug);
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
                    imageURL: result.filePath
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
        // Check if the person's title exists in unique titles
        setCustomTitle(uniqueTitles.includes(person.title) ? '' : person.title);

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setCustomTitle('');
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
        setCustomTitle('');
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
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
                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={uniqueTitles.includes(formData.title) ? formData.title : 'custom'}
                                            onChange={handleTitleChange}
                                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                            disabled={isLoading}
                                        >
                                            <option value="">Select title</option>
                                            {uniqueTitles.map((title) => (
                                                <option key={title} value={title}>
                                                    {title}
                                                </option>
                                            ))}
                                            <option value="custom">Custom title</option>
                                        </select>
                                        {!uniqueTitles.includes(formData.title) && (
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={handleCustomTitleChange}
                                                placeholder="Enter custom title"
                                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                                disabled={isLoading}
                                            />
                                        )}
                                    </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Slug (URL identifier) <span className="text-xs ml-2 text-[color:var(--info-color)]">(Auto-generated, not editable)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        readOnly
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] opacity-70"
                                    />
                                    {editingSlug === 'new' && formData.name && (
                                        <p className="text-xs text-[color:var(--secondary-color)] mt-1">
                                            Auto-generated from name: {generateSlug(formData.name)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Profile Image
                                    </label>
                                    <ImageDropzone
                                        onImageUpload={handleImageUpload}
                                        currentImage={formData.imageURL}
                                        isLoading={isUploading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mt-8 mb-1">
                                        Image URL <span className="text-xs ml-2 text-[color:var(--info-color)]">(Updated automatically when image is uploaded)</span>
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
                            disabled={isLoading || isUploading}
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