/**
 * The canonical set of People categories (top-level keys in
 * `public/data/people.json`). Single source of truth for:
 *  - the category dropdown in `EditPeople`
 *  - the author-role lookup in `EditBlogs`
 *  - the faculty/students section of `scripts/generate-llms-txt.ts`
 *
 * Keep the order sensible for display (faculty first, alumni last).
 */
export const PEOPLE_CATEGORIES = [
    'Faculty',
    'Affiliate Faculty',
    'Research Associates',
    'PhD Students',
    'MS by Research',
    'Dual Degree',
    'Honors',
    'Alumni',
] as const;

export type PeopleCategory = (typeof PEOPLE_CATEGORIES)[number];

/** Categories whose members are current researchers, used by llms.txt. */
export const LLMS_PEOPLE_CATEGORIES: readonly string[] = [
    'Faculty',
    'Affiliate Faculty',
    'Research Associates',
    'PhD Students',
    'MS by Research',
    'Dual Degree',
    'Honors',
];

export function isPeopleCategory(value: string): value is PeopleCategory {
    return (PEOPLE_CATEGORIES as readonly string[]).includes(value);
}
