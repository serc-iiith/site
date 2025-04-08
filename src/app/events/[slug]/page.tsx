import { notFound } from "next/navigation";
import eventsData from "../../../../public/data/events.json";
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
    const event = eventsData.find(event => event.slug === slug);
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
            url: `https://serc.iiit.ac.in/events/${event.slug}`,
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

// Generate static paths for all events
export async function generateStaticParams() {
    return eventsData.map(event => ({
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

    // Return the client component with pre-fetched data
    return <EventDetail event={event} presenters={presenters} />;
}
