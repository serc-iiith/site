import React, { type ReactNode } from 'react';
import { notFound } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";
import { getFormattedDate } from 'utils/date';
import { getFormattedReadingTime } from 'utils/readingTime';
import Blog from "./Blog";
import type { Metadata, ResolvingMetadata } from 'next'

// Import blog data
import blogData from '../../../../public/data/blogs.json';

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

interface PageTransitionProp {
    children: ReactNode;
}

// Components for page transitions and animations
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

export function generateStaticParams() {
    const slugs = blogData.map(post => ({ slug: post.slug }));
    return slugs;
}

// Generate metadata for better SEO
export async function generateMetadata({ params }: { params: { slug: string } }, parent: ResolvingMetadata): Promise<Metadata> {
    const slug = params.slug;
    const blogPost = getBlogBySlug(slug);

    if (!blogPost) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    // Use the blog post's data to generate SEO metadata
    return {
        title: blogPost.title + ' | SERC Blog',
        description: blogPost.excerpt,
        authors: [{ name: blogPost.author }],
        keywords: [blogPost.category, 'SERC', 'Research', 'Blog', 'Software Engineering'],
        openGraph: {
            title: blogPost.title,
            description: blogPost.excerpt,
            type: 'article',
            publishedTime: blogPost.date,
            authors: [blogPost.author],
            images: [
                {
                    url: blogPost.coverImage || '/images/blog_fallback.png',
                    width: 1200,
                    height: 630,
                    alt: blogPost.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: blogPost.title,
            description: blogPost.excerpt,
            images: [blogPost.coverImage || '/images/blog_fallback.png'],
        },
    }
}

// Function to get blog by slug
function getBlogBySlug(
    slug: string
): any | null {
    const blogPost = blogData.find((post) => post.slug === slug);
    if (blogPost) {
        return blogPost;
    }
    return null;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const blogPost = getBlogBySlug(slug);

    if (!blogPost) {
        notFound();
    }

    return <Blog blogPost={blogPost} blogData={blogData} />;
}