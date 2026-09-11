/**
 * Atomic, guarded read/write for the JSON files under `public/data/` that the
 * admin API routes mutate.
 *
 * Why this exists:
 *  - The old per-route `readXData()` helpers for blogs/papers caught JSON parse
 *    errors and returned `[]`. A POST right after a transient read failure then
 *    wrote that `[]` (plus the one new record) back, destroying the file. Here a
 *    read failure throws and the route returns 500 without writing anything.
 *  - Writes were a bare `fs.writeFileSync` — a crash mid-write truncated the
 *    file. Here we copy `<file>` -> `<file>.bak`, write a temp file, then
 *    `rename` (atomic within the same directory).
 *  - Routes disagreed on indentation (2 vs 4 spaces) causing noisy git diffs.
 *    The indent is now fixed per file.
 */
import { promises as fs } from 'fs';
import path from 'path';

const dataDir = () => path.join(process.cwd(), 'public', 'data');

/** Existing on-disk indentation, preserved to keep git diffs minimal. */
const INDENT: Record<string, number> = {
    'people.json': 4,
    'news.json': 4,
    'papers.json': 2,
    'blogs.json': 2,
    'projects.json': 2,
    'collaborators.json': 2,
};

function resolveDataFile(file: string): string {
    const dir = dataDir();
    const full = path.resolve(dir, file);
    if (path.dirname(full) !== dir) {
        throw new Error(`Refusing to access data file outside public/data: ${file}`);
    }
    return full;
}

/** Read and parse a data file. Throws on missing file or invalid JSON. */
export async function readData<T>(file: string): Promise<T> {
    const raw = await fs.readFile(resolveDataFile(file), 'utf8');
    return JSON.parse(raw) as T;
}

/**
 * Write a data file atomically, leaving a `<file>.bak` copy of the previous
 * contents. The `.bak` files are git-ignored.
 */
export async function writeData(file: string, data: unknown): Promise<void> {
    const full = resolveDataFile(file);
    const indent = INDENT[file] ?? 2;
    const json = JSON.stringify(data, null, indent) + '\n';

    try {
        await fs.copyFile(full, `${full}.bak`);
    } catch {
        // No existing file to back up (first write) — fine.
    }

    const tmp = `${full}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, json, 'utf8');
    await fs.rename(tmp, full);
}
