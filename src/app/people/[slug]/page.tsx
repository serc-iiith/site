import { notFound } from "next/navigation";
import peopleData from "../../../../public/data/people.json";
import papersData from "../../../../public/data/papers.json";
import PersonProfile from "./PersonProfile";
import type { Metadata, ResolvingMetadata } from 'next'

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
export async function generateMetadata({ params }: { params: { slug: string } }, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const result = getPersonBySlug(slug);

  if (!result) {
    return {
      title: 'Person Not Found | SERC',
    };
  }

  const { person, category } = result;
  const papers = getPublicationsByAuthor(person.name);

  // Use the person's data to generate SEO metadata
  return {
    title: `${person.name} | ${person.title} | SERC`,
    description: person.bio || `${person.name} is a ${person.title} at the Software Engineering Research Center.`,
    keywords: [
      'SERC',
      'Software Engineering',
      'Research',
      person.name,
      person.title,
      category,
      ...(person.interests || [])
    ],
    openGraph: {
      title: `${person.name} | ${person.title}`,
      description: person.bio || `${person.name} is a ${person.title} at the Software Engineering Research Center.`,
      url: `https://serc.iiit.ac.in/people/${person.slug}`,
      images: [
        {
          url: person.imageURL || '/images/people/person_fallback.png',
          width: 800,
          height: 800,
          alt: person.name,
        }
      ],
    },
    twitter: {
      card: 'summary',
      title: `${person.name} | ${person.title}`,
      description: person.bio || `${person.name} is a ${person.title} at the Software Engineering Research Center.`,
      images: [person.imageURL || '/images/people/person_fallback.png'],
    },
  }
}

// Generate static paths for all people
export async function generateStaticParams() {
  const data: PeopleData = peopleData as PeopleData;
  const slugs = [];

  for (const [_, people] of Object.entries(data)) {
    for (const person of people) {
      slugs.push({ slug: person.slug });
    }
  }

  return slugs;
}

export default function PersonPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const result = getPersonBySlug(slug);

  if (!result) {
    notFound();
  }

  const { person, category } = result;
  const publications = getPublicationsByAuthor(person.name);

  // Return the client component with pre-fetched data
  return <PersonProfile person={person} category={category} publications={publications} />;
}
