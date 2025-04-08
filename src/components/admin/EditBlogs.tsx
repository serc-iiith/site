import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Save, Search, Trash2, Calendar, Clock, Tag, User } from 'lucide-react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface Blog {
    id: number;
    title: string;
    slug: string;
    author: string;
    role: string;
    date: string;
    readTime: number;
    category: string;
    coverImage: string;
    excerpt: string;
    content: string;
}

const EditBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        blogId: number | null;
        blogTitle: string;
    }>({
        isOpen: false,
        blogId: null,
        blogTitle: '',
    });
    const [formData, setFormData] = useState<Blog & { generateNewSlug?: boolean }>({
        id: 0,
        title: '',
        slug: '',
        author: '',
        role: '',
        date: '',
        readTime: 5,
        category: '',
        coverImage: '',
        excerpt: '',
        content: '',
        generateNewSlug: false
    });

    const categories = [
        'Software Architecture',
        'Software Engineering',
        'Machine Learning',
        'Research',
        'Education',
        'Announcements',
        'Events'
    ];

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('/api/blogs');
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs data:', error);
            toast.error('Failed to load blogs data');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // If title is being changed, mark for slug update
        if (name === 'title' && editingId !== null && editingId !== -1) {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                generateNewSlug: true
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const startEditing = (blog: Blog) => {
        setEditingId(blog.id);
        setFormData({
            ...blog,
            generateNewSlug: false
        });
        setIsPreviewMode(false);
    };

    const startAdding = () => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        setEditingId(-1); // Use -1 to indicate new blog
        setFormData({
            id: 0,
            title: '',
            slug: '',
            author: '',
            role: '',
            date: today.toLocaleDateString('en-US', options),
            readTime: 5,
            category: '',
            coverImage: '',
            excerpt: '',
            content: '## Introduction\n\nStart your blog post here...',
            generateNewSlug: false
        });
        setIsPreviewMode(false);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setIsPreviewMode(false);
    };

    const saveBlog = async () => {
        if (!formData.title || !formData.author || !formData.content || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            if (editingId === -1) {
                // Add new blog
                const response = await fetch('/api/blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to add blog post');
                }

                toast.success('Blog post added successfully');
            } else {
                // Update existing blog
                const response = await fetch('/api/blogs', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update blog post');
                }

                toast.success('Blog post updated successfully');
            }

            // Refresh the data
            await fetchBlogs();
            cancelEditing();
        } catch (error) {
            console.error('Error saving blog:', error);
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (blog: Blog) => {
        setDeleteModal({
            isOpen: true,
            blogId: blog.id,
            blogTitle: blog.title,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            blogId: null,
            blogTitle: '',
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.blogId) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/blogs?id=${deleteModal.blogId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog post');
            }

            toast.success('Blog post deleted successfully');
            await fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete. Please try again.');
        } finally {
            setIsLoading(false);
            closeDeleteModal();
        }
    };

    const togglePreviewMode = () => {
        setIsPreviewMode(!isPreviewMode);
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
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
                title="Delete Blog Post"
                message={`Are you sure you want to delete "${deleteModal.blogTitle}"? This action cannot be undone.`}
            />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] mb-2 sm:mb-0">Blog Management</h2>
                <button
                    onClick={startAdding}
                    disabled={isLoading || editingId !== null}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                >
                    <Plus size={16} /> <span>Add Blog Post</span>
                </button>
            </div>

            {editingId !== null && (
                <div className="mb-8 bg-[color:var(--foreground)] rounded-lg border border-[color:var(--border-color)]">
                    <div className="p-4 border-b border-[color:var(--border-color)] flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-[color:var(--text-color)] flex items-center">
                            {editingId === -1 ? <Plus size={18} className="mr-2" /> : <Edit size={18} className="mr-2" />}
                            {editingId === -1 ? 'Add New Blog Post' : 'Edit Blog Post'}
                        </h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={togglePreviewMode}
                                className="text-sm px-3 py-1 rounded border border-[color:var(--border-color)] hover:bg-[color:var(--hover-bg)]"
                            >
                                {isPreviewMode ? 'Edit Mode' : 'Preview'}
                            </button>
                        </div>
                    </div>

                    {isPreviewMode ? (
                        <div className="p-4 max-h-[80vh] overflow-y-auto">
                            <div className="prose dark:prose-invert max-w-full">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{formData.title}</h1>

                                <div className="flex items-center mb-4">
                                    <span className="text-[color:var(--secondary-color)]">{formData.author}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-[color:var(--secondary-color)]">{formData.date}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-[color:var(--secondary-color)]">{formData.readTime} min read</span>
                                </div>

                                {formData.coverImage && (
                                    <div className="my-4 rounded-lg overflow-hidden border border-[color:var(--border-color)]">
                                        <Image
                                            src={formData.coverImage}
                                            alt={formData.title}
                                            width={800}
                                            height={400}
                                            className="w-full h-auto object-cover"
                                            unoptimized={true}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/blog_fallback.jpg';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="bg-[color:var(--border-color)] bg-opacity-20 rounded-lg p-4 italic mb-6">
                                    {formData.excerpt}
                                </div>

                                <div className="markdown-content whitespace-pre-wrap">
                                    {formData.content}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            {/* Basic Blog Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                        placeholder="Blog post title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Slug (URL-friendly title)
                                        {formData.generateNewSlug && <span className="text-xs ml-2 text-[color:var(--info-color)]">(Will be auto-generated on save)</span>}
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        disabled={isLoading || formData.generateNewSlug}
                                        placeholder="blog-post-slug"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Author*
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        disabled={isLoading}
                                        placeholder="Author name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Role/Position
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        disabled={isLoading}
                                        placeholder="Author's role or position"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Publication Date
                                    </label>
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        disabled={isLoading}
                                        placeholder="January 1, 2023"
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
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Read Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        min="1"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                        Cover Image URL
                                    </label>
                                    <input
                                        type="text"
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                        disabled={isLoading}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Excerpt/Summary
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)]"
                                    disabled={isLoading}
                                    placeholder="A brief summary of the blog post..."
                                />
                            </div>

                            {/* Blog Content - Markdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[color:var(--secondary-color)] mb-1">
                                    Content (Markdown)*
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={15}
                                    className="w-full px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] font-mono"
                                    disabled={isLoading}
                                    placeholder="Write your blog post content here using Markdown..."
                                />
                                <p className="text-xs text-[color:var(--secondary-color)] mt-1">
                                    Use Markdown for formatting: # Heading, ## Subheading, **bold**, *italic*, [link](url), etc.
                                </p>
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
                                    onClick={saveBlog}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-opacity-90 flex items-center disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : <><Save size={16} className="mr-1" /> Save</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mb-4">
                <div className="flex items-center mb-4">
                    <Search size={18} className="text-[color:var(--secondary-color)] mr-2" />
                    <input
                        type="text"
                        placeholder="Search blog posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-[color:var(--border-color)] rounded-md bg-[color:var(--background)] text-[color:var(--text-color)] w-full"
                    />
                </div>
            </div>

            {isLoading && !editingId ? (
                <div className="text-center py-8 text-[color:var(--secondary-color)]">
                    Loading blog posts...
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-8 text-[color:var(--secondary-color)]">
                    {searchTerm
                        ? 'No blog posts found matching your search criteria.'
                        : 'No blog posts found. Add your first blog post!'
                    }
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBlogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-[color:var(--foreground)] rounded-lg border border-[color:var(--border-color)] overflow-hidden group"
                        >
                            {blog.coverImage && (
                                <div className="w-full h-40 overflow-hidden relative">
                                    <Image
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        unoptimized={true}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/blog_fallback.jpg';
                                        }}
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={() => startEditing(blog)}
                                            disabled={isLoading || editingId !== null}
                                            className="p-1.5 rounded-md bg-[color:var(--background)] bg-opacity-80 hover:bg-opacity-100 text-[color:var(--primary-color)] transition"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(blog)}
                                            disabled={isLoading || editingId !== null}
                                            className="p-1.5 rounded-md bg-[color:var(--background)] bg-opacity-80 hover:bg-opacity-100 text-[color:var(--error-color)] transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-center text-xs text-[color:var(--secondary-color)] mb-2">
                                    <Tag size={12} className="mr-1" />
                                    <span>{blog.category}</span>
                                    <span className="mx-1">•</span>
                                    <Calendar size={12} className="mr-1" />
                                    <span>{blog.date}</span>
                                    <span className="mx-1">•</span>
                                    <Clock size={12} className="mr-1" />
                                    <span>{blog.readTime} min read</span>
                                </div>

                                <h3 className="text-lg font-semibold text-[color:var(--text-color)] mb-2 line-clamp-2">{blog.title}</h3>

                                <p className="text-[color:var(--secondary-color)] text-sm mb-3 line-clamp-3">
                                    {blog.excerpt || blog.content.substring(0, 150).replace(/#/g, '').trim() + '...'}
                                </p>

                                <div className="flex items-center text-sm">
                                    <User size={14} className="text-[color:var(--secondary-color)] mr-1" />
                                    <span className="text-[color:var(--text-color)]">{blog.author}</span>
                                    {blog.role && (
                                        <>
                                            <span className="mx-1 text-[color:var(--secondary-color)]">•</span>
                                            <span className="text-[color:var(--secondary-color)] italic">{blog.role}</span>
                                        </>
                                    )}
                                </div>

                                {!blog.coverImage && (
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => startEditing(blog)}
                                            disabled={isLoading || editingId !== null}
                                            className="p-1 text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] transition"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(blog)}
                                            disabled={isLoading || editingId !== null}
                                            className="p-1 text-[color:var(--error-color)] hover:text-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditBlogs;
