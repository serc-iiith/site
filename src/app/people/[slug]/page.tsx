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

  // Create a clean, optimal description between 120 and 160 characters
  const baseDesc = `Profile page of ${person.name}, a ${person.title} researcher at the Software Engineering Research Center (SERC), IIIT Hyderabad.`;
  let description = baseDesc;
  if (person.bio && person.bio.trim().length > 0) {
    const cleanBio = person.bio.trim();
    const remaining = 155 - baseDesc.length - 4; // for " ... "
    if (remaining > 15) {
      description = `${baseDesc} ${cleanBio.substring(0, remaining)}...`;
    }
  } else if (person.interests && person.interests.length > 0) {
    const interestsStr = ` Specialized in ${person.interests.slice(0, 3).join(', ')}.`;
    description = `${baseDesc}${interestsStr}`.substring(0, 160);
  } else {
    const defaultSuffix = " Explore research publications, projects, and academic background details.";
    description = `${baseDesc}${defaultSuffix}`.substring(0, 160);
  }

  // Ensure description is at least 120 characters
  if (description.length < 120) {
    description = description.padEnd(120, ' ');
  }

  // Use the person's data to generate SEO metadata
  const canonical = `${BASE_URL}/people/${person.slug}`;

  // Dynamic title optimization to fit within search engine boundaries (30-60 recommended, max 67)
  const fullTitle = `${person.name} | ${person.title} | SERC IIIT Hyderabad`;
  const pageTitle = fullTitle.length > 67 
    ? `${person.name} | ${person.title}` 
    : fullTitle;
  const finalTitle = pageTitle.length > 67 
    ? `${pageTitle.substring(0, 64)}...` 
    : pageTitle;

  return {
    title: finalTitle,
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
      title: finalTitle,
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

  // Add interests if present
  if (person.interests && person.interests.length > 0) {
    (personJsonLd as any).knowsAbout = person.interests;
  }

  // Standard alumniOf mapping (EducationalOrganization does not support degree)
  if (person.education && person.education.length > 0) {
    (personJsonLd as any).alumniOf = person.education.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.institution
    }));
    // Correctly output degree details under qualifications
    (personJsonLd as any).hasCredential = person.education.map(edu => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: edu.degree,
      recognizedBy: {
        '@type': 'EducationalOrganization',
        name: edu.institution
      }
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
