/**
 * One-off: sort public/data/papers.json newest-year-first, preserving the
 * existing order within each year. The admin API keeps it sorted on every
 * write; this brings the current file in line. Run once, review, commit:
 *
 *   bun scripts/migrations/sort-papers-by-year.ts
 */
import { promises as fs } from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'public', 'data', 'papers.json');

async function main() {
    const papers: Array<Record<string, unknown>> = JSON.parse(await fs.readFile(FILE, 'utf8'));
    const sorted = papers
        .map((p, i) => ({ p, i, y: parseInt(String(p.year ?? ''), 10) || 0 }))
        .sort((a, b) => b.y - a.y || a.i - b.i) // stable within a year
        .map((x) => x.p);

    await fs.writeFile(FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
    console.log(`Sorted ${sorted.length} papers by year (desc).`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
