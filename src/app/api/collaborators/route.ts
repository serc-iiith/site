import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readData, writeData } from '@/lib/adminData';
import { slugify, uniqueSlug } from '@/lib/slug';
import {
    collaboratorPostSchema,
    collaboratorPutSchema,
    formatIssues,
} from '@/lib/adminSchemas';
import { z } from 'zod';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static keeps `next build` (output: 'export') happy; the mutating methods
// still run under `NEXT_DISABLE_EXPORT=1 next dev`.
export const dynamic = 'force-static';

const FILE = 'collaborators.json';
const imagesDir = path.join(process.cwd(), 'public', 'images', 'collaborators');

type Collaborator = Record<string, unknown> & { id?: string; name?: string; logo?: string };

async function renameImageFile(oldImageURL: string, newId: string): Promise<string | null> {
    try {
        if (!oldImageURL || !oldImageURL.includes('/images/collaborators/')) return null;
        const oldFilename = oldImageURL.split('/').pop();
        if (!oldFilename) return null;
        const fileExt = path.extname(oldFilename);
        let newFilename = `${newId}${fileExt}`;
        if (oldFilename === newFilename) return null;
        const oldFilePath = path.join(imagesDir, oldFilename);
        if (!fs.existsSync(oldFilePath)) return null;
        let newFilePath = path.join(imagesDir, newFilename);
        if (fs.existsSync(newFilePath)) {
            newFilename = `${newId}-${Date.now()}${fileExt}`;
            newFilePath = path.join(imagesDir, newFilename);
        }
        fs.renameSync(oldFilePath, newFilePath);
        return `/images/collaborators/${newFilename}`;
    } catch (error) {
        console.error('Error renaming collaborator logo file:', error);
        return null;
    }
}

const byName = (a: Collaborator, b: Collaborator) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''));

export async function GET() {
    try {
        return NextResponse.json(await readData<Collaborator[]>(FILE));
    } catch (error) {
        console.error('Error reading collaborators data:', error);
        return NextResponse.json({ error: 'Failed to read collaborators data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const parsed = collaboratorPostSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const collaborator = parsed.data as Collaborator;
        const collaborators = await readData<Collaborator[]>(FILE);

        collaborator.id = uniqueSlug(
            collaborator.id || slugify(String(collaborator.name)),
            collaborators.map((c) => c.id ?? ''),
        );

        collaborators.push(collaborator);
        collaborators.sort(byName);
        await writeData(FILE, collaborators);

        return NextResponse.json({ success: true, id: collaborator.id });
    } catch (error) {
        console.error('Error adding collaborator:', error);
        return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const parsed = collaboratorPutSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const collaborator = parsed.data as Collaborator;
        const collaborators = await readData<Collaborator[]>(FILE);

        const index = collaborators.findIndex((c) => c.id === collaborator.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
        }

        const oldId = collaborators[index].id ?? '';
        if (collaborator.id !== oldId && collaborator.logo) {
            const renamed = await renameImageFile(collaborator.logo, collaborator.id as string);
            if (renamed) collaborator.logo = renamed;
        }

        collaborators[index] = collaborator;
        collaborators.sort(byName);
        await writeData(FILE, collaborators);

        return NextResponse.json({ success: true, id: collaborator.id });
    } catch (error) {
        console.error('Error updating collaborator:', error);
        return NextResponse.json({ error: 'Failed to update collaborator' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = z.string().min(1).safeParse(searchParams.get('id'));
        if (!id.success) {
            return NextResponse.json({ error: 'Collaborator ID is required' }, { status: 400 });
        }

        const collaborators = await readData<Collaborator[]>(FILE);
        const index = collaborators.findIndex((c) => c.id === id.data);
        if (index === -1) {
            return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
        }
        collaborators.splice(index, 1);
        await writeData(FILE, collaborators);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting collaborator:', error);
        return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
    }
}
