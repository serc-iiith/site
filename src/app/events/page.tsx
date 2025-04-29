"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import EventCalendar from "@/components/EventCalendar";

// Define event interface based on the new JSON structure
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

// Section transition component from home page for consistency
const SectionTransition = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Tag component for event types
const EventTag = ({ type }: { type: string }) => {
    const colors = {
        conference: "bg-blue-100 text-blue-800 border-blue-400",
        workshop: "bg-purple-100 text-purple-800 border-purple-400",
        seminar: "bg-green-100 text-green-800 border-green-400",
        showcase: "bg-amber-100 text-amber-800 border-amber-400",
        paper: "bg-teal-100 text-teal-800 border-teal-400",
    };

    const color = colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-400";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
    );
};

// Determine event type based on content
const determineEventType = (event: Event): string => {
    const name = event.name.toLowerCase();
    const summary = event.summary.toLowerCase();

    if (name.includes('conference') || name.includes('icsa')) return 'conference';
    if (name.includes('workshop') || summary.includes('workshop')) return 'workshop';
    if (name.includes('talk') || summary.includes('talk')) return 'seminar';
    if (name.includes('showcase') || summary.includes('showcase')) return 'showcase';
    if (name.includes('paper') || summary.includes('paper')) return 'paper';

    return 'other';
};

