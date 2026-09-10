/**
 * Zod schemas for every admin API write endpoint.
 *
 * Purpose: a malformed payload from the admin UI (or a direct request) must
 * never be persisted to `public/data/*.json`, because a syntactically or
 * structurally broken file breaks `scripts/generate-llms-txt.ts` and therefore
 * the whole production build.
 *
 * `z.object` strips unknown keys by default (zod v4), which also removes helper
 * fields the client tacks on (`originalTitle`, `generateNewSlug`, `category` on
 * a person object, ...). Routes must persist `schema.parse(body)` output, never
 * the raw body.
 */
import { z } from 'zod';
import { PEOPLE_CATEGORIES } from './peopleCategories';

/* ------------------------------------------------------------------ helpers */

const TEXT = (max: number) => z.string().max(max);
const TRIMMED = (max: number) => z.string().trim().max(max);

/**
 * A link/URL field. Kept deliberately permissive (any string within a length
 * cap): the existing data has bare domains, plain-text placeholders and
 * site-relative paths, and the point of these schemas is structural/type
 * safety + unknown-key stripping, not URL syntax enforcement.
 */
const urlish = z.string().max(2048);

const imagePath = z.string().max(2048);

const YEAR_STRING = z.string().regex(/^\d{3,4}$/, 'must be a 3- or 4-digit year');

/* ------------------------------------------------------------------ people */

export const educationSchema = z.object({
    degree: TRIMMED(300),
    institution: TRIMMED(300),
    year: z.coerce.number().int().min(1900).max(2100).optional(),
});

export const personSchema = z.object({
    name: TRIMMED(200).min(1),
    title: TRIMMED(200).optional().default(''),
    email: z.union([z.email().max(320), z.literal('')]).optional().default(''),
    imageURL: imagePath.optional().default(''),
    slug: TRIMMED(200).optional(),
    social_links: z.record(z.string().max(60), urlish).optional().default({}),
    interests: z.array(TRIMMED(200)).max(100).optional().default([]),
    education: z.array(educationSchema).max(50).optional().default([]),
    bio: TEXT(20000).optional().default(''),
});

export const personPutSchema = z.object({
    person: personSchema,
    category: z.enum(PEOPLE_CATEGORIES),
    oldCategory: z.enum(PEOPLE_CATEGORIES).optional(),
    oldSlug: z.string().max(200).optional(),
});

export const personPostSchema = z.object({
    person: personSchema,
    category: z.enum(PEOPLE_CATEGORIES),
});

export const peopleReorderSchema = z.object({
    reorder: z.literal(true),
    category: z.enum(PEOPLE_CATEGORIES),
    slugs: z.array(z.string().max(200)).min(1),
});

/* ------------------------------------------------------------------ papers */

export const paperSchema = z.object({
    id: z.string().max(200).optional(),
    title: TRIMMED(500).min(1),
    year: YEAR_STRING,
    authors: z.array(TRIMMED(200)).max(200),
    venue: TRIMMED(500).optional().default(''),
    cite: TEXT(20000).optional().default(''),
    doi: TRIMMED(200).optional(),
    url: urlish.optional(),
});

export const paperPostSchema = paperSchema;
export const paperPutSchema = paperSchema.extend({ id: z.string().max(200) });

/* ------------------------------------------------------------------ blogs */

export const blogSchema = z.object({
    id: z.coerce.number().int().min(0).optional(),
    title: TRIMMED(300).min(1),
    slug: TRIMMED(300).optional(),
    author: TRIMMED(200),
    role: TRIMMED(200).optional().default(''),
    date: TRIMMED(100),
    readTime: z.coerce.number().int().min(0).max(1000),
    category: TRIMMED(100),
    coverImage: imagePath.optional().default(''),
    excerpt: TEXT(2000).optional().default(''),
    content: TEXT(200000),
});

export const blogPostSchema = blogSchema;
export const blogPutSchema = blogSchema.extend({ id: z.coerce.number().int().min(0) });

export const blogReorderSchema = z.object({
    reorder: z.literal(true),
    ids: z.array(z.coerce.number().int()).min(1),
});

/* ------------------------------------------------------------------ projects */

export const PROJECT_CATEGORIES = [
    'AI',
    'Education',
    'Security',
    'Software-Engineering',
    'Blockchain',
    'Usability',
    'Medical',
    'Other',
] as const;

