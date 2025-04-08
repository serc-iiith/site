"use client";

import React, { type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Added plugin for GitHub-flavored Markdown
import rehypeRaw from 'rehype-raw'; // Added plugin to render raw HTML

// Page transition component
interface PageTransitionProp {
    children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProp) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

// Related blog posts component
const RelatedPosts = ({ posts, currentPostId }) => {
    const relatedPosts = posts
        .filter(post => post.id !== currentPostId)
        .slice(0, 3);

    if (relatedPosts.length === 0) return null;

    return (
        <div className="mt-16 border-t border-[var(--border-color)] pt-12">
            <h2 className="text-3xl font-bold text-text mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map(post => (
                    <Link
                        href={`/blog/${post.slug}`}
                        key={post.id}
                        className="group"
                    >
                        <div className="bg-[var(--background)] rounded-lg shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-lg h-full flex flex-col">
                            {post.coverImage && (
                                <div className="w-full h-48 relative">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="bg-hover text-[var(--primary-color)] text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
                                    {post.category}
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-text group-hover:text-[var(--primary-color)] transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-secondary text-sm flex-grow">
                                    {post.excerpt.substring(0, 100)}...
                                </p>
                                <span className="text-[var(--primary-color)] font-medium hover:text-accent text-sm mt-4 inline-block">
                                    Read more →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// Category color mapping
const categoryColors = {
    "Virtual Labs": "bg-primary",
    "Gamification": "bg-green-600",
    "VR and AR": "bg-indigo-600",
    "IoT": "bg-cyan-600",
    "HCI": "bg-yellow-600",
    "Software Quality": "bg-red-600",
    "Programming Languages": "bg-teal-600",
    "Formal Methods": "bg-purple-600",
    "Software Analytics": "bg-pink-600",
    "Self-Adaptive Systems": "bg-cyan-600",
    "SE and ML": "bg-amber-600",
    "Software Sustainability": "bg-emerald-600",
    "AI in SE": "bg-red-600",
    "DevOps": "bg-primary",
    "SE Trends": "bg-green-600",
    "Open Source": "bg-indigo-600",
};

// Helper function to generate author image URL from name
const getAuthorImageUrl = (authorName: string) => {
    // Remove 'Dr.' prefix if present
    const cleanName = authorName.replace(/^Dr\.\s+/, '');

    // Convert to lowercase and replace spaces with hyphens
    const formattedName = cleanName
        .toLowerCase()
        .replace(/\s+/g, '-');

    return `/images/people/${formattedName}.png`;
};

interface BlogProps {
    blogPost: any;
    blogData: any[];
}

export default function Blog({ blogPost, blogData }: BlogProps) {
    const authorImageUrl = getAuthorImageUrl(blogPost.author);
    const categoryColor = categoryColors[blogPost.category] || "bg-gray-600";

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        } catch (err) {
            console.log(err);
            return dateString;
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blogPost.title)}`, '_blank');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <PageTransition>
                {/* Hero Section */}
                <section className="relative">
                    <div
                        className="min-h-[40vh] md:min-h-[50vh] bg-cover bg-center flex flex-col justify-end"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${blogPost.coverImage || '/images/blog_fallback.png'}')`,
                        }}
                    >
                        <div className="px-6 py-10 text-white">
                            <div className="max-w-5xl mx-auto pt-12">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                                        {blogPost.category}
                                    </span>
                                    <span className="mx-2 text-white/70 hidden sm:inline">•</span>
                                    <span className="text-sm flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {blogPost.readTime} min read
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 text-white">
                                    {blogPost.title}
                                </h1>

                                <p className="text-base sm:text-lg text-white/90 max-w-3xl mb-6">
                                    {blogPost.excerpt}
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
                                    <div className="flex items-center mr-0 sm:mr-6">
                                        <div className="relative w-20 h-20 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white">
                                            <Image
                                                src={authorImageUrl}
                                                alt={blogPost.author}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium">{blogPost.author}</div>
                                            <div className="text-sm text-white/80">{blogPost.role || 'Researcher'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm ml-auto">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <time dateTime={blogPost.date}>{formatDate(blogPost.date)}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-12 md:py-16 px-4 bg-[var(--background)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Sidebar */}
                            <div className="md:w-1/4 order-2 md:order-1">
                                {/* Share Widget */}
                                <div className="mt-8 bg-[var(--foreground)] p-6 rounded-lg">
                                    <h3 className="text-lg font-bold mb-4 text-text">Share Article</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={shareOnTwitter}
                                            className="p-2 bg-hover hover:bg-[var(--border-color)] rounded-full transition"
                                            aria-label="Share on Twitter"
                                        >
                                            <Twitter size={20} className="text-text" />
                                        </button>
                                        <button
                                            onClick={shareOnFacebook}
                                            className="p-2 bg-hover hover:bg-[var(--border-color)] rounded-full transition"
                                            aria-label="Share on Facebook"
                                        >
                                            <Facebook size={20} className="text-text" />
                                        </button>
                                        <button
                                            onClick={shareOnLinkedIn}
                                            className="p-2 bg-hover hover:bg-[var(--border-color)] rounded-full transition"
                                            aria-label="Share on LinkedIn"
                                        >
                                            <Linkedin size={20} className="text-text" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (navigator.share) {
                                                    try {
                                                        await navigator.share({
                                                            title: blogPost.title,
                                                            url: shareUrl,
                                                        });
                                                    } catch (err) {
                                                        if (err.name !== 'AbortError') {
                                                            console.error("Share failed:" + err);
                                                            toast.error("Failed to share article");
                                                        }
                                                    }
                                                } else if (navigator.clipboard) {
                                                    try {
                                                        await navigator.clipboard.writeText(shareUrl);
                                                        toast.success("Link copied to clipboard");
                                                    } catch (err) {
                                                        toast.error("Failed to copy link");
                                                        console.log(err);
                                                    }
                                                } else {
                                                    toast.error("Sharing not supported on this browser");
                                                }
                                            }}
                                            className="p-2 bg-hover hover:bg-[var(--border-color)] rounded-full transition"
                                            aria-label="Share article"
                                        >
                                            <Share2 size={20} className="text-text" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="md:w-3/4 order-1 md:order-2 text-justify">
                                <div className="prose lg:prose-xl max-w-none text-[var(--text-color)] prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-headings:text-[var(--text-color)]">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {blogPost.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Articles */}
                <section className="py-12 px-4 bg-foreground">
                    <div className="max-w-7xl mx-auto">
                        <RelatedPosts posts={blogData} currentPostId={blogPost.id} />
                    </div>
                </section>
            </PageTransition>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    // Customize default toast options
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: 'green',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: 'red',
                            color: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
}