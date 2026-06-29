import { notFound } from "next/navigation";
import Blog from "./Blog";
import type { Metadata } from 'next'

// Import blog data
import blogData from '../../../../public/data/blogs.json';

const BASE_URL = 'https://serc.iiit.ac.in';

const toAbsoluteUrl = (url: string): string => {
    if (!url) return `${BASE_URL}/images/blog_fallback.png`;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface BlogPost {
    id: number | string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    role?: string;
    date: string;
    readTime: number;
    category: string;
    coverImage?: string;
}

export function generateStaticParams() {
    const slugs = blogData.map(post => ({ slug: post.slug }));
    return slugs;
}

// Generate metadata for better SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blogPost = getBlogBySlug(slug);

    if (!blogPost) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    // Use the blog post's data to generate SEO metadata
    const canonical = `${BASE_URL}/blog/${slug}`;

    return {
        title: blogPost.title + ' | SERC Blog',
        description: blogPost.excerpt,
        authors: [{ name: blogPost.author }],
        keywords: [blogPost.category, 'SERC', 'Research', 'Blog', 'Software Engineering'],
        alternates: {
            canonical,
        },
        openGraph: {
            title: blogPost.title,
            description: blogPost.excerpt,
            url: canonical,
            type: 'article',
            publishedTime: blogPost.date,
            authors: [blogPost.author],
            images: [
                {
                    url: toAbsoluteUrl(blogPost.coverImage || '/images/blog_fallback.png'),
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
            images: [toAbsoluteUrl(blogPost.coverImage || '/images/blog_fallback.png')],
        },
    }
}

// Function to get blog by slug
function getBlogBySlug(
    slug: string
): BlogPost | null {
    const blogPost = (blogData as BlogPost[]).find((post) => post.slug === slug);
    if (blogPost) {
        return blogPost;
    }
    return null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blogPost = getBlogBySlug(slug);

    if (!blogPost) {
        notFound();
    }

    // Create JSON-LD structured data for this blog post
    const blogPostJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogPost.title,
        description: blogPost.excerpt,
        image: toAbsoluteUrl(blogPost.coverImage || '/images/blog_fallback.png'),
        datePublished: blogPost.date,
        author: {
            '@type': 'Person',
            name: blogPost.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'Software Engineering Research Center, IIIT Hyderabad',
            logo: {
                '@type': 'ImageObject',
                url: 'https://serc.iiit.ac.in/images/serc-logo.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://serc.iiit.ac.in/blog/${slug}`
        },
        keywords: [blogPost.category, 'SERC', 'Research', 'Software Engineering'],
        articleSection: blogPost.category
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(blogPostJsonLd)
                }}
            />
            <Blog blogPost={blogPost} blogData={blogData} />
        </>
    );
}