import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, Calendar, MapPin, Clock, Link } from 'lucide-react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import ImageDropzone from '@/components/common/ImageDropzone';

interface Event {
    id?: number;
    slug: string;
    name: string;
    eventURL: string;
    location: string;
    locationURL: string;
    summary: string;
    detail: string;
    startTime: string;
    endTime: string;
    imageURLs: string[];
    presenters: string[];
    otherURLs: {
        code: string;
        pdf: string;
        slides: string;
        video: string;
    };
}

const EditEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [newPresenter, setNewPresenter] = useState('');
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        eventId: number | string | null;
        eventName: string;
    }>({
        isOpen: false,
        eventId: null,
        eventName: '',
    });
    const [formData, setFormData] = useState<Event>({
        slug: '',
        name: '',
        eventURL: '',
        location: '',
        locationURL: '',
        summary: '',
        detail: '',
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date().toISOString().slice(0, 16),
        imageURLs: [],
        presenters: [],
        otherURLs: {
            code: '',
            pdf: '',
            slides: '',
            video: ''
        }
    });
    const [newImageURL, setNewImageURL] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events data:', error);
            toast.error('Failed to load events data');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Handle nested properties like otherURLs.code
            const [parent, child] = name.split('.');
            if (parent === 'otherURLs') {
                setFormData(prev => ({
                    ...prev,
                    otherURLs: {
                        ...prev.otherURLs,
                        [child]: value
                    }
                }));
            } else {
                // Handle other nested properties if needed
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Auto-generate slug if name is being edited and slug is empty or auto-generated
        if (name === 'name' && (!formData.slug || formData.slug === generateSlug(formData.name))) {
            setFormData(prev => ({
                ...prev,
                slug: generateSlug(value)
            }));
        }
    };

    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')  // Remove special characters
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
            .trim();
    };

    const addPresenter = () => {
        if (!newPresenter) return;

        setFormData(prev => ({
            ...prev,
            presenters: [...prev.presenters, newPresenter]
        }));

        setNewPresenter('');
    };

    const removePresenter = (index: number) => {
        setFormData(prev => {
            const updatedPresenters = [...prev.presenters];
            updatedPresenters.splice(index, 1);
            return { ...prev, presenters: updatedPresenters };
        });
    };

    const addImageURL = () => {
        if (!newImageURL) return;

        setFormData(prev => ({
            ...prev,
            imageURLs: [...prev.imageURLs, newImageURL]
        }));

        setNewImageURL('');
    };

    const removeImageURL = (index: number) => {
        setFormData(prev => {
            const updatedImageURLs = [...prev.imageURLs];
            updatedImageURLs.splice(index, 1);
            return { ...prev, imageURLs: updatedImageURLs };
        });
    };

    const startEditing = (event: Event) => {
        if (event.id) {
            setEditingId(event.id);
        } else {
            setEditingId('unknown');
        }

        setFormData({
            ...event
        });

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startAdding = () => {
        const now = new Date().toISOString().slice(0, 16);
        const nextHour = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

        setEditingId('new'); // Use 'new' to indicate new event
        setFormData({
            slug: '',
            name: '',
            eventURL: '',
            location: '',
            locationURL: '',
            summary: '',
            detail: '',
            startTime: now,
            endTime: nextHour,
            imageURLs: [],
            presenters: [],
            otherURLs: {
                code: '',
                pdf: '',
                slides: '',
                video: ''
            }
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewPresenter('');
        setNewImageURL('');
    };

    const saveEvent = async () => {
        if (!formData.name || !formData.location || !formData.startTime || !formData.slug) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate end time is after start time if both are provided
        if (formData.startTime && formData.endTime &&
            new Date(formData.endTime) <= new Date(formData.startTime)) {
            toast.error('End time must be after start time');
            return;
        }

        setIsLoading(true);

        try {
            if (editingId === 'new') {
                // Add new event
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to add event');
                }

                toast.success('Event added successfully');
            } else {
                // Update existing event
                const response = await fetch('/api/events', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update event');
                }

                toast.success('Event updated successfully');
            }

            // Refresh the data
            await fetchEvents();
            cancelEditing();
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (event: Event) => {
        setDeleteModal({
            isOpen: true,
            eventId: event.slug,
            eventName: event.name,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            eventId: null,
            eventName: '',
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.eventId) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/events?slug=${deleteModal.eventId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            toast.success('Event deleted successfully');
            await fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete. Please try again.');
        } finally {
            setIsLoading(false);
            closeDeleteModal();
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return dateString;
            }

            // Format: "Jan 1, 2023 2:30 PM"
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();

            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12 for 12 AM

            return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
        } catch (error) {
            return dateString;
        }
    };

    // Function to handle image upload for events
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
            formDataObj.append('type', 'events');

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
                // Add the image URL to the imageURLs array
                setFormData(prev => ({
                    ...prev,
                    imageURLs: [...prev.imageURLs, result.filePath]
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

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                title="Delete Event"
                message={`Are you sure you want to delete "${deleteModal.eventName}"? This action cannot be undone.`}
            />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] mb-2 sm:mb-0">Events Management</h2>
                <button
                    onClick={startAdding}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                >
                    <Plus size={16} /> <span>Add Event</span>
                </button>
            </div>

            {editingId !== null && (
                <div className="mb-8 bg-[color:var(--foreground)] p-4 rounded-lg border border-[color:var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-color)] flex items-center">
                        {editingId === 'new' ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                        {editingId === 'new' ? 'Add New Event' : 'Edit Event'}
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
                                    placeholder="Event name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Slug* (URL-friendly name) <span className="text-xs ml-2 text-[color:var(--info-color)]">(Auto-generated, not editable)</span>
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    readOnly
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] opacity-70"
                                    placeholder="event-name-slug"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Clock size={14} className="mr-1" /> <span>Start Time*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Clock size={14} className="mr-1" /> <span>End Time</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Location</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <MapPin size={14} className="mr-1" /> <span>Location Name*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="Event location"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Link size={14} className="mr-1" /> <span>Location URL (full address)</span>
                                </label>
                                <input
                                    type="text"
                                    name="locationURL"
                                    value={formData.locationURL}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="Full address or Google Maps URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Event URL Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Link size={14} className="mr-1" /> <span>Event URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="eventURL"
                                    value={formData.eventURL}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="https://example.com/event"
                                />
                            </div>
                        </div>

                        <h4 className="text-sm font-medium mb-2 text-[color:var(--secondary-color)]">Other URLs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Link size={14} className="mr-1" /> <span>Code URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="otherURLs.code"
                                    value={formData.otherURLs.code}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="GitHub repository URL"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Link size={14} className="mr-1" /> <span>PDF URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="otherURLs.pdf"
                                    value={formData.otherURLs.pdf}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="PDF document URL"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Link size={14} className="mr-1" /> <span>Slides URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="otherURLs.slides"
                                    value={formData.otherURLs.slides}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="Presentation slides URL"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Link size={14} className="mr-1" /> <span>Video URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="otherURLs.video"
                                    value={formData.otherURLs.video}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="YouTube or other video URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Content</h4>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Summary*
                            </label>
                            <input
                                type="text"
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="Brief summary of the event"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Detailed Description
                            </label>
                            <textarea
                                name="detail"
                                value={formData.detail}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="Full description of the event..."
                            />
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Images</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <ImageDropzone
                                    onImageUpload={handleImageUpload}
                                    currentImage={formData.imageURLs[0] || ''}
                                    isLoading={isUploading}
                                    fallbackImage="/images/event_fallback.png"
                                    roundedFull={false}
                                />
                                <p className="text-xs mt-2 text-[color:var(--secondary-color)]">
                                    Upload an image to add to the event gallery
                                </p>
                            </div>
                            <div>
                                <div className="mb-3">
                                    <h5 className="text-sm font-medium mb-2 text-[color:var(--secondary-color)]">Current Images</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.imageURLs || []).map((url, index) => (
                                            <div key={index} className="flex items-center bg-[color:var(--background)] p-2 rounded-md max-w-full text-[color:var(--tertiary-color)]">
                                                <span className="text-sm mr-2 truncate max-w-xs">{url.split('/').pop()}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageURL(index)}
                                                    className="text-[color:var(--error-color)] hover:text-red-700 flex-shrink-0"
                                                    disabled={isLoading}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.imageURLs.length === 0 && (
                                            <p className="text-sm text-[color:var(--secondary-color)]">No images added yet</p>
                                        )}
                                    </div>
                                </div>
                                <h5 className="text-sm font-medium mb-2 text-[color:var(--secondary-color)]">Add Image URL Manually</h5>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newImageURL}
                                        onChange={(e) => setNewImageURL(e.target.value)}
                                        placeholder="Add an image URL"
                                        className="flex-grow px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={addImageURL}
                                        disabled={isLoading || !newImageURL}
                                        className="px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center"
                                    >
                                        <Plus size={16} className="mr-1" /> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Presenters Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Presenters</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(formData.presenters || []).map((presenter, index) => (
                                <div key={index} className="flex items-center bg-[color:var(--background)] p-2 rounded-md">
                                    <span className="text-sm mr-2">{presenter}</span>
                                    <button
                                        type="button"
                                        onClick={() => removePresenter(index)}
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
                                value={newPresenter}
                                onChange={(e) => setNewPresenter(e.target.value)}
                                placeholder="Add a presenter"
                                className="flex-grow px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={addPresenter}
                                disabled={isLoading || !newPresenter}
                                className="px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center"
                            >
                                <Plus size={16} className="mr-1" /> Add
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
                            onClick={saveEvent}
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
                        placeholder="Search events..."
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
                                        Event
                                    </th>
                                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-[color:var(--secondary-color)] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[color:var(--background)] divide-y divide-[color:var(--border-color)]">
                                {filteredEvents.map((event) => (
                                    <tr key={event.slug}>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className="flex items-center">
                                                {event.imageURLs && event.imageURLs.length > 0 && (
                                                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={event.imageURLs[0] || '/images/event_fallback.png'}
                                                            alt={event.name}
                                                            className="object-cover"
                                                            unoptimized={true}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = '/images/event_fallback.png';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-[color:var(--text-color)]">{event.name}</div>
                                                    <div className="sm:hidden text-xs text-[color:var(--secondary-color)]">
                                                        {formatDate(event.startTime)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                                            <div className="text-sm text-[color:var(--text-color)]">
                                                {formatDate(event.startTime)}
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-3 sm:px-6 py-4">
                                            <div className="text-sm text-[color:var(--text-color)] flex items-center">
                                                <MapPin size={14} className="mr-1 flex-shrink-0" />
                                                <span className="line-clamp-2">{event.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-2 sm:space-x-4">
                                                <button
                                                    onClick={() => startEditing(event)}
                                                    disabled={isLoading}
                                                    className="text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] flex items-center disabled:opacity-50"
                                                >
                                                    <Edit size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(event)}
                                                    disabled={isLoading}
                                                    className="text-[color:var(--error-color)] hover:text-red-700 flex items-center disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-[color:var(--secondary-color)]">
                                            {searchTerm ? 'No events found matching your search.' : 'No events found. Add your first event!'}
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

export default EditEvents;
