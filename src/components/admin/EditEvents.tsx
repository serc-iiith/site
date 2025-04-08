import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface Event {
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    year: number;
    image: string;
    presenters: string[];
}

const EditEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [newPresenter, setNewPresenter] = useState('');
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        eventId: number | null;
        eventName: string;
    }>({
        isOpen: false,
        eventId: null,
        eventName: '',
    });
    const [formData, setFormData] = useState<Event>({
        id: 0,
        name: '',
        description: '',
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date().toISOString().slice(0, 16),
        location: '',
        year: new Date().getFullYear(),
        image: '',
        presenters: []
    });

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

        // Special handling for date fields
        if (name === 'startTime' || name === 'endTime') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                // Update year if start time changes
                ...(name === 'startTime' ? { year: new Date(value).getFullYear() } : {})
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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

    const startEditing = (event: Event) => {
        setEditingId(event.id);
        setFormData({
            ...event,
            // Ensure date strings are formatted for datetime-local input
            startTime: event.startTime.slice(0, 16),
            endTime: event.endTime.slice(0, 16)
        });
    };

    const startAdding = () => {
        const now = new Date().toISOString().slice(0, 16);
        const nextHour = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

        setEditingId(-1); // Use -1 to indicate new event
        setFormData({
            id: 0, // Will be calculated when saving
            name: '',
            description: '',
            startTime: now,
            endTime: nextHour,
            location: '',
            year: new Date().getFullYear(),
            image: '',
            presenters: []
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewPresenter('');
    };

    const saveEvent = async () => {
        if (!formData.name || !formData.location || !formData.startTime || !formData.endTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate end time is after start time
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            toast.error('End time must be after start time');
            return;
        }

        setIsLoading(true);

        try {
            if (editingId === -1) {
                // Add new event
                const newId = events.length > 0
                    ? Math.max(...events.map(e => e.id)) + 1
                    : 1;

                const newEvent = {
                    ...formData,
                    id: newId
                };

                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEvent)
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
            eventId: event.id,
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
            const response = await fetch(`/api/events?id=${deleteModal.eventId}`, {
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

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.year.toString().includes(searchTerm)
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
                        {editingId === -1 ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                        {editingId === -1 ? 'Add New Event' : 'Edit Event'}
                    </h3>

                    {/* Basic Information Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Event Details</h4>
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
                                    Location*
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
                                    <Clock size={16} className="mr-1" /> Start Time*
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
                                    <Clock size={16} className="mr-1" /> End Time*
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
                            <div>
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1 flex items-center">
                                    <Calendar size={16} className="mr-1" /> Year (auto-set from start date)
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={true}
                                />
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
                                    placeholder="URL to event image"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-[color:var(--text-color)]">Description</h4>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                            disabled={isLoading}
                            placeholder="Event description..."
                        />
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
                                    <tr key={event.id}>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className="flex items-center">
                                                {event.image && (
                                                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={event.image || '/images/event_fallback.png'}
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