/** Case-insensitive map to canonical casing; unknown values fall back to 'Other'. */
export function canonicalProjectCategory(value: string): string {
    const hit = PROJECT_CATEGORIES.find(
        (c) => c.toLowerCase() === String(value ?? '').toLowerCase(),
    );
    return hit ?? 'Other';
}

export const projectCollaboratorSchema = z.object({
    name: TRIMMED(200).min(1),
    logo: imagePath.optional().default(''),
    url: urlish.optional().default(''),
});

export const projectLinkSchema = z.object({
    label: TRIMMED(200).min(1),
    url: urlish,
});

export const projectSchema = z.object({
    id: z.string().max(200).optional(),
    title: TRIMMED(300).min(1),
    description: TEXT(5000).optional().default(''),
    collaborators: z.array(projectCollaboratorSchema).max(100).optional().default([]),
    links: z.array(projectLinkSchema).max(100).optional().default([]),
    image: imagePath.optional().default(''),
    demoLink: urlish.optional(),
    category: z
        .string()
        .max(100)
        .transform(canonicalProjectCategory),
});

export const projectPostSchema = projectSchema;
export const projectPutSchema = projectSchema.extend({ id: z.string().max(200) });

export const projectReorderSchema = z.object({
    reorder: z.literal(true),
    ids: z.array(z.string().max(200)).min(1),
});

/* ------------------------------------------------------------------ collaborators */

export const COLLABORATOR_CATEGORIES = ['academic', 'industry', 'government'] as const;

export const collaboratorSchema = z.object({
    id: z.string().max(200).optional(),
    name: TRIMMED(200).min(1),
    logo: imagePath.optional().default(''),
    website: urlish.optional().default(''),
    description: TEXT(2000).optional().default(''),
    category: z.enum(COLLABORATOR_CATEGORIES),
});

export const collaboratorPostSchema = collaboratorSchema;
export const collaboratorPutSchema = collaboratorSchema.extend({ id: z.string().max(200) });

/* ------------------------------------------------------------------ news */

const otherUrlBag = z
    .object({
        code: urlish.optional().default(''),
        pdf: urlish.optional().default(''),
        slides: urlish.optional().default(''),
        video: urlish.optional().default(''),
    })
    .optional()
    .default({ code: '', pdf: '', slides: '', video: '' });

const otherUrlLabelBag = z
    .object({
        code: TEXT(200).optional().default(''),
        pdf: TEXT(200).optional().default(''),
        slides: TEXT(200).optional().default(''),
        video: TEXT(200).optional().default(''),
    })
    .optional()
    .default({ code: '', pdf: '', slides: '', video: '' });

export const newsEventSchema = z.object({
    slug: TRIMMED(300).optional(),
    name: TRIMMED(300).min(1),
    eventURL: urlish.optional().default(''),
    location: TRIMMED(300).optional().default(''),
    locationURL: urlish.optional().default(''),
    summary: TEXT(2000).optional().default(''),
    detail: TEXT(50000).optional().default(''),
    startTime: TRIMMED(40).min(1),
    endTime: TRIMMED(40).optional().default(''),
    hasTime: z.boolean().optional().default(true),
    eventType: TRIMMED(60).optional().default(''),
    schemaType: TRIMMED(60).optional().default('Event'),
    imageURLs: z.array(imagePath).max(50).optional().default([]),
    presenters: z.array(TRIMMED(200)).max(100).optional().default([]),
    otherURLs: otherUrlBag,
    otherURLLabels: otherUrlLabelBag,
});

export const newsPostSchema = newsEventSchema;
export const newsPutSchema = newsEventSchema.extend({
    originalSlug: z.string().min(1).max(300),
});

/* ------------------------------------------------------------------ types */

export type Person = z.infer<typeof personSchema>;
export type Paper = z.infer<typeof paperSchema>;
export type Blog = z.infer<typeof blogSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Collaborator = z.infer<typeof collaboratorSchema>;
export type NewsEvent = z.infer<typeof newsEventSchema>;

/** Flatten a ZodError into `["field.path: message", ...]` for API responses. */
export function formatIssues(error: z.ZodError): string[] {
    return error.issues.map((i) => {
        const path = i.path.join('.') || '(root)';
        return `${path}: ${i.message}`;
    });
}
