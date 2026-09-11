/**
 * Validate every record in public/data/*.json against the admin schemas.
 * Run manually: `bun scripts/validate-data.ts`. Exits non-zero on any failure.
 */
import {
    personSchema, paperSchema, blogSchema, projectSchema,
    collaboratorSchema, newsEventSchema, formatIssues,
} from '../src/lib/adminSchemas';
import people from '../public/data/people.json';
import papers from '../public/data/papers.json';
import blogs from '../public/data/blogs.json';
import projects from '../public/data/projects.json';
import collaborators from '../public/data/collaborators.json';
import news from '../public/data/news.json';

let fail = 0;
function check(name: string, schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } }, items: unknown[]) {
    items.forEach((it, i) => {
        const r = schema.safeParse(it);
        if (!r.success) {
            fail++;
            const label = (it as Record<string, string>).name || (it as Record<string, string>).title || (it as Record<string, string>).slug || String(i);
            console.log(`FAIL ${name}[${i}] "${label}":`, formatIssues(r.error as never).slice(0, 6));
        }
    });
}
for (const [cat, arr] of Object.entries(people as Record<string, unknown[]>)) check(`people/${cat}`, personSchema, arr);
check('papers', paperSchema, papers as unknown[]);
check('blogs', blogSchema, blogs as unknown[]);
check('projects', projectSchema, projects as unknown[]);
check('collaborators', collaboratorSchema, collaborators as unknown[]);
check('news', newsEventSchema, news as unknown[]);

if (fail) { console.error(`\n${fail} record(s) failed validation`); process.exit(1); }
console.log('All data valid.');
