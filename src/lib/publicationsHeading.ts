/**
 * Heading for a profile's publications section. A person flagged with
 * `selectedRecentPublications` gets the curated wording; everyone else gets
 * the plain one.
 */
export function publicationsHeading(person: { selectedRecentPublications?: boolean }): string {
    return person.selectedRecentPublications ? 'Selected Recent Publications' : 'Publications';
}
