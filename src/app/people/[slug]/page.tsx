import { notFound } from "next/navigation";
import peopleData from "../../../../public/data/people.json";
import papersData from "../../../../public/data/papers.json";
import PersonProfile from "./PersonProfile";
import type { Metadata } from 'next'

const BASE_URL = 'https://serc.iiit.ac.in';

const toAbsoluteUrl = (url: string): string => {
  if (!url) return `${BASE_URL}/images/person_fallback.png`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Define TypeScript types for our data
type Education = {
  degree: string;
  institution: string;
  year: number;
};

type Paper = {
  authors: string[];
  year: string;
  title: string;
  cite: string;
  venue: string;
  doi: string;
  url: string;
};

type Person = {
  name: string;
  title: string;
  email: string;
  imageURL: string;
  slug: string;
  social_links: Record<string, string>;
  interests?: string[];
  education?: Education[];
  bio?: string;
};

type PeopleData = {
  Faculty: Person[];
  "PhD Students": Person[];
  "MS by Research": Person[];
  "Dual Degree": Person[];
  Honors: Person[];
  Alumni: Person[];
  "Research Associates": Person[];
};

// Function to get person data by slug
function getPersonBySlug(
  slug: string
): { person: Person; category: string } | null {
  const data: PeopleData = peopleData as PeopleData;

  for (const [category, people] of Object.entries(data)) {
    const person = people.find((p) => p.slug === slug);
    if (person) {
      return { person, category };
    }
  }

  return null;
}

// Function to get papers by author name
function getPublicationsByAuthor(authorName: string): Paper[] {
  return (papersData as Paper[]).filter((paper) =>
    paper.authors.some((author) =>
      author.toLowerCase().includes(authorName.toLowerCase())
    )
  );
}

// Generate metadata for better SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = getPersonBySlug(slug);

  if (!result) {
    return {
      title: 'Person Not Found | SERC',
    };
  }

  const { person, category } = result;
  // papers unused in metadata - used in page component

  // Create a rich description using the bio if available
  const description = person.bio
    ? `${person.name} is a ${person.title} at the Software Engineering Research Center. ${person.bio.substring(0, 150)}${person.bio.length > 150 ? '...' : ''}`
    : `${person.name} is a ${person.title} at the Software Engineering Research Center.`;

  // Use the person's data to generate SEO metadata
  const canonical = `${BASE_URL}/people/${person.slug}`;

  return {
    title: `${person.name} | ${person.title} | SERC`,
    description: description,
    keywords: [
      'SERC',
      'Software Engineering',
      'Research',
      person.name,
      person.title,
      category,
      ...(person.interests || [])
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${person.name} | ${person.title}`,
      description: description,
      url: canonical,
      images: [
        {
          url: toAbsoluteUrl(person.imageURL || '/images/person_fallback.png'),
          width: 800,
          height: 800,
          alt: person.name,
        }
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${person.name} | ${person.title}`,
      description: description,
      images: [toAbsoluteUrl(person.imageURL || '/images/person_fallback.png')],
    },
  }
}

// Generate static paths for all people
export async function generateStaticParams() {
  const data: PeopleData = peopleData as PeopleData;
  const slugs = [];

  for (const people of Object.values(data)) {
    for (const person of people) {
      slugs.push({ slug: person.slug });
    }
  }

  return slugs;
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getPersonBySlug(slug);

  if (!result) {
    notFound();
  }

  const { person, category } = result;
  const publications = getPublicationsByAuthor(person.name);

  // Create JSON-LD structured data for this person
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.title,
    email: person.email,
    description: person.bio,
    url: `${BASE_URL}/people/${person.slug}`,
    image: toAbsoluteUrl(person.imageURL || '/images/person_fallback.png'),
    affiliation: {
      '@type': 'Organization',
      name: 'Software Engineering Research Center, IIIT Hyderabad',
      url: BASE_URL
    },
    memberOf: {
      '@type': 'Organization',
      name: 'Software Engineering Research Center, IIIT Hyderabad',
      url: BASE_URL
    }
  };

  // Add publications if present
  if (publications.length > 0) {
    personJsonLd.publications = publications.map(pub => ({
      '@type': 'ScholarlyArticle',
      name: pub.title,
      author: pub.authors.map(author => ({ '@type': 'Person', name: author })),
      datePublished: pub.year,
      publisher: pub.venue,
      url: pub.url ? toAbsoluteUrl(pub.url) : pub.doi
    }));
  }

  // Add interests if present
  if (person.interests && person.interests.length > 0) {
    personJsonLd.knowsAbout = person.interests;
  }

  // Add education if present
  if (person.education && person.education.length > 0) {
    personJsonLd.alumniOf = person.education.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
      degree: edu.degree
    }));
  }

  // Return the client component with pre-fetched data
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd)
        }}
      />
      <PersonProfile person={person} category={category} publications={publications} />
    </>
  );
}