// EventCard Component
const EventCard = ({ event, isSelected }: { event: Event, isSelected: boolean }) => {
    const ref = useRef(null);
    const eventType = determineEventType(event);

    // Format date string to Month Day, Year
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Default image for events without images
    const defaultImage = '/images/event_fallback.png';

    // Get first image or default
    const imageUrl = event.imageURLs && event.imageURLs.length > 0
        ? event.imageURLs[0]
        : defaultImage;

    return (
        <Link href={`/events/${event.slug}`} className="h-full block">
            <motion.div
                ref={ref}
                layout
                whileHover={{ y: -5 }}
                className={`relative rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col ${isSelected
                    ? 'border-2 border-[color:var(--primary-color)] ring-4 ring-[color:var(--primary-color)]/20 scale-102 z-10'
                    : 'border border-[color:var(--border-color)] bg-[color:var(--background)]'
                    }`}
            >
                <div className="relative h-48 w-full">
                    <Image
                        src={imageUrl}
                        alt={event.name}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                        <EventTag type={eventType} />
                    </div>
                </div>
                <div className="p-5 relative flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-[color:var(--text-color)] mb-2">{event.name}</h3>
                    <div className="flex items-center text-[color:var(--secondary-color)] mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center text-[color:var(--secondary-color)] mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{event.location}</span>
                    </div>
                    <p className="text-[color:var(--tertiary-color)] text-sm mb-4 line-clamp-2 flex-grow">{event.summary}</p>

                    <div className="flex items-center text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] transition-colors duration-200 mt-auto">
                        Learn more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // State for current viewing date
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // Load events from JSON on component mount
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const response = await fetch('/data/events.json');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error loading events data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    // Sort events by date (newest first)
    const sortedEvents = [...events].sort((a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

    // Filter events for current month/year
    const currentEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear();
    });

    // Group events into upcoming and past
    const upcomingEvents = sortedEvents.filter(event => new Date(event.startTime) >= new Date());
    const pastEvents = sortedEvents.filter(event => new Date(event.startTime) < new Date());

    // Convert events for the calendar component
    const calendarEvents = events.map(event => ({
        slug: event.slug,
        title: event.name,
        date: event.startTime,
        location: event.location,
        description: event.summary,
        type: determineEventType(event),
        image: event.imageURLs && event.imageURLs.length > 0 ? event.imageURLs[0] : '',
        isPast: new Date(event.startTime) < new Date(),
        presenters: event.presenters || []
    }));

    // Handle date selection from calendar
    const handleCalendarDateSelect = (date: Date) => {
        setCurrentDate(date);

        const eventsSection = document.getElementById('current-events-section');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle month change in calendar
    const handleMonthChange = (date: Date) => {
        setCurrentDate(date);
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Parse URL for filtering if necessary
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');

        if (dateParam) {
            try {
                const paramDate = new Date(dateParam);
                if (!isNaN(paramDate.getTime())) {
                    setCurrentDate(paramDate);
                }
            } catch (error) {
                console.error("Invalid date in URL", error);
            }
        }
    }, []);

    return (
        <div className="min-h-screen pt-32 bg-[color:var(--foreground)] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                        Our Events
                    </h1>
                    <p className="text-xl text-[color:var(--secondary-color)] max-w-3xl mx-auto">
                        Stay up to date with our latest events, workshops, and conferences.
                    </p>
                </motion.div>

                {/* Loading state */}
                {loading && (
                    <section className="py-16 bg-[color:var(--background)]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="animate-pulse">
                                <div className="h-8 w-64 bg-[color:var(--foreground)] rounded mx-auto mb-8"></div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-96 bg-[color:var(--foreground)] rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* All Events */}
                {!loading && (
                    <>
                        {/* Upcoming Events */}
                        <section className="py-16 bg-[color:var(--foreground)]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <SectionTransition delay={0.01}>
                                    <div className="mb-8">
                                        <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text-color)]">
                                            Upcoming Events
                                        </h2>
                                        <div className="w-20 h-1 bg-[color:var(--success-color)] mt-2"></div>
                                    </div>

                                    {upcomingEvents.length > 0 ? (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {upcomingEvents.map((event) => (
                                                <div key={event.slug} className="h-full">
                                                    <EventCard
                                                        event={event}
                                                        isSelected={false}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[color:var(--background)] rounded-lg p-8 text-center">
                                            <p className="text-[color:var(--secondary-color)]">
                                                No upcoming events at this time. Check back later!
                                            </p>
                                        </div>
                                    )}
                                </SectionTransition>
                            </div>
                        </section>

                        {/* Past Events */}
                        <section className="py-16 bg-[color:var(--foreground)]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <SectionTransition delay={0.01}>
                                    <div className="mb-8">
                                        <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text-color)]">
                                            Past Events
                                        </h2>
                                        <div className="w-20 h-1 bg-[color:var(--tertiary-color)] mt-2"></div>
                                    </div>

                                    {pastEvents.length > 0 ? (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {pastEvents.map((event) => (
                                                <div key={event.slug} className="h-full">
                                                    <EventCard
                                                        event={event}
                                                        isSelected={false}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[color:var(--foreground)] rounded-lg p-8 text-center">
                                            <p className="text-[color:var(--secondary-color)]">
                                                No past events to display.
                                            </p>
                                        </div>
                                    )}
                                </SectionTransition>
                            </div>
                        </section>
                    </>
                )}

                {/* Calendar Section */}
                {!loading && events.length > 0 && (
                    <section id="current-events-section" className="py-12 rounded-2xl bg-[color:var(--background)]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionTransition>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl md:text-4xl font-bold text-[color:var(--text-color)]">
                                        Event Calendar
                                    </h2>
                                    <p className="text-xl text-[color:var(--tertiary-color)] mt-2">
                                        Browse all events on our interactive calendar
                                    </p>
                                </div>

                                <div className="md:flex gap-8 items-start text-[color:var(--text-color)]">
                                    {/* Calendar Component */}
                                    <div className="md:w-1/2 lg:w-2/5 mb-8 md:mb-0">
                                        <EventCalendar
                                            events={calendarEvents}
                                            onSelectDate={handleCalendarDateSelect}
                                            currentMonth={currentDate}
                                            onMonthChange={handleMonthChange}
                                        />
                                    </div>

                                    {/* Selected Date Info */}
                                    <div className="md:w-1/2 lg:w-3/5">
                                        <div className="bg-[color:var(--background)] rounded-xl border border-[color:var(--border-color)] shadow-sm p-6">
                                            <h3 className="text-xl font-bold text-[color:var(--text-color)] mb-4">
                                                Events in {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </h3>

                                            {/* Display events for current month */}
                                            {currentEvents.length > 0 ? (
                                                <div className="space-y-4">
                                                    {currentEvents
                                                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                                        .map(event => {
                                                            const eventDate = new Date(event.startTime);
                                                            return (
                                                                <Link
                                                                    key={event.slug}
                                                                    href={`/events/${event.slug}`}
                                                                >
                                                                    <div
                                                                        className="p-4 rounded-lg border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)] transition-colors"
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <span className="font-medium text-[color:var(--primary-color)]">
                                                                                        {eventDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                                                                                    </span>
                                                                                    <span className="text-xs px-2 py-0.5 bg-[color:var(--hover-bg)] rounded-full text-[color:var(--secondary-color)]">
                                                                                        {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                    </span>
                                                                                </div>
                                                                                <h4 className="font-bold text-[color:var(--text-color)]">{event.name}</h4>
                                                                                <p className="text-xs text-[color:var(--secondary-color)] mt-1">
                                                                                    {event.location}
                                                                                </p>
                                                                            </div>
                                                                            <EventTag type={determineEventType(event)} />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            );
                                                        }
                                                        )}
                                                </div>
                                            ) : (
                                                <p className="text-[color:var(--secondary-color)]">
                                                    No events scheduled for this month.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SectionTransition>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
