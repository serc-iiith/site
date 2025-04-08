import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, BookOpen, Link as LinkIcon, User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface Paper {
    authors: string[];
    year: string;
    title: string;
    cite: string;
    venue: string;
    doi?: string;
    url?: string;
}

const EditPapers: React.FC = () => {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [currentAuthors, setCurrentAuthors] = useState<string[]>([]);
    const [newAuthor, setNewAuthor] = useState<string>('');
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        paper: Paper | null;
    }>({
        isOpen: false,
        paper: null,
    });
    const [formData, setFormData] = useState<Paper & { originalTitle?: string; originalYear?: string; originalAuthors?: string[] }>({
        authors: [],
        year: '',
        title: '',
        cite: '',
        venue: '',
        doi: '',
        url: '',
    });

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/papers');
            if (!response.ok) {
                throw new Error('Failed to fetch papers');
            }
            const data = await response.json();
            setPapers(data);
        } catch (error) {
            console.error('Error fetching papers data:', error);
            toast.error('Failed to load papers data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addAuthor = () => {
        if (!newAuthor.trim()) return;
        setCurrentAuthors(prev => [...prev, newAuthor.trim()]);
        setNewAuthor('');
    };

    const removeAuthor = (index: number) => {
        setCurrentAuthors(prev => prev.filter((_, i) => i !== index));
    };

    const handleAuthorKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newAuthor.trim()) {
            e.preventDefault();
            addAuthor();
        }
    };

    const startEditing = (paper: Paper) => {
        setFormData({
            ...paper,
            originalTitle: paper.title,
            originalYear: paper.year,
            originalAuthors: [...paper.authors],
        });
        setCurrentAuthors([...paper.authors]);
        setIsEditing(true);
        setIsNew(false);
    };

    const startAdding = () => {
        setFormData({
            authors: [],
            year: new Date().getFullYear().toString(),
            title: '',
            cite: '',
            venue: '',
            doi: '',
            url: '',
        });
        setCurrentAuthors([]);
        setIsEditing(true);
        setIsNew(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setIsNew(false);
        setCurrentAuthors([]);
        setNewAuthor('');
    };

    const savePaper = async () => {
        if (!formData.title || !currentAuthors.length || !formData.year || !formData.venue) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // Update form data with current authors
            const paperData = {
                ...formData,
                authors: currentAuthors,
            };

            if (isNew) {
                // Add new paper
                const response = await fetch('/api/papers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paperData)
                });

                if (!response.ok) {
                    throw new Error('Failed to add paper');
                }

                toast.success('Paper added successfully');
            } else {
                // Update existing paper
                const response = await fetch('/api/papers', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paperData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update paper');
                }

                toast.success('Paper updated successfully');
            }

            // Refresh the data
            await fetchPapers();
            cancelEditing();
        } catch (error) {
            console.error('Error saving paper:', error);
            toast.error('Failed to save paper');
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (paper: Paper) => {
        setDeleteModal({
            isOpen: true,
            paper,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            paper: null,
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.paper) return;

        setIsLoading(true);

        try {
            const paper = deleteModal.paper;
            const queryParams = new URLSearchParams({
                title: paper.title,
                year: paper.year,
                authors: JSON.stringify(paper.authors)
            });

            const response = await fetch(`/api/papers?${queryParams}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete paper');
            }

            toast.success('Paper deleted successfully');
            await fetchPapers();
        } catch (error) {
            console.error('Error deleting paper:', error);
            toast.error('Failed to delete paper');
        } finally {
            setIsLoading(false);
            closeDeleteModal();
        }
    };

    const filteredPapers = papers.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        paper.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.year.includes(searchTerm)
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
                title="Delete Research Paper"
                message={`Are you sure you want to delete "${deleteModal.paper?.title}"? This action cannot be undone.`}
            />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] mb-2 sm:mb-0">Research Papers Management</h2>
                <button
                    onClick={startAdding}
                    disabled={isLoading || isEditing}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                >
                    <Plus size={16} /> <span>Add Paper</span>
                </button>
            </div>

            {isEditing && (
                <div className="mb-8 bg-[color:var(--foreground)] p-4 rounded-lg border border-[color:var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-color)] flex items-center">
                        {isNew ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                        {isNew ? 'Add New Research Paper' : 'Edit Research Paper'}
                    </h3>

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
                                placeholder="Paper title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                Year*
                            </label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="Publication year"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                            Venue*
                        </label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                            disabled={isLoading}
                            placeholder="Publication venue (e.g., conference or journal name)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                DOI
                            </label>
                            <input
                                type="text"
                                name="doi"
                                value={formData.doi || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="DOI reference (e.g., 10.1145/...)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                URL
                            </label>
                            <input
                                type="text"
                                name="url"
                                value={formData.url || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="Link to the paper"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                            Authors*
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {currentAuthors.map((author, index) => (
                                <div key={index} className="flex items-center bg-[color:var(--background)] text-[color:var(--text-color)] rounded-md px-2 py-1">
                                    <span>{author}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAuthor(index)}
                                        className="ml-2 text-[color:var(--secondary-color)] hover:text-[color:var(--error-color)]"
                                        disabled={isLoading}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                                onKeyPress={handleAuthorKeyPress}
                                className="flex-grow px-3 py-2 border border-[color:var(--border-color)] rounded-l-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                disabled={isLoading}
                                placeholder="Add an author"
                            />
                            <button
                                type="button"
                                onClick={addAuthor}
                                disabled={isLoading || !newAuthor.trim()}
                                className="px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-r-md hover:bg-opacity-90 disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                        <p className="text-xs text-[color:var(--secondary-color)] mt-1">
                            Press Enter to add multiple authors
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                            Citation (BibTeX)
                        </label>
                        <textarea
                            name="cite"
                            value={formData.cite}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] font-mono text-sm"
                            disabled={isLoading}
                            placeholder="BibTeX citation"
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
                            onClick={savePaper}
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
                        placeholder="Search papers by title, author, venue, year..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] w-full"
                    />
                </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
                {isLoading && !isEditing ? (
                    <div className="text-center py-8 text-[color:var(--secondary-color)]">
                        Loading papers...
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="text-center py-8 text-[color:var(--secondary-color)]">
                        {searchTerm
                            ? 'No papers found matching your search criteria.'
                            : 'No papers found. Add your first research paper!'
                        }
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPapers.map((paper, index) => (
                            <div
                                key={index}
                                className="p-4 bg-[color:var(--foreground)] rounded-lg border border-[color:var(--border-color)]"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-md font-medium text-[color:var(--text-color)]">
                                        {paper.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(paper)}
                                            disabled={isLoading || isEditing}
                                            className="text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] p-1"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(paper)}
                                            disabled={isLoading || isEditing}
                                            className="text-[color:var(--error-color)] hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-[color:var(--secondary-color)] mt-2">
                                    <BookOpen size={14} className="mr-1" />
                                    <span className="mr-2">{paper.venue}</span>
                                    <span className="mr-2">•</span>
                                    <span>{paper.year}</span>
                                </div>

                                <div className="flex flex-wrap items-center text-sm mt-2">
                                    <User size={14} className="mr-1 text-[color:var(--secondary-color)]" />
                                    {paper.authors.map((author, i) => (
                                        <React.Fragment key={i}>
                                            <span className="text-[color:var(--text-color)]">{author}</span>
                                            {i < paper.authors.length - 1 && <span className="text-[color:var(--secondary-color)] mx-1">•</span>}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {(paper.doi || paper.url) && (
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {paper.doi && (
                                            <a
                                                href={`https://doi.org/${paper.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-xs text-[color:var(--primary-color)] hover:underline"
                                            >
                                                <LinkIcon size={12} className="mr-1" />
                                                DOI: {paper.doi}
                                            </a>
                                        )}
                                        {paper.url && (
                                            <a
                                                href={paper.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-xs text-[color:var(--primary-color)] hover:underline"
                                            >
                                                <LinkIcon size={12} className="mr-1" />
                                                Link to paper
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditPapers;
