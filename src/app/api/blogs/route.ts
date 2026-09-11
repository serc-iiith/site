import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readData, writeData } from '@/lib/adminData';
import { slugify, uniqueSlug } from '@/lib/slug';
import {
    blogPostSchema,
    blogPutSchema,
    blogReorderSchema,
    formatIssues,
} from '@/lib/adminSchemas';
import { z } from 'zod';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static is required for `next build` (output: 'export'); the mutating
// handlers still run under `bun run dev:admin`. DELETE takes its id in the
// request body, not query params, which force-static strips in dev.
export const dynamic = 'force-static';

const FILE = 'blogs.json';
const blogsImagesDir = path.join(process.cwd(), 'public', 'images', 'blogs');

type Blog = Record<string, unknown> & { id?: number; slug?: string; title?: string; coverImage?: string };

async function renameImageFile(oldImageURL: string, newSlug: string): Promise<string | null> {
    try {
        if (!oldImageURL || !oldImageURL.includes('/images/blogs/')) return null;
        const oldFilename = oldImageURL.split('/').pop();
        if (!oldFilename) return null;
        const fileExt = path.extname(oldFilename);
        let newFilename = `${newSlug}${fileExt}`;
        if (oldFilename === newFilename) return null;
        const oldFilePath = path.join(blogsImagesDir, oldFilename);
        if (!fs.existsSync(oldFilePath)) return null;
        let newFilePath = path.join(blogsImagesDir, newFilename);
        if (fs.existsSync(newFilePath)) {
            newFilename = `${newSlug}-${Date.now()}${fileExt}`;
            newFilePath = path.join(blogsImagesDir, newFilename);
        }
        fs.renameSync(oldFilePath, newFilePath);
        return `/images/blogs/${newFilename}`;
    } catch (error) {
        console.error('Error renaming blog image file:', error);
        return null;
    }
}

export async function GET() {
    try {
        return NextResponse.json(await readData<Blog[]>(FILE));
    } catch (error) {
        console.error('Error reading blogs data:', error);
        return NextResponse.json({ error: 'Failed to read blogs data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const parsed = blogPostSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const blog = parsed.data as Blog;
        const blogs = await readData<Blog[]>(FILE);

        blog.id = Math.max(0, ...blogs.map((b) => Number(b.id) || 0)) + 1;
        blog.slug = uniqueSlug(
            blog.slug || slugify(String(blog.title)),
            blogs.map((b) => b.slug ?? ''),
        );

        blogs.unshift(blog);
        await writeData(FILE, blogs);

        return NextResponse.json({ success: true, id: blog.id, slug: blog.slug });
    } catch (error) {
        console.error('Error adding blog:', error);
        return NextResponse.json({ error: 'Failed to add blog' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const reorder = blogReorderSchema.safeParse(body);
        if (reorder.success) {
            const blogs = await readData<Blog[]>(FILE);
            const byId = new Map(blogs.map((b) => [Number(b.id), b]));
            const ordered = reorder.data.ids.map((id) => byId.get(id)).filter(Boolean) as Blog[];
            for (const b of blogs) if (!reorder.data.ids.includes(Number(b.id))) ordered.push(b);
            await writeData(FILE, ordered);
            return NextResponse.json({ success: true });
        }

        const parsed = blogPutSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: formatIssues(parsed.error) },
                { status: 400 },
            );
        }
        const blog = parsed.data as Blog;
        const blogs = await readData<Blog[]>(FILE);

        const index = blogs.findIndex((b) => Number(b.id) === Number(blog.id));
        if (index === -1) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        const oldSlug = blogs[index].slug ?? '';
        blog.slug = uniqueSlug(
            blog.slug || slugify(String(blog.title)),
            blogs.filter((_, i) => i !== index).map((b) => b.slug ?? ''),
        );

        if (blog.slug !== oldSlug && blog.coverImage) {
            const renamed = await renameImageFile(blog.coverImage, blog.slug);
            if (renamed) blog.coverImage = renamed;
        }

        blogs[index] = blog;
        await writeData(FILE, blogs);

        return NextResponse.json({ success: true, id: blog.id, slug: blog.slug });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Identifier comes in the body: force-static strips query params in dev.
        const body = await request.json().catch(() => ({}));
        const id = z.coerce.number().int().safeParse(body?.id);
        if (!id.success) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        const blogs = await readData<Blog[]>(FILE);
        const index = blogs.findIndex((b) => Number(b.id) === id.data);
        if (index === -1) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        blogs.splice(index, 1);
        await writeData(FILE, blogs);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
