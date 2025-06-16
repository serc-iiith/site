import { MetadataRoute } from 'next';
import peopleData from '../../public/data/people.json';
import blogsData from '../../public/data/blogs.json';
import projectsData from '../../public/data/projects.json';
import newsData from '../../public/data/news.json';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    // Base URL - update this with your production domain
    const baseUrl = 'https://serc.iiit.ac.in';

    // Helper function to safely create dates
    const safeDate = (dateString?: string) => {
        try {
            if (!dateString) return new Date();
            const date = new Date(dateString);
            // Check if date is valid
            return isNaN(date.getTime()) ? new Date() : date;
        } catch (e) {
            // Return current date if there's any error
            return new Date();
        }
    };

    // Basic site pages
    const routes = [
        '',
        '/people',
        '/research',
        '/projects',
        '/blog',
        '/news',
        '/collaborators',
        '/contact',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic people pages with better metadata
    const peoplePages = [];
    for (const [category, people] of Object.entries(peopleData)) {
        for (const person of people) {
            peoplePages.push({
                url: `${baseUrl}/people/${person.slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: category === 'Faculty' ? 0.7 : 0.6,
            });
        }
    }

    // Dynamic blog pages
    const blogPages = blogsData.map(blog => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: safeDate(blog.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic project pages
    const projectPages = projectsData.map(project => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic event pages
    const eventPages = newsData.map(event => ({
        url: `${baseUrl}/news/${event.slug}`,
        lastModified: safeDate(event.startTime || event.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...peoplePages, ...blogPages, ...projectPages, ...eventPages];
}