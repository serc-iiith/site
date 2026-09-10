/**
 * One-off: normalise `category` on every entry in public/data/projects.json to
 * the canonical casing used by the admin editor. Run once, review, commit:
 *
 *   bun scripts/migrations/normalize-project-categories.ts
 */
import { promises as fs } from 'fs';
import path from 'path';
import { canonicalProjectCategory, PROJECT_CATEGORIES } from '../../src/lib/adminSchemas';

const FILE = path.join(process.cwd(), 'public', 'data', 'projects.json');

async function main() {
    const projects: Array<Record<string, unknown>> = JSON.parse(await fs.readFile(FILE, 'utf8'));
    let changed = 0;
    for (const p of projects) {
        const current = String(p.category ?? '');
        const canonical = canonicalProjectCategory(current);
        if (current !== canonical) {
            if (canonical === 'Other' && !PROJECT_CATEGORIES.includes(current as never)) {
                console.warn(`  "${p.title}": unknown category "${current}" -> "Other" (review)`);
            }
            p.category = canonical;
            changed++;
        }
    }
    await fs.writeFile(FILE, JSON.stringify(projects, null, 2) + '\n', 'utf8');
    console.log(`Normalised ${changed} project categor${changed === 1 ? 'y' : 'ies'}.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
