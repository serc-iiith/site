import { describe, it, expect } from 'vitest';
import {
    personSchema,
    paperSchema,
    blogSchema,
    projectSchema,
    collaboratorSchema,
    newsPutSchema,
    canonicalProjectCategory,
} from './adminSchemas';

describe('personSchema', () => {
    const valid = { name: 'Jane Doe', title: 'Professor' };
    it('accepts a minimal person and fills defaults', () => {
        const r = personSchema.parse(valid);
        expect(r.social_links).toEqual({});
        expect(r.interests).toEqual([]);
        expect(r.bio).toBe('');
    });
    it('rejects a missing name', () => {
        expect(personSchema.safeParse({ title: 'x' }).success).toBe(false);
    });
    it('strips unknown keys (category, internStatus, ...)', () => {
        const r = personSchema.parse({ ...valid, category: 'Faculty', internStatus: 'current' });
        expect('category' in r).toBe(false);
        expect('internStatus' in r).toBe(false);
    });
});

describe('paperSchema', () => {
    it('rejects a non-4-digit year', () => {
        expect(
            paperSchema.safeParse({ title: 't', year: 'soon', authors: [] }).success,
        ).toBe(false);
    });
    it('strips the composite-key helper fields the client sends', () => {
        const r = paperSchema.parse({
            title: 't',
            year: '2024',
            authors: ['A'],
            originalTitle: 't',
            originalYear: '2023',
            originalAuthors: '["A"]',
        });
        expect('originalTitle' in r).toBe(false);
    });
});

describe('blogSchema', () => {
    it('coerces a string readTime to a number', () => {
        const r = blogSchema.parse({
            title: 't', author: 'a', date: 'April 1, 2025', readTime: '7',
            category: 'Research', content: 'x',
        });
        expect(r.readTime).toBe(7);
    });
});

describe('projectSchema / canonicalProjectCategory', () => {
    it('normalises category casing', () => {
        expect(canonicalProjectCategory('ai')).toBe('AI');
        expect(canonicalProjectCategory('software-engineering')).toBe('Software-Engineering');
        expect(canonicalProjectCategory('whatever')).toBe('Other');
    });
    it('applies the transform through the schema', () => {
        const r = projectSchema.parse({ title: 't', category: 'security' });
        expect(r.category).toBe('Security');
    });
});

describe('collaboratorSchema', () => {
    it('rejects an unknown category', () => {
        expect(
            collaboratorSchema.safeParse({ name: 'x', category: 'nonprofit' }).success,
        ).toBe(false);
    });
});

describe('newsPutSchema', () => {
    it('requires originalSlug for a rename-capable update', () => {
        const base = { name: 'Ev', startTime: '2026-01-01T09:00' };
        expect(newsPutSchema.safeParse(base).success).toBe(false);
        expect(newsPutSchema.safeParse({ ...base, originalSlug: 'ev' }).success).toBe(true);
    });
});
