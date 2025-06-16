import { notFound } from "next/navigation";
import newsData from "../../../../public/data/news.json";
import peopleData from "../../../../public/data/people.json";
import EventDetail from "./EventDetail";
import type { Metadata } from 'next';

// Define Event interface
interface Event {
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

// Create slug from event name
function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Function to get event by slug
function getEventBySlug(slug: string): Event | null {
    const event = newsData.find(event => event.slug === slug);
    return event || null;
}

// Function to get people by slugs
function getPeopleBySlug(slugs: string[]) {
    const people = [];

    for (const category of Object.values(peopleData)) {
        for (const person of category) {
            if (slugs.includes(person.slug)) {
                people.push(person);
            }
        }
    }

    return people;
}

// Generate metadata for better SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // Await the params to satisfy Next.js requirement
    const { slug } = await Promise.resolve(params);
    const event = getEventBySlug(slug);

    if (!event) {
        return {
            title: 'Event Not Found | SERC',
        };
    }

    // Format date for display
    const eventDate = new Date(event.startTime);
    const dateString = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Use the event data to generate SEO metadata
    return {
        title: `${event.name} | ${dateString} | SERC`,
        description: event.summary || `${event.name} at ${event.location}`,
        keywords: [
            'SERC',
            'Software Engineering',
            'Research',
            'Event',
            event.name,
            event.location,
        ],
        openGraph: {
            title: `${event.name} | ${dateString}`,
            description: event.summary || `${event.name} at ${event.location}`,
            url: `https://serc.iiit.ac.in/news/${event.slug}`,
            images: event.imageURLs && event.imageURLs.length > 0
                ? [{ url: event.imageURLs[0], width: 800, height: 600, alt: event.name }]
                : [{ url: '/images/event_fallback.png', width: 800, height: 600, alt: event.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${event.name} | ${dateString}`,
            description: event.summary || `${event.name} at ${event.location}`,
            images: event.imageURLs && event.imageURLs.length > 0
                ? [event.imageURLs[0]]
                : ['/images/event_fallback.png'],
        },
    }
}

// Generate static paths for all news
export async function generateStaticParams() {
    return newsData.map(event => ({
        slug: event.slug
    }));
}
export default async function EventPage({ params }: { params: { slug: string } }) {
    const { slug } = await Promise.resolve(params);
    const event = getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    // Get presenter information if available
    const presenters = event.presenters ? getPeopleBySlug(event.presenters) : [];

    // Format dates for structured data
    const startDate = new Date(event.startTime).toISOString();
    const endDate = event.endTime ? new Date(event.endTime).toISOString() : '';

    // Create JSON-LD structured data for this event
    const eventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.name,
        description: event.summary || `${event.name} at ${event.location}`,
        startDate: startDate,
        endDate: endDate || startDate,
        location: {
            '@type': 'Place',
            name: event.location,
            address: {
                '@type': 'PostalAddress',
                addressLocality: event.location
            },
            url: event.locationURL || null
        },
        image: event.imageURLs && event.imageURLs.length > 0 ? event.imageURLs[0] : '/images/event_fallback.png',
        url: `https://serc.iiit.ac.in/news/${event.slug}`,
        organizer: {
            '@type': 'Organization',
            name: 'Software Engineering Research Center, IIIT Hyderabad',
            url: 'https://serc.iiit.ac.in'
        }
    };

    // Add performers/presenters if available
    if (presenters.length > 0) {
        eventJsonLd.performer = presenters.map(presenter => ({
            '@type': 'Person',
            name: presenter.name,
            url: `https://serc.iiit.ac.in/people/${presenter.slug}`
        }));
    }

    // Return the client component with pre-fetched data
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(eventJsonLd)
                }}
            />
            <EventDetail event={event} presenters={presenters} />
        </>
    );
}
