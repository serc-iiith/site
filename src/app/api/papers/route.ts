import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/adminData';
import { slugify, uniqueSlug } from '@/lib/slug';
import { paperPostSchema, paperPutSchema, formatIssues } from '@/lib/adminSchemas';
import { z } from 'zod';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static is required for `next build` (output: 'export'); the mutating
// handlers still run under `bun run dev:admin`. DELETE takes its id in the
// request body, not query params, which force-static strips in dev.
export const dynamic = 'force-static';

const FILE = 'papers.json';

type Paper = Record<string, unknown> & { id?: string; title?: string; year?: string };

/** Newest-year first, stable within a year. */
function sortByYear(list: Paper[]): Paper[] {
    return [...list]
        .map((p, i) => ({ p, i, y: parseInt(String(p.year ?? ''), 10) || 0 }))
        .sort((a, b) => b.y - a.y || a.i - b.i)
        .map((x) => x.p);
}

export async function GET() {
    try {
        return NextResponse.json(sortByYear(await readData<Paper[]>(FILE)));
    } catch (error) {
        console.error('Error reading papers data:', error);
        return NextResponse.json({ error: 'Failed to read papers data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const parsed = paperPostSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const papers = await readData<Paper[]>(FILE);
        const paper = parsed.data as Paper;

        const base = slugify(`${paper.title}-${paper.year}`) || 'paper';
        paper.id = uniqueSlug(base, papers.map((p) => p.id ?? ''));

        papers.unshift(paper);
        await writeData(FILE, sortByYear(papers));

        return NextResponse.json({ success: true, id: paper.id });
    } catch (error) {
        console.error('Error adding paper:', error);
        return NextResponse.json({ error: 'Failed to add paper' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const parsed = paperPutSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const paper = parsed.data as Paper;
        const papers = await readData<Paper[]>(FILE);

        const index = papers.findIndex((p) => p.id === paper.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
        }

        papers[index] = paper;
        await writeData(FILE, sortByYear(papers));

        return NextResponse.json({ success: true, id: paper.id });
    } catch (error) {
        console.error('Error updating paper:', error);
        return NextResponse.json({ error: 'Failed to update paper' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Identifier comes in the body: force-static strips query params in dev.
        const body = await request.json().catch(() => ({}));
        const id = z.string().min(1).safeParse(body?.id);
        if (!id.success) {
            return NextResponse.json({ error: 'Paper id is required' }, { status: 400 });
        }

        const papers = await readData<Paper[]>(FILE);
        const index = papers.findIndex((p) => p.id === id.data);
        if (index === -1) {
            return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
        }
        papers.splice(index, 1);
        await writeData(FILE, sortByYear(papers));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting paper:', error);
        return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
    }
}
