import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sanitizeFilenameSlug, slugify } from '@/lib/slug';

// Dev-only tool: this route is stripped from the static export at build time.
// force-static is required for `next build` (output: 'export'); POST still runs
// under `bun run dev:admin`.
export const dynamic = 'force-static';

/** Upload target folders, keyed by the `type` form field. */
const TYPE_FOLDERS: Record<string, string> = {
    people: 'people',
    news: 'news',
    projects: 'projects',
    blogs: 'blogs',
    collaborators: 'collaborators',
};

/** MIME -> canonical extension. The extension is derived from the *detected*
 *  type, never from the client-supplied filename. */
const MIME_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

const MAX_BYTES = 5 * 1024 * 1024;

/** Sniff the real image type from the leading bytes. Returns a MIME key of
 *  MIME_EXT, or null if the buffer is not one of the allowed formats. */
function sniffImageMime(buf: Buffer): string | null {
    if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return 'image/jpeg';
    }
    if (
        buf.length >= 8 &&
        buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47 &&
        buf[4] === 0x0d &&
        buf[5] === 0x0a &&
        buf[6] === 0x1a &&
        buf[7] === 0x0a
    ) {
        return 'image/png';
    }
    if (
        buf.length >= 12 &&
        buf.toString('ascii', 0, 4) === 'RIFF' &&
        buf.toString('ascii', 8, 12) === 'WEBP'
    ) {
        return 'image/webp';
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        let formData: FormData;
        try {
            formData = await request.formData();
        } catch {
            return NextResponse.json(
                { error: 'Request must be multipart/form-data' },
                { status: 400 },
            );
        }
        const file = formData.get('file');
        const type = formData.get('type');
        const rawSlug = formData.get('slug');

        if (!(file instanceof File) || typeof type !== 'string') {
            return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
        }

        const folder = TYPE_FOLDERS[type];
        if (!folder) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        if (bytes.byteLength > MAX_BYTES) {
            return NextResponse.json(
                { error: `File exceeds the ${MAX_BYTES / 1024 / 1024} MB limit` },
                { status: 413 },
            );
        }
        const buffer = Buffer.from(bytes);

        const mime = sniffImageMime(buffer);
        if (!mime) {
            return NextResponse.json(
                { error: 'File is not a valid JPEG, PNG or WebP image' },
                { status: 400 },
            );
        }
        const ext = MIME_EXT[mime];

        // Filename: sanitised slug, else a slugified original basename, else a
        // timestamp. Never trusts caller-controlled path separators.
        let base = sanitizeFilenameSlug(typeof rawSlug === 'string' ? rawSlug : '');
        if (!base) {
            base =
                slugify(path.basename(file.name || '', path.extname(file.name || ''))) ||
                `upload-${Date.now()}`;
        }
        const filename = `${base}${ext}`;

        const destFolder = path.join(process.cwd(), 'public', 'images', folder);
        const filepath = path.join(destFolder, filename);

        // Defence in depth: the resolved path must stay inside destFolder.
        const resolvedDir = path.resolve(destFolder);
        if (
            path.dirname(path.resolve(filepath)) !== resolvedDir
        ) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        await fs.mkdir(destFolder, { recursive: true });
        await fs.writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            filePath: `/images/${folder}/${filename}`,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
