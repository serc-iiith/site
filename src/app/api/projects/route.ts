import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readData, writeData } from '@/lib/adminData';
import { slugify, uniqueSlug } from '@/lib/slug';
import {
    projectPostSchema,
    projectPutSchema,
    projectReorderSchema,
    formatIssues,
} from '@/lib/adminSchemas';
import { z } from 'zod';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static is required for `next build` (output: 'export'); the mutating
// handlers still run under `bun run dev:admin`. DELETE takes its id in the
// request body, not query params, which force-static strips in dev.
export const dynamic = 'force-static';

const FILE = 'projects.json';
const projectsImagesDir = path.join(process.cwd(), 'public', 'images', 'projects');

type Project = Record<string, unknown> & { id?: string; title?: string; image?: string };

async function renameImageFile(oldImageURL: string, newId: string): Promise<string | null> {
    try {
        if (!oldImageURL || !oldImageURL.includes('/images/projects/')) return null;
        const oldFilename = oldImageURL.split('/').pop();
        if (!oldFilename) return null;
        const fileExt = path.extname(oldFilename);
        let newFilename = `${newId}${fileExt}`;
        if (oldFilename === newFilename) return null;
        const oldFilePath = path.join(projectsImagesDir, oldFilename);
        if (!fs.existsSync(oldFilePath)) return null;
        let newFilePath = path.join(projectsImagesDir, newFilename);
        if (fs.existsSync(newFilePath)) {
            newFilename = `${newId}-${Date.now()}${fileExt}`;
            newFilePath = path.join(projectsImagesDir, newFilename);
        }
        fs.renameSync(oldFilePath, newFilePath);
        return `/images/projects/${newFilename}`;
    } catch (error) {
        console.error('Error renaming project image file:', error);
        return null;
    }
}

export async function GET() {
    try {
        return NextResponse.json(await readData<Project[]>(FILE));
    } catch (error) {
        console.error('Error reading projects data:', error);
        return NextResponse.json({ error: 'Failed to read projects data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const parsed = projectPostSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const project = parsed.data as Project;
        const projects = await readData<Project[]>(FILE);

        project.id = uniqueSlug(
            project.id || slugify(String(project.title)),
            projects.map((p) => p.id ?? ''),
        );

        projects.push(project);
        await writeData(FILE, projects);

        return NextResponse.json({ success: true, id: project.id });
    } catch (error) {
        console.error('Error adding project:', error);
        return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const reorder = projectReorderSchema.safeParse(body);
        if (reorder.success) {
            const projects = await readData<Project[]>(FILE);
            const byId = new Map(projects.map((p) => [p.id, p]));
            const ordered = reorder.data.ids.map((id) => byId.get(id)).filter(Boolean) as Project[];
            for (const p of projects) if (!reorder.data.ids.includes(p.id ?? '')) ordered.push(p);
            await writeData(FILE, ordered);
            return NextResponse.json({ success: true });
        }

        const parsed = projectPutSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const project = parsed.data as Project;
        const projects = await readData<Project[]>(FILE);

        const index = projects.findIndex((p) => p.id === project.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const oldId = projects[index].id ?? '';
        if (project.id !== oldId && project.image) {
            const renamed = await renameImageFile(project.image, project.id as string);
            if (renamed) project.image = renamed;
        }

        projects[index] = project;
        await writeData(FILE, projects);

        return NextResponse.json({ success: true, id: project.id });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Identifier comes in the body: force-static strips query params in dev.
        const body = await request.json().catch(() => ({}));
        const id = z.string().min(1).safeParse(body?.id);
        if (!id.success) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const projects = await readData<Project[]>(FILE);
        const index = projects.findIndex((p) => p.id === id.data);
        if (index === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        projects.splice(index, 1);
        await writeData(FILE, projects);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
