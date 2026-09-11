import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readData, writeData } from '@/lib/adminData';
import { slugify, uniqueSlug } from '@/lib/slug';
import {
    personPostSchema,
    personPutSchema,
    peopleReorderSchema,
    formatIssues,
} from '@/lib/adminSchemas';
import { z } from 'zod';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static is required for `next build` (output: 'export'); the mutating
// handlers still run under `bun run dev:admin`. DELETE takes its id in the
// request body, not query params, which force-static strips in dev.
export const dynamic = 'force-static';

const FILE = 'people.json';
const peopleImagesDir = path.join(process.cwd(), 'public', 'images', 'people');

type Person = Record<string, unknown> & { slug?: string; imageURL?: string };
type PeopleData = Record<string, Person[]>;

/** Rename a people image on disk when a person's slug changes. Returns the new
 *  image URL, or null when nothing was renamed. */
async function renameImageFile(
    oldImageURL: string | undefined,
    newSlug: string,
): Promise<string | null> {
    try {
        if (!oldImageURL || !oldImageURL.includes('/images/people/')) return null;
        const oldFilename = oldImageURL.split('/').pop();
        if (!oldFilename) return null;

        const fileExt = path.extname(oldFilename);
        let newFilename = `${newSlug}${fileExt}`;
        if (oldFilename === newFilename) return null;

        const oldFilePath = path.join(peopleImagesDir, oldFilename);
        if (!fs.existsSync(oldFilePath)) return null;

        let newFilePath = path.join(peopleImagesDir, newFilename);
        if (fs.existsSync(newFilePath)) {
            newFilename = `${newSlug}-${Date.now()}${fileExt}`;
            newFilePath = path.join(peopleImagesDir, newFilename);
        }
        fs.renameSync(oldFilePath, newFilePath);
        return `/images/people/${newFilename}`;
    } catch (error) {
        console.error('Error renaming image file:', error);
        return null;
    }
}

export async function GET() {
    try {
        // Serve stored order (the admin UI can reorder within a category).
        return NextResponse.json(await readData<PeopleData>(FILE));
    } catch (error) {
        console.error('Error reading people data:', error);
        return NextResponse.json({ error: 'Failed to read people data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = personPostSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const { person, category } = parsed.data;

        const data = await readData<PeopleData>(FILE);
        if (!data[category]) data[category] = [];

        const base = person.slug || slugify(person.name);
        const slug = uniqueSlug(base, data[category].map((p) => p.slug ?? ''));
        const record = { ...person, slug };

        data[category].push(record as unknown as Person);
        await writeData(FILE, data);

        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error('Error adding person:', error);
        return NextResponse.json({ error: 'Failed to add person' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        // Reorder payload takes a different shape.
        const reorder = peopleReorderSchema.safeParse(body);
        if (reorder.success) {
            const { category, slugs } = reorder.data;
            const data = await readData<PeopleData>(FILE);
            const list = data[category];
            if (!Array.isArray(list)) {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 });
            }
            const bySlug = new Map(list.map((p) => [p.slug, p]));
            const reordered = slugs.map((s) => bySlug.get(s)).filter(Boolean) as Person[];
            // Keep any records the client did not mention, at the end.
            for (const p of list) if (!slugs.includes(p.slug ?? '')) reordered.push(p);
            data[category] = reordered;
            await writeData(FILE, data);
            return NextResponse.json({ success: true });
        }

        const parsed = personPutSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const { person, category } = parsed.data;
        const oldCategory = parsed.data.oldCategory ?? category;
        const oldSlug = parsed.data.oldSlug ?? person.slug ?? '';
        if (!oldSlug) {
            return NextResponse.json({ error: 'Missing editingSlug' }, { status: 400 });
        }

        const data = await readData<PeopleData>(FILE);
        if (!Array.isArray(data[oldCategory])) {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }

        const oldIndex = data[oldCategory].findIndex((p) => p.slug === oldSlug);
        if (oldIndex === -1) {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }
        const oldPerson = data[oldCategory][oldIndex];

        if (!data[category]) data[category] = [];

        // Resolve the target slug, keeping it unique within the target category.
        let slug = person.slug || slugify(person.name);
        const takenInTarget = data[category]
            .filter((_p, i) => !(category === oldCategory && i === oldIndex))
            .map((p) => p.slug ?? '');
        slug = uniqueSlug(slug, takenInTarget);

        let imageURL = person.imageURL;
        if (slug !== oldSlug) {
            const renamed = await renameImageFile(oldPerson.imageURL, slug);
            if (renamed) imageURL = renamed;
        }

        const record = { ...person, slug, imageURL } as unknown as Person;

        if (category === oldCategory) {
            data[category][oldIndex] = record;
        } else {
            data[oldCategory].splice(oldIndex, 1);
            data[category].push(record);
        }

        await writeData(FILE, data);
        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error('Error updating person:', error);
        return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Identifiers come in the body: force-static strips query params in dev.
        const body = await request.json().catch(() => ({}));
        const slug = z.string().min(1).safeParse(body?.slug);
        const category = z.string().min(1).safeParse(body?.category);
        if (!slug.success || !category.success) {
            return NextResponse.json(
                { error: 'Slug and category are required' },
                { status: 400 },
            );
        }

        const data = await readData<PeopleData>(FILE);
        const list = data[category.data];
        if (!Array.isArray(list)) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        const index = list.findIndex((p) => p.slug === slug.data);
        if (index === -1) {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }
        list.splice(index, 1);
        await writeData(FILE, data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting person:', error);
        return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
    }
}
