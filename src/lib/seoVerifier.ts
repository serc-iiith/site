import blogData from "../../public/data/blogs.json";
import newsData from "../../public/data/news.json";
import peopleData from "../../public/data/people.json";

const BASE_URL = "https://serc.iiit.ac.in";

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
export type JsonLdObject = { [key: string]: JsonLdValue };

export type SeoVerifierEntry = {
  id: string;
  title: string;
  url: string;
  routeGroup: "static" | "blog" | "news" | "people";
  schemaType: string;
  jsonLd: JsonLdObject | JsonLdObject[];
};

type BlogPost = {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  coverImage?: string;
};

type NewsEvent = {
  slug: string;
  name: string;
  location: string;
  locationURL: string;
  summary: string;
  detail: string;
  startTime: string;
  endTime: string;
  imageURLs: string[];
  presenters: string[];
};

type Education = {
  degree: string;
  institution: string;
  year?: number;
};

type Person = {
  name: string;
  title: string;
  email?: string;
  imageURL?: string;
  slug: string;
  interests?: string[];
  education?: Education[];
  bio?: string;
};

const toAbsoluteUrl = (url?: string): string => {
  if (!url) return `${BASE_URL}/images/serc-logo.png`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const staticEntries: SeoVerifierEntry[] = [
  {
    id: "home",
    title: "Home",
    url: `${BASE_URL}/`,
    routeGroup: "static",
    schemaType: "WebSite + ResearchOrganization + LocalBusiness",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Software Engineering Research Center",
        alternateName: "SERC",
        url: `${BASE_URL}/`,
        inLanguage: "en-IN",
      },
      {
        "@context": "https://schema.org",
        "@type": "ResearchOrganization",
        name: "Software Engineering Research Center, IIIT Hyderabad",
        alternateName: "SERC",
        url: `${BASE_URL}/`,
        logo: `${BASE_URL}/images/serc-logo.png`,
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "IIIT Hyderabad",
          url: "https://www.iiit.ac.in",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Software Engineering Research Center, IIIT Hyderabad",
        image: `${BASE_URL}/images/serc_team.png`,
        url: `${BASE_URL}/`,
        telephone: "+91-40-6653-1000",
        address: {
          "@type": "PostalAddress",
          streetAddress: "IIIT Hyderabad Campus, Prof. C R Rao Road, Gachibowli",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          postalCode: "500032",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 17.4457,
          longitude: 78.3488,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "17:00",
        },
      },
    ],
  },
  {
    id: "about-us",
    title: "About Us",
    url: `${BASE_URL}/about-us`,
    routeGroup: "static",
    schemaType: "AboutPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Us | SERC IIIT Hyderabad",
      url: `${BASE_URL}/about-us`,
      description:
        "Vision and mission of the Software Engineering Research Center at IIIT Hyderabad.",
      isPartOf: {
        "@type": "WebSite",
        name: "SERC",
        url: `${BASE_URL}/`,
      },
    },
  },
  {
    id: "research",
    title: "Research",
    url: `${BASE_URL}/research`,
    routeGroup: "static",
    schemaType: "CollectionPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Research | SERC IIIT Hyderabad",
      url: `${BASE_URL}/research`,
      description:
        "Research publications and themes from the Software Engineering Research Center at IIIT Hyderabad.",
    },
  },
  {
    id: "projects",
    title: "Projects",
    url: `${BASE_URL}/projects`,
    routeGroup: "static",
    schemaType: "CollectionPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Projects | SERC IIIT Hyderabad",
      url: `${BASE_URL}/projects`,
      description:
        "Projects from the Software Engineering Research Center spanning software engineering, AI, and systems impact.",
    },
  },
  {
    id: "people",
    title: "People",
    url: `${BASE_URL}/people`,
    routeGroup: "static",
    schemaType: "CollectionPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "People | SERC IIIT Hyderabad",
      url: `${BASE_URL}/people`,
      description:
        "Faculty, researchers, and students associated with the Software Engineering Research Center.",
    },
  },
  {
    id: "blog",
    title: "Blog",
    url: `${BASE_URL}/blog`,
    routeGroup: "static",
    schemaType: "Blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "SERC Blog",
      url: `${BASE_URL}/blog`,
      description:
        "Articles and research insights from the Software Engineering Research Center.",
      publisher: {
        "@type": "Organization",
        name: "Software Engineering Research Center, IIIT Hyderabad",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/images/serc-logo.png`,
        },
      },
    },
  },
  {
    id: "news",
    title: "News",
    url: `${BASE_URL}/news`,
    routeGroup: "static",
    schemaType: "CollectionPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "News | SERC IIIT Hyderabad",
      url: `${BASE_URL}/news`,
      description:
        "Events, talks, workshops, and announcements from the Software Engineering Research Center.",
    },
  },
  {
    id: "collaborators",
    title: "Collaborators",
    url: `${BASE_URL}/collaborators`,
    routeGroup: "static",
    schemaType: "CollectionPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Collaborators | SERC IIIT Hyderabad",
      url: `${BASE_URL}/collaborators`,
      description:
        "Industry, academic, and government collaborators associated with SERC.",
    },
  },
  {
    id: "contact",
    title: "Contact",
    url: `${BASE_URL}/contact`,
    routeGroup: "static",
    schemaType: "ContactPage",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact | SERC IIIT Hyderabad",
      url: `${BASE_URL}/contact`,
      description:
        "Contact the Software Engineering Research Center at IIIT Hyderabad.",
      mainEntity: {
        "@type": "ResearchOrganization",
        name: "Software Engineering Research Center, IIIT Hyderabad",
        email: "serc.admin@iiit.ac.in",
      },
    },
  },
];

const blogEntries: SeoVerifierEntry[] = (blogData as BlogPost[]).map((post) => ({
  id: `blog-${post.slug}`,
  title: post.title,
  url: `${BASE_URL}/blog/${post.slug}`,
  routeGroup: "blog",
  schemaType: "BlogPosting",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: toAbsoluteUrl(post.coverImage || "/images/blog_fallback.png"),
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Software Engineering Research Center, IIIT Hyderabad",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/serc-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    keywords: [post.category, "SERC", "Research", "Software Engineering"],
    articleSection: post.category,
  },
}));

const flatPeople = Object.values(peopleData as Record<string, Person[]>).flat();

const personEntries: SeoVerifierEntry[] = flatPeople.map((person) => {
  const personJsonLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    email: person.email || undefined,
    description: person.bio || `${person.name} is part of SERC at IIIT Hyderabad.`,
    url: `${BASE_URL}/people/${person.slug}`,
    image: toAbsoluteUrl(person.imageURL || "/images/person_fallback.png"),
    affiliation: {
      "@type": "Organization",
      name: "Software Engineering Research Center, IIIT Hyderabad",
      url: BASE_URL,
    },
    memberOf: {
      "@type": "Organization",
      name: "Software Engineering Research Center, IIIT Hyderabad",
      url: BASE_URL,
    },
  };

  if (person.interests && person.interests.length > 0) {
    personJsonLd.knowsAbout = person.interests;
  }

  if (person.education && person.education.length > 0) {
    personJsonLd.alumniOf = person.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      degree: edu.degree,
    }));
  }

  return {
    id: `person-${person.slug}`,
    title: person.name,
    url: `${BASE_URL}/people/${person.slug}`,
    routeGroup: "people",
    schemaType: "Person",
    jsonLd: personJsonLd,
  };
});

const personNameToSlug = new Map(flatPeople.map((person) => [person.name.toLowerCase(), person.slug]));

const newsEntries: SeoVerifierEntry[] = (newsData as NewsEvent[]).map((event) => {
  const startDate = new Date(event.startTime).toISOString();
  const endDate = event.endTime ? new Date(event.endTime).toISOString() : startDate;
  const eventJsonLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.summary || `${event.name} at ${event.location}`,
    startDate,
    endDate,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
      },
      url: event.locationURL || null,
    },
    image: toAbsoluteUrl(event.imageURLs?.[0] || "/images/event_fallback.png"),
    url: `${BASE_URL}/news/${event.slug}`,
    organizer: {
      "@type": "Organization",
      name: "Software Engineering Research Center, IIIT Hyderabad",
      url: BASE_URL,
    },
  };

  const performers = event.presenters
    ?.map((presenter) => {
      const slug = personNameToSlug.get(presenter.toLowerCase());
      return slug
        ? {
            "@type": "Person",
            name: presenter,
            url: `${BASE_URL}/people/${slug}`,
          }
        : {
            "@type": "Person",
            name: presenter,
          };
    })
    .filter(Boolean);

  if (performers && performers.length > 0) {
    eventJsonLd.performer = performers;
  }

  return {
    id: `news-${event.slug}`,
    title: event.name,
    url: `${BASE_URL}/news/${event.slug}`,
    routeGroup: "news",
    schemaType: "Event",
    jsonLd: eventJsonLd,
  };
});

export function getSeoVerifierEntries(): SeoVerifierEntry[] {
  return [...staticEntries, ...blogEntries, ...newsEntries, ...personEntries];
}
