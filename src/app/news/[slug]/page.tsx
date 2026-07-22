import { notFound } from "next/navigation";
import newsData from "../../../../public/data/news.json";
import peopleData from "../../../../public/data/people.json";
import EventDetail from "./EventDetail";
import type { Metadata } from 'next';

const BASE_URL = 'https://serc.iiit.ac.in';

const toAbsoluteUrl = (url: string): string => {
    if (!url) return `${BASE_URL}/images/event_fallback.png`;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

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
    hasTime?: boolean;
    eventType?: string;
    schemaType?: string;
}

// Create slug from event name (kept for potential future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    // Await the params to satisfy Next.js requirement
    const { slug } = await params;
    const event = getEventBySlug(slug);

    if (!event) {
        return {
            title: 'Event Not Found | SERC IIIT Hyderabad',
        };
    }

    const isAdmissions = event.schemaType === 'EducationalOccupationalProgram' || event.eventType === 'admissions';

    // Format date for display
    const eventDate = new Date(event.startTime);
    const dateString = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Use the event data to generate SEO metadata
    const canonical = `${BASE_URL}/news/${event.slug}`;
    const pageTitle = isAdmissions 
        ? `${event.name} | Software Engineering Research Centre, IIIT Hyderabad`
        : `${event.name} | ${dateString} | SERC IIIT Hyderabad`;

    const seoKeywords = [
        'SERC',
        'Software Engineering Research Centre',
        'IIIT Hyderabad',
        'IIITH Research',
        event.name,
        event.location,
    ];

    if (isAdmissions) {
        seoKeywords.push(
            'Ph.D. Admissions',
            'PhD Software Engineering',
            'Doctoral Research Positions',
            'IIIT PhD Admission 2026',
            'Research Fellowships India',
            'Agentic AI Research',
            'Human-Centred Computing'
        );
    } else {
        seoKeywords.push('Research Seminar', 'Academic Talk', 'Computer Science Event');
    }

    return {
        title: pageTitle,
        description: event.summary || `${event.name} at ${event.location}`,
        keywords: seoKeywords,
        alternates: {
            canonical,
        },
        openGraph: {
            title: pageTitle,
            description: event.summary || `${event.name} at ${event.location}`,
            url: canonical,
            siteName: 'Software Engineering Research Centre | IIIT Hyderabad',
            images: event.imageURLs && event.imageURLs.length > 0
                ? [{ url: toAbsoluteUrl(event.imageURLs[0]), width: 1200, height: 630, alt: event.name }]
                : [{ url: toAbsoluteUrl('/images/event_fallback.png'), width: 1200, height: 630, alt: event.name }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: event.summary || `${event.name} at ${event.location}`,
            images: event.imageURLs && event.imageURLs.length > 0
                ? [toAbsoluteUrl(event.imageURLs[0])]
                : [toAbsoluteUrl('/images/event_fallback.png')],
        },
    }
}

// Generate static paths for all news
export async function generateStaticParams() {
    return newsData.map(event => ({
        slug: event.slug
    }));
}
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    // Get presenter information if available
    const presenters = event.presenters ? getPeopleBySlug(event.presenters) : [];

    // Format dates for structured data
    const startDate = new Date(event.startTime).toISOString();
    const endDate = event.endTime ? new Date(event.endTime).toISOString() : '';

    const isAdmissions = event.schemaType === 'EducationalOccupationalProgram' || event.eventType === 'admissions';
    
    // Create Schema.org JSON-LD structures
    const schemas: any[] = [];

    // Generate exactly ONE specific schema based on the type to avoid entity dilution
    if (isAdmissions) {
        const programJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'EducationalOccupationalProgram',
            name: event.name,
            description: event.summary || event.name,
            provider: {
                '@type': 'Organization',
                name: 'Software Engineering Research Centre, IIIT Hyderabad',
                url: BASE_URL
            },
            programType: 'Ph.D. / Doctorate',
            educationalProgramMode: 'Full-time',
            offers: { // Fixed typo: changed from offersLoop to offers
                '@type': 'Offer',
                category: 'Ph.D. Program Research Stipend & Tuition waiver support',
                price: '0',
                priceCurrency: 'INR'
            },
            applicationStartDate: startDate.split('T')[0],
            applicationDeadline: endDate ? endDate.split('T')[0] : undefined,
            programPrerequisites: 'B.E / B.Tech / M.E / M.Tech in Computer Science and Engineering (CSE) or Electronics and Communication Engineering (ECE).'
        };
        schemas.push(programJsonLd);
    } else if (event.eventType === 'conference' || event.eventType === 'seminar' || event.eventType === 'workshop' || event.location) {
        // Render structured event data with required status fields
        const eventJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.name,
            description: event.summary || `${event.name} at ${event.location}`,
            startDate: startDate,
            endDate: endDate || startDate,
            eventStatus: 'https://schema.org/EventScheduled', // Mandatory
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', // Mandatory
            location: {
                '@type': 'Place',
                name: event.location,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: event.location.includes(',') ? event.location.split(',')[1].trim() : 'Hyderabad',
                    addressCountry: 'IN'
                },
                url: event.locationURL || undefined // Omit null URLs
            },
            image: event.imageURLs && event.imageURLs.length > 0 ? toAbsoluteUrl(event.imageURLs[0]) : toAbsoluteUrl('/images/event_fallback.png'),
            url: `${BASE_URL}/news/${event.slug}`,
            organizer: {
                '@type': 'Organization',
                name: 'Software Engineering Research Center, IIIT Hyderabad',
                url: BASE_URL
            }
        };
        if (presenters.length > 0) {
            (eventJsonLd as any).performer = presenters.map(presenter => ({
                '@type': 'Person',
                name: presenter.name,
                url: `${BASE_URL}/people/${presenter.slug}`
            }));
        }
        schemas.push(eventJsonLd);
    } else {
        // Fallback to NewsArticle only if it is a general post with no event coordinates
        const newsArticleJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: event.name,
            description: event.summary || event.name,
            image: event.imageURLs && event.imageURLs.length > 0 
                ? event.imageURLs.map(url => toAbsoluteUrl(url))
                : [toAbsoluteUrl('/images/event_fallback.png')],
            datePublished: startDate,
            dateModified: startDate,
            author: {
                '@type': 'Organization',
                name: 'Software Engineering Research Centre, IIIT Hyderabad',
                url: BASE_URL
            },
            publisher: {
                '@type': 'Organization',
                name: 'Software Engineering Research Centre, IIIT Hyderabad',
                url: BASE_URL,
                logo: {
                    '@type': 'ImageObject',
                    url: toAbsoluteUrl('/images/event_fallback.png')
                }
            }
        };
        schemas.push(newsArticleJsonLd);
    }

    // Return the client component with pre-fetched data
    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema)
                    }}
                />
            ))}
            <EventDetail event={event} presenters={presenters} />
        </>
    );
}
