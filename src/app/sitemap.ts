import { MetadataRoute } from 'next';
import peopleData from '../../public/data/people.json';
import blogsData from '../../public/data/blogs.json';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    // Base URL - update this with your production domain
    const baseUrl = 'https://serc.iiit.ac.in';

    // Basic site pages
    const routes = [
        '',
        '/people',
        '/research',
        '/projects',
        '/blog',
        '/events',
        '/collaborators',
        '/contact',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic people pages
    const peoplePages = [];
    for (const [_, people] of Object.entries(peopleData)) {
        for (const person of people) {
            peoplePages.push({
                url: `${baseUrl}/people/${person.slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            });
        }
    }

    // Dynamic blog pages
    const blogPages = blogsData.map(blog => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...peoplePages, ...blogPages];
}