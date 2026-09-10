import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readData, writeData } from '@/lib/adminData';
import { slugify, uniqueSlug } from '@/lib/slug';
import { newsPostSchema, newsPutSchema, formatIssues } from '@/lib/adminSchemas';
import { z } from 'zod';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static keeps `next build` (output: 'export') happy; the mutating methods
// still run under `NEXT_DISABLE_EXPORT=1 next dev`.
export const dynamic = 'force-static';

const FILE = 'news.json';
const newsImagesDir = path.join(process.cwd(), 'public', 'images', 'news');

type Event = Record<string, unknown> & { slug?: string; imageURLs?: string[]; startTime?: string };

/** Newest-first, keeping insertion order for entries with an unparseable date. */
function sortByStartTime(list: Event[]): Event[] {
    return [...list]
        .map((e, i) => ({ e, i, t: Date.parse(String(e.startTime ?? '')) }))
        .sort((a, b) => {
            const av = Number.isNaN(a.t) ? -Infinity : a.t;
            const bv = Number.isNaN(b.t) ? -Infinity : b.t;
            return bv - av || a.i - b.i;
        })
        .map((x) => x.e);
}

async function renameImageFile(oldImageURL: string, newSlug: string): Promise<string | null> {
    try {
        if (!oldImageURL || !oldImageURL.includes('/images/news/')) return null;
        const oldFilename = oldImageURL.split('/').pop();
        if (!oldFilename) return null;
        const fileExt = path.extname(oldFilename);
        const newFilename = `${newSlug}-${Date.now()}${fileExt}`;
        const oldFilePath = path.join(newsImagesDir, oldFilename);
        if (!fs.existsSync(oldFilePath)) return null;
        fs.renameSync(oldFilePath, path.join(newsImagesDir, newFilename));
        return `/images/news/${newFilename}`;
    } catch (error) {
        console.error('Error renaming event image file:', error);
        return null;
    }
}

async function renameEventImages(imageURLs: string[] | undefined, newSlug: string): Promise<string[]> {
    if (!Array.isArray(imageURLs)) return [];
    const out = [...imageURLs];
    for (let i = 0; i < imageURLs.length; i++) {
        const renamed = await renameImageFile(imageURLs[i], newSlug);
        if (renamed) out[i] = renamed;
    }
    return out;
}

export async function GET() {
    try {
        return NextResponse.json(await readData<Event[]>(FILE));
    } catch (error) {
        console.error('Error reading news data:', error);
        return NextResponse.json({ error: 'Failed to read news data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const parsed = newsPostSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const event = parsed.data as Event;
        const news = await readData<Event[]>(FILE);

        const base = event.slug || slugify(String(event.name));
        event.slug = uniqueSlug(base, news.map((e) => e.slug ?? ''));

        news.push(event);
        await writeData(FILE, sortByStartTime(news));

        return NextResponse.json({ success: true, slug: event.slug });
    } catch (error) {
        console.error('Error adding event:', error);
        return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const parsed = newsPutSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const { originalSlug, ...event } = parsed.data as Event & { originalSlug: string };
        const news = await readData<Event[]>(FILE);

        const index = news.findIndex((e) => e.slug === originalSlug);
        if (index === -1) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Resolve the (possibly changed) slug, unique against the other events.
        let slug = (event.slug as string) || slugify(String(event.name));
        if (slug !== originalSlug) {
            const others = news.filter((_, i) => i !== index).map((e) => e.slug ?? '');
            slug = uniqueSlug(slug, others);
            event.imageURLs = await renameEventImages(news[index].imageURLs, slug);
        }
        event.slug = slug;

        news[index] = event;
        await writeData(FILE, sortByStartTime(news));

        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = z.string().min(1).safeParse(searchParams.get('slug'));
        if (!slug.success) {
            return NextResponse.json({ error: 'Event slug is required' }, { status: 400 });
        }

        const news = await readData<Event[]>(FILE);
        const index = news.findIndex((e) => e.slug === slug.data);
        if (index === -1) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        news.splice(index, 1);
        await writeData(FILE, news);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
