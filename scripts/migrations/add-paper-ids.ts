/**
 * One-off: backfill a stable `id` on every entry in public/data/papers.json.
 * The admin API previously identified a paper by a fragile title+year+authors
 * composite. Run once, review the diff, commit:
 *
 *   bun scripts/migrations/add-paper-ids.ts
 */
import { promises as fs } from 'fs';
import path from 'path';
import { slugify, uniqueSlug } from '../../src/lib/slug';

const FILE = path.join(process.cwd(), 'public', 'data', 'papers.json');

async function main() {
    const papers: Array<Record<string, unknown>> = JSON.parse(await fs.readFile(FILE, 'utf8'));
    const seen = new Set<string>(papers.map((p) => String(p.id ?? '')).filter(Boolean));

    let added = 0;
    for (const p of papers) {
        if (p.id) continue;
        const base =
            (slugify(`${p.title ?? 'paper'}-${p.year ?? ''}`) || 'paper').slice(0, 120);
        const id = uniqueSlug(base, seen);
        seen.add(id);
        // Put id first for readability.
        const rest = { ...p };
        for (const k of Object.keys(p)) delete (p as Record<string, unknown>)[k];
        (p as Record<string, unknown>).id = id;
        Object.assign(p, rest);
        added++;
    }

    await fs.writeFile(FILE, JSON.stringify(papers, null, 2) + '\n', 'utf8');
    console.log(`Added ids to ${added} paper(s); ${papers.length} total.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
