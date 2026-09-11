import { describe, it, expect } from 'vitest';
import { slugify, uniqueSlug, sanitizeFilenameSlug } from './slug';

describe('slugify', () => {
    it('lower-cases and hyphenates', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });
    it('strips diacritics', () => {
        expect(slugify('Raúl Núñez')).toBe('raul-nunez');
    });
    it('collapses punctuation runs and trims edge hyphens', () => {
        expect(slugify('  --A. B & C!!  ')).toBe('a-b-c');
    });
    it('drops underscores (previous impls disagreed here)', () => {
        expect(slugify('foo_bar')).toBe('foo-bar');
    });
    it('handles empty / non-latin input', () => {
        expect(slugify('')).toBe('');
        expect(slugify('日本語')).toBe('');
    });
});

describe('uniqueSlug', () => {
    it('returns the base when free', () => {
        expect(uniqueSlug('vasu', ['raghu', 'karthik'])).toBe('vasu');
    });
    it('appends the first free numeric suffix', () => {
        expect(uniqueSlug('vasu', ['vasu', 'vasu-1'])).toBe('vasu-2');
    });
    it('accepts a Set', () => {
        expect(uniqueSlug('x', new Set(['x']))).toBe('x-1');
    });
    it('falls back to "item" for an empty base', () => {
        expect(uniqueSlug('', [])).toBe('item');
    });
});

describe('sanitizeFilenameSlug', () => {
    it('neutralises path traversal', () => {
        expect(sanitizeFilenameSlug('../../data/people')).toBe('data-people');
        expect(sanitizeFilenameSlug('../../../../etc/passwd')).toBe('etc-passwd');
    });
    it('strips separators and NUL bytes', () => {
        expect(sanitizeFilenameSlug('a/b\\c\0d')).toBe('a-b-cd');
    });
    it('keeps only [a-z0-9-_]', () => {
        expect(sanitizeFilenameSlug('Raghu Reddy!')).toBe('raghu-reddy');
    });
    it('returns empty when nothing usable remains', () => {
        expect(sanitizeFilenameSlug('...')).toBe('');
        expect(sanitizeFilenameSlug(null)).toBe('');
    });
});
