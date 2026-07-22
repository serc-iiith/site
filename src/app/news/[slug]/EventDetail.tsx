"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaLink, FaCode, FaFilePdf, FaFileAlt, FaVideo, FaSearchPlus, FaSearchMinus, FaDownload, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Added plugin for GitHub-flavored Markdown
import rehypeRaw from 'rehype-raw'; // Added plugin to render raw HTML

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
    otherURLLabels?: {
        code: string;
        pdf: string;
        slides: string;
        video: string;
    };
    hasTime?: boolean;
    eventType?: string;
    schemaType?: string;
}

// Define Person interface
interface Person {
    name: string;
    title: string;
    email: string;
    imageURL: string;
    slug: string;
    social_links: Record<string, string>;
}

interface EventDetailProps {
    event: Event;
    presenters: Person[];
}

const getLinkLabel = (url: string, defaultLabel: string, customLabel?: string): string => {
    if (customLabel && customLabel.trim() !== "") {
        return customLabel;
    }
    if (!url) return defaultLabel;
    try {
        // Extract filename
        const decodedUrl = decodeURIComponent(url);
        const parts = decodedUrl.split('/');
        const filenameWithExt = parts[parts.length - 1];
        if (!filenameWithExt || filenameWithExt.includes('?')) return defaultLabel;
        
        // Remove extension
        const dotIndex = filenameWithExt.lastIndexOf('.');
        const filename = dotIndex !== -1 ? filenameWithExt.substring(0, dotIndex) : filenameWithExt;
        
        if (!filename || filename.length < 3) return defaultLabel;
        
        // Replace underscores/dashes with spaces
        let cleaned = filename.replace(/[_-]+/g, ' ').trim();
        
        // Capitalize first letters
        cleaned = cleaned.replace(/\b\w/g, c => c.toUpperCase());
        
        // If it is just a generic name, default to the type
        const lower = cleaned.toLowerCase();
        if (lower === 'document' || lower === 'pdf' || lower === 'slides' || lower === 'presentation') {
            return defaultLabel;
        }
        
        return cleaned;
    } catch (e) {
        return defaultLabel;
    }
};

