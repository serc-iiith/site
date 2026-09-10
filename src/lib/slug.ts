/**
 * Slug helpers shared by the admin editors and the admin API routes.
 *
 * Before this module each editor and route carried its own `generateSlug`
 * implementation and they disagreed (some kept underscores, some did not trim
 * leading/trailing hyphens). Everything now funnels through `slugify`.
 */

/**
 * Turn arbitrary text into a URL-safe slug: strip diacritics, lower-case,
 * collapse any run of non-alphanumerics to a single hyphen, trim edge hyphens.
 */
export function slugify(input: string): string {
    return (input ?? '')
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Return `base` if it is not already taken, otherwise the first free
 * `${base}-1`, `${base}-2`, ... variant.
 */
export function uniqueSlug(base: string, taken: Iterable<string>): string {
    const set = taken instanceof Set ? taken : new Set(taken);
    const seed = base || 'item';
    if (!set.has(seed)) return seed;
    let n = 1;
    while (set.has(`${seed}-${n}`)) n++;
    return `${seed}-${n}`;
}

/**
 * Sanitise a caller-supplied value that will be used as (part of) a filename on
 * disk. Removes path separators, `..` sequences and NUL bytes, and keeps only
 * `[a-z0-9-_]`. Returns `''` when nothing usable is left, so the caller can fall
 * back to a generated name.
 */
export function sanitizeFilenameSlug(input: string | null | undefined): string {
    return (input ?? '')
        .replace(/\0/g, '')
        .replace(/[\\/]+/g, '-')
        .replace(/\.\.+/g, '-')
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/^[-_]+|[-_]+$/g, '')
        .slice(0, 120);
}
