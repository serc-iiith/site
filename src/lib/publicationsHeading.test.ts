import { describe, it, expect } from 'vitest';
import { publicationsHeading } from './publicationsHeading';

describe('publicationsHeading', () => {
    it('uses the plain heading when the flag is unset', () => {
        expect(publicationsHeading({})).toBe('Publications');
    });
    it('uses the plain heading when the flag is false', () => {
        expect(publicationsHeading({ selectedRecentPublications: false })).toBe('Publications');
    });
    it('uses the selected heading when the flag is true', () => {
        expect(publicationsHeading({ selectedRecentPublications: true })).toBe(
            'Selected Recent Publications',
        );
    });
});