export default function EventDetail({ event, presenters }: EventDetailProps) {
    const hasTime = event.hasTime !== false;
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Default image for news without images
    const defaultImage = '/images/event_fallback.png';

    // Determine if the event is in the past (based on end time if provided, otherwise start time)
    const isPastEvent = event.endTime 
        ? new Date(event.endTime) < new Date() 
        : new Date(event.startTime) < new Date();

    // Determine event type based on content
    const determineEventType = (): string => {
        if (event.eventType) {
            if (event.eventType.toLowerCase() === 'admissions') return 'Admissions';
            return event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1);
        }

        const name = event.name.toLowerCase();
        const summary = event.summary.toLowerCase();

        if (name.includes('conference') || name.includes('icsa')) return 'Conference';
        if (name.includes('workshop') || summary.includes('workshop')) return 'Workshop';
        if (name.includes('talk') || summary.includes('talk')) return 'Seminar';
        if (name.includes('showcase') || summary.includes('showcase')) return 'Showcase';
        if (name.includes('paper') || summary.includes('paper')) return 'Paper';
        if (name.includes('admission') || name.includes('recruitment') || name.includes('hiring') || name.includes('apply')) return 'Admissions';

        return 'Event';
    };

    const eventType = determineEventType();

    // Calculate status label
    let statusLabel = isPastEvent ? 'Past' : 'Upcoming';
    if (eventType === 'Admissions') {
        const now = new Date();
        const start = new Date(event.startTime);
        const end = event.endTime ? new Date(event.endTime) : null;
        if (end && now > end) {
            statusLabel = 'Closed';
        } else if (now >= start) {
            statusLabel = 'Open';
        } else {
            statusLabel = 'Upcoming';
        }
    }

    // Return the event detail view
    return (
        <>
            <div className="min-h-screen pt-32 bg-[color:var(--foreground)] pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href="/news"
                        className="flex items-center text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Back to News
                    </Link>
                </div>

                <div className="bg-[color:var(--background)] rounded-2xl shadow-xl overflow-hidden border border-[color:var(--border-color)]">
                    {/* Event header/banner */}
                    <div className="relative bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] h-48 md:h-64">
                        <h1 className="absolute bottom-6 left-6 right-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            {event.name}
                        </h1>
                        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm flex items-center">
                            <span className="mr-2">
                                {eventType === 'Admissions' ? `${statusLabel} Opportunities` : `${statusLabel} ${eventType}`}
                            </span>
                            {isPastEvent || statusLabel === 'Closed' ? (
                                <span className="h-2 w-2 rounded-full bg-[color:var(--error-color)]"></span>
                            ) : (
                                <span className="h-2 w-2 rounded-full bg-[color:var(--success-color)] text-emerald-400"></span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row" role="main">
                        {/* Left column with details */}
                        <article className="md:w-[60%] lg:w-[70%] p-6 md:p-8">
                            {/* Event images carousel (Gallery on top) */}
                            {event.imageURLs && event.imageURLs.length > 0 && (
                                <div className="mb-8 border-b border-[color:var(--border-color)] pb-8">
                                    <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-4">Gallery</h2>
                                    <div 
                                        onClick={() => {
                                            setShowLightbox(true);
                                            setZoomScale(1);
                                        }}
                                        className="relative rounded-lg overflow-hidden h-64 md:h-80 mb-4 bg-neutral-900/5 dark:bg-neutral-900/40 border border-[color:var(--border-color)] shadow-sm cursor-zoom-in group transition-transform hover:scale-[1.01]"
                                    >
                                        <Image
                                            src={event.imageURLs[activeImageIndex] || defaultImage}
                                            alt={`${event.name} - Image ${activeImageIndex + 1}`}
                                            fill
                                            className="object-contain select-none"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg font-semibold">
                                                <FaSearchPlus size={14} />
                                                <span>Click to View & Zoom</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnails for multiple images */}
                                    {event.imageURLs.length > 1 && (
                                        <div className="flex overflow-x-auto space-x-2 py-2">
                                            {event.imageURLs.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${idx === activeImageIndex
                                                        ? 'border-[color:var(--primary-color)] scale-105 shadow-lg'
                                                        : 'border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]/50'
                                                        }`}
                                                    onClick={() => setActiveImageIndex(idx)}
                                                >
                                                    <div className="relative h-full w-full">
                                                        <Image
                                                            src={img || defaultImage}
                                                            alt={`${event.name} thumbnail ${idx + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-4">About this Event</h2>
                                <p className="text-[color:var(--secondary-color)] text-lg mb-4">
                                    {event.summary}
                                </p>

                                {/* Event Details with markdown support */}
                                <div className="prose lg:prose-xl max-w-none text-[var(--text-color)] prose-p:text-[color:var(--text-color)] prose-strong:text-[color:var(--text-color)] prose-li:text-[color:var(--text-color)] prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-headings:text-[var(--text-color)]">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {event.detail}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Presenters section */}
                            {presenters.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-4">Presenters</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {presenters.map((presenter) => (
                                            <Link
                                                key={presenter.slug}
                                                href={`/people/${presenter.slug}`}
                                                className="flex items-center bg-[color:var(--foreground)] p-4 rounded-lg hover:shadow-md transition-shadow"
                                            >
                                                <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4">
                                                    <Image
                                                        src={presenter.imageURL}
                                                        alt={presenter.name}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = "none";
                                                            target.parentElement?.classList.add(
                                                                "bg-gradient-to-br",
                                                                "from-[color:var(--primary-color)]",
                                                                "to-[color:var(--info-color)]",
                                                                "flex",
                                                                "items-center",
                                                                "justify-center"
                                                            );

                                                            if (!target.nextElementSibling) {
                                                                const span = document.createElement("span");
                                                                span.className = "text-xl font-bold text-white";
                                                                span.textContent = presenter.name
                                                                    .split(" ")
                                                                    .map((word) => word[0])
                                                                    .join("");
                                                                target.parentElement?.appendChild(span);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-[color:var(--text-color)]">{presenter.name}</h3>
                                                    <p className="text-[color:var(--tertiary-color)] text-sm">{presenter.title}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* Right column with event details */}
                        <aside className="md:w-[40%] lg:w-[30%] bg-[color:var(--foreground)]/50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-[color:var(--border-color)]" aria-label="Event Logistics">
                            <div className="sticky top-24">
                                <h3 className="text-xl font-bold text-[color:var(--text-color)] mb-6">Event Details</h3>

                                <div className="space-y-6">
                                    {/* Date & Time / Deadline Mode */}
                                    <div className="flex items-start">
                                        <div className="mr-3 mt-1 text-[color:var(--primary-color)]">
                                            <FaCalendarAlt size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-[color:var(--text-color)] mb-1">
                                                {eventType === 'Admissions' ? 'Application Deadline' : 'Date & Time'}
                                            </h4>
                                            {eventType === 'Admissions' ? (
                                                <>
                                                    <p className="text-base font-bold text-[color:var(--text-color)] mb-1">
                                                        {formatDate(event.endTime)}
                                                    </p>
                                                    {hasTime && (
                                                        <p className="text-xs text-[color:var(--secondary-color)] mb-2">
                                                            at {formatTime(event.endTime)}
                                                        </p>
                                                    )}
                                                    {(() => {
                                                        if (!event.endTime) return null;
                                                        const daysLeft = Math.ceil(
                                                            (new Date(event.endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                                        );
                                                        if (daysLeft > 0) {
                                                            return (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[color:var(--success-color)]/10 text-[color:var(--success-color)] border border-[color:var(--success-color)]/20">
                                                                    {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left to apply
                                                                </span>
                                                            );
                                                        } else if (daysLeft === 0) {
                                                            return (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[color:var(--error-color)]/10 text-[color:var(--error-color)] border border-[color:var(--error-color)]/20 animate-pulse">
                                                                    Closes today!
                                                                </span>
                                                            );
                                                        } else {
                                                            return (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200">
                                                                    Closed
                                                                </span>
                                                            );
                                                        }
                                                    })()}
                                                    <div className="mt-3 pt-3 border-t border-[color:var(--border-color)]">
                                                        <p className="text-[10px] font-semibold text-[color:var(--tertiary-color)] mb-0.5 uppercase tracking-wider">
                                                            Applications Open
                                                        </p>
                                                        <p className="text-sm text-[color:var(--secondary-color)] font-medium">
                                                            {formatDate(event.startTime)}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                event.endTime && new Date(event.startTime).toDateString() !== new Date(event.endTime).toDateString() ? (
                                                    (() => {
                                                        const now = new Date();
                                                        const start = new Date(event.startTime);
                                                        const end = new Date(event.endTime);
                                                        const isOngoing = now >= start && now <= end;
                                                        const isUpcoming = now < start;
                                                        
                                                        if (isOngoing) {
                                                            return (
                                                                <>
                                                                    <p className="text-sm text-[color:var(--secondary-color)]">
                                                                        Started: {formatDate(event.startTime)}
                                                                    </p>
                                                                    <p className="text-sm text-[color:var(--text-color)] font-semibold mt-0.5">
                                                                        Ends: {formatDate(event.endTime)}
                                                                    </p>
                                                                    {hasTime && (
                                                                        <p className="text-xs text-[color:var(--secondary-color)] mt-2 bg-[color:var(--foreground)] border border-[color:var(--border-color)] px-2 py-1 rounded inline-block">
                                                                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            );
                                                        } else if (isUpcoming) {
                                                            return (
                                                                <>
                                                                    <p className="text-[10px] font-semibold text-[color:var(--info-color)] uppercase tracking-wider mb-1">
                                                                        Upcoming Event
                                                                    </p>
                                                                    <p className="text-sm text-[color:var(--text-color)] font-semibold">
                                                                        Starts: {formatDate(event.startTime)}
                                                                    </p>
                                                                    <p className="text-sm text-[color:var(--secondary-color)] mt-0.5">
                                                                        to {formatDate(event.endTime)}
                                                                    </p>
                                                                    {hasTime && (
                                                                        <p className="text-xs text-[color:var(--secondary-color)] mt-2 bg-[color:var(--foreground)] border border-[color:var(--border-color)] px-2 py-1 rounded inline-block">
                                                                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    <p className="text-[10px] font-semibold text-[color:var(--tertiary-color)] uppercase tracking-wider mb-1">
                                                                        Past Event
                                                                    </p>
                                                                    <p className="text-sm text-[color:var(--secondary-color)]">
                                                                        {formatDate(event.startTime)} - {formatDate(event.endTime)}
                                                                    </p>
                                                                    {hasTime && (
                                                                        <p className="text-xs text-[color:var(--secondary-color)] mt-1.5">
                                                                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            );
                                                        }
                                                    })()
                                                ) : (
                                                    <>
                                                        <p className={`text-sm ${isPastEvent ? 'text-[color:var(--secondary-color)]' : 'text-[color:var(--text-color)] font-semibold'}`}>
                                                            {formatDate(event.startTime)}
                                                        </p>
                                                        {hasTime && (
                                                            <p className="text-sm text-[color:var(--secondary-color)]">
                                                                {formatTime(event.startTime)}
                                                                {event.endTime && ` - ${formatTime(event.endTime)}`}
                                                            </p>
                                                        )}
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start">
                                        <div className="mr-3 mt-1 text-[color:var(--primary-color)]">
                                            <FaMapMarkerAlt size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-[color:var(--text-color)] mb-1">Location</h4>
                                            <p className="text-[color:var(--secondary-color)]">{event.location}</p>

                                            {event.locationURL && (
                                                <a
                                                    href={`https://maps.google.com/?q=${encodeURIComponent(event.locationURL)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center mt-1 text-sm text-[color:var(--info-color)] hover:underline"
                                                >
                                                    View on map
                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Event URL */}
                                    {event.eventURL && (
                                        <div className="flex items-start">
                                            <div className="mr-3 mt-1 text-[color:var(--primary-color)]">
                                                <FaLink size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[color:var(--text-color)] mb-1">Event Website</h4>
                                                <a
                                                    href={event.eventURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[color:var(--info-color)] hover:underline break-words"
                                                >
                                                    {event.eventURL.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Related Resources */}
                                    {(event.otherURLs.code || event.otherURLs.pdf || event.otherURLs.slides || event.otherURLs.video) && (
                                        <div className="pt-6 border-t border-[color:var(--border-color)]">
                                            <h4 className="font-semibold text-base text-[color:var(--text-color)] mb-3">Related Resources</h4>
                                            <div className="flex flex-col gap-2.5 text-[color:var(--text-color)]">
                                                {event.otherURLs.code && (
                                                    <a
                                                        href={event.otherURLs.code}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3.5 py-2 bg-[color:var(--foreground)] hover:bg-[color:var(--hover-bg)] border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]/30 rounded-lg transition text-sm font-medium"
                                                    >
                                                        <FaCode className="text-[color:var(--primary-color)] mr-2.5 flex-shrink-0" size={14} />
                                                        <span className="truncate">{getLinkLabel(event.otherURLs.code, "Code Repository", event.otherURLLabels?.code)}</span>
                                                    </a>
                                                )}

                                                {event.otherURLs.pdf && (
                                                    <a
                                                        href={event.otherURLs.pdf}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3.5 py-2 bg-[color:var(--foreground)] hover:bg-[color:var(--hover-bg)] border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]/30 rounded-lg transition text-sm font-medium"
                                                    >
                                                        <FaFilePdf className="text-[color:var(--error-color)] mr-2.5 flex-shrink-0" size={14} />
                                                        <span className="truncate">{getLinkLabel(event.otherURLs.pdf, "PDF Document", event.otherURLLabels?.pdf)}</span>
                                                    </a>
                                                )}

                                                {event.otherURLs.slides && (
                                                    <a
                                                        href={event.otherURLs.slides}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3.5 py-2 bg-[color:var(--foreground)] hover:bg-[color:var(--hover-bg)] border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]/30 rounded-lg transition text-sm font-medium"
                                                    >
                                                        <FaFileAlt className="text-[color:var(--info-color)] mr-2.5 flex-shrink-0" size={14} />
                                                        <span className="truncate">{getLinkLabel(event.otherURLs.slides, "Slides", event.otherURLLabels?.slides)}</span>
                                                    </a>
                                                )}

                                                {event.otherURLs.video && (
                                                    <a
                                                        href={event.otherURLs.video}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3.5 py-2 bg-[color:var(--foreground)] hover:bg-[color:var(--hover-bg)] border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]/30 rounded-lg transition text-sm font-medium"
                                                    >
                                                        <FaVideo className="text-[color:var(--success-color)] mr-2.5 flex-shrink-0" size={14} />
                                                        <span className="truncate">{getLinkLabel(event.otherURLs.video, "Video Recording", event.otherURLLabels?.video)}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add to Calendar */}
                                    <div className="pt-4 mt-4 border-t border-[color:var(--border-color)]">
                                        <a
                                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${encodeURIComponent(new Date(event.startTime).toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '').replace('Z', ''))}/${encodeURIComponent(event.endTime ? new Date(event.endTime).toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '').replace('Z', '') : '')}&details=${encodeURIComponent(event.summary)}&location=${encodeURIComponent(event.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition"
                                        >
                                            <FaCalendarAlt className="mr-2" />
                                            Add to Calendar
                                        </a>
                                    </div>

                                    {/* Share Event */}
                                    <div className="pt-4 border-t border-[color:var(--border-color)]">
                                        <h4 className="font-medium text-[color:var(--text-color)] mb-3">Share Event</h4>
                                        <div className="flex space-x-2">
                                            <a
                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.name} at ${event.location}`)}&url=${encodeURIComponent(`https://serc.iiit.ac.in/news/${event.slug}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition"
                                                aria-label="Share on Twitter"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://serc.iiit.ac.in/news/${event.slug}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-[#0A66C2] text-white rounded-full hover:opacity-90 transition"
                                                aria-label="Share on LinkedIn"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`mailto:?subject=${encodeURIComponent(`${event.name} at ${event.location}`)}&body=${encodeURIComponent(`Check out this event: ${event.name}\n\nDate: ${formatDate(event.startTime)}\nLocation: ${event.location}\n\n${event.summary}\n\nLearn more: https://serc.iiit.ac.in/news/${event.slug}`)}`}
                                                className="p-2 bg-[color:var(--text-color)] text-[color:var(--background)] rounded-full hover:opacity-90 transition"
                                                aria-label="Share via Email"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>

        {/* Fullscreen Lightbox Modal for Gallery Images */}
        <AnimatePresence>
            {showLightbox && event.imageURLs && event.imageURLs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setShowLightbox(false);
                        setZoomScale(1);
                    }}
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full h-full bg-neutral-950 flex flex-col overflow-hidden"
                    >
                        {/* Modal Top Bar */}
                        <div className="flex justify-between items-center px-4 py-3 bg-black/50 backdrop-blur-md border-b border-white/10 z-10 text-white">
                            <span className="text-sm font-semibold truncate max-w-[50%] flex items-center gap-2">
                                <FaSearchPlus className="text-[color:var(--primary-color)] flex-shrink-0" />
                                <span className="truncate">{event.name} - Image {activeImageIndex + 1}</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-white/10 px-2 py-1 rounded-md font-mono text-white/80">
                                    {Math.round(zoomScale * 100)}%
                                </span>
                                <button
                                    onClick={() => setZoomScale(prev => Math.max(1, prev - 0.25))}
                                    disabled={zoomScale <= 1}
                                    title="Zoom Out"
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center"
                                >
                                    <FaSearchMinus size={14} />
                                </button>
                                <button
                                    onClick={() => setZoomScale(prev => Math.min(4, prev + 0.25))}
                                    disabled={zoomScale >= 4}
                                    title="Zoom In"
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center"
                                >
                                    <FaSearchPlus size={14} />
                                </button>
                                <button
                                    onClick={() => setZoomScale(1)}
                                    disabled={zoomScale === 1}
                                    title="Reset Zoom"
                                    className="px-2 py-1 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
                                >
                                    Reset
                                </button>
                                <div className="w-px h-5 bg-white/10 mx-1"></div>
                                <a
                                    href={event.imageURLs[activeImageIndex]}
                                    download={`gallery-${event.slug}-${activeImageIndex + 1}.png`}
                                    title="Download Image"
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center justify-center border border-white/10"
                                >
                                    <FaDownload size={14} />
                                </a>
                                <button
                                    onClick={() => {
                                        setShowLightbox(false);
                                        setZoomScale(1);
                                    }}
                                    title="Close"
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center justify-center border border-white/10"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Draggable Image Container */}
                        <div 
                            ref={containerRef}
                            className="flex-1 w-full h-full overflow-hidden flex items-center justify-center relative bg-neutral-950 select-none"
                        >
                            <motion.img
                                key={activeImageIndex}
                                src={event.imageURLs[activeImageIndex]}
                                alt={`${event.name} - Image ${activeImageIndex + 1}`}
                                drag={zoomScale > 1}
                                dragConstraints={containerRef}
                                dragElastic={0.15}
                                animate={{ scale: zoomScale }}
                                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                                className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain select-none pointer-events-auto cursor-zoom-in"
                                style={{ cursor: zoomScale > 1 ? 'grab' : 'zoom-in' }}
                                onClick={() => setZoomScale(prev => prev > 1 ? 1 : 2)}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
