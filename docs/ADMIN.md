# SERC Admin Dashboard

The dashboard at `/admin` edits the JSON content files under `public/data/` and
uploads images to `public/images/`. **It is a local, developer-only tool** — the
production site is a static export with no server, and `npm run build` strips
`/admin` and `/api/*` from the output.

## Running it

```bash
NEXT_DISABLE_EXPORT=1 bun run dev
```

Then open <http://localhost:3000/admin>. `NEXT_DISABLE_EXPORT=1` turns off
`output: 'export'` for the dev server so the API route handlers
(`POST`/`PUT`/`DELETE`, `/api/upload`) actually run. You no longer need to edit
`next.config.ts` by hand.

## Publishing changes

The dashboard only writes to your local working tree. To get changes live:

```bash
git add public/data public/images
git commit -m "content: ..."
git push

bun run build                 # regenerates llms.txt, exports to out/, strips admin/
rsync -avz --delete out/ deploy@server:/var/www/serc.iiit.ac.in/
ssh deploy@server 'sudo nginx -t && sudo systemctl reload nginx'
```

## Safety nets

- Every write is validated against a zod schema (`src/lib/adminSchemas.ts`). A
  malformed save is rejected with `400` and the file is left untouched.
- Writes are atomic and leave a `public/data/<file>.json.bak` copy of the
  previous contents (git-ignored). To roll back a bad save:
  `mv public/data/foo.json.bak public/data/foo.json`.
- `bun run validate-data` checks every record in `public/data/*.json`.
- `bun run test` runs the unit tests for the slug / data / schema helpers.

## Data model notes (authoritative — the schemas, not README)

| File | Shape | Identity |
|---|---|---|
| `people.json` | object keyed by category (`src/lib/peopleCategories.ts`) | `slug` **within a category** |
| `news.json` | array | `slug` (rename supported via `originalSlug`) |
| `papers.json` | array | `id` (backfilled by `scripts/migrations/add-paper-ids.ts`) |
| `blogs.json` | array | numeric `id` (`max(id)+1` on create) |
| `projects.json` | array | string `id`; `category` stored in canonical casing |
| `collaborators.json` | array | string `id`; sorted by name |

## Migrations (run once, commit the result)

```bash
bun scripts/migrations/add-paper-ids.ts
bun scripts/migrations/normalize-project-categories.ts
```
