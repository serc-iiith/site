import type { Metadata } from "next";

type RouteSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

const defaultOgImage = {
  url: "/images/serc_team.png",
  width: 1200,
  height: 630,
  alt: "Software Engineering Research Center, IIIT Hyderabad",
};

export function buildRouteMetadata(input: RouteSeoInput): Metadata {
  const fullTitle = `${input.title} | Software Engineering Research Center, IIIT Hyderabad`;
  const canonical = `https://serc.iiit.ac.in${input.path}`;

  // Ensure description is within 120-160 characters range
  let description = input.description.trim();
  if (description.length < 120) {
    const suffix = " Explore our latest computing publications, projects, and academic updates.";
    description = `${description}${suffix}`.substring(0, 160);
  } else if (description.length > 165) {
    description = description.substring(0, 162) + "...";
  }

  return {
    title: fullTitle,
    description: description,
    keywords: input.keywords,
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
      },
    },
    openGraph: {
      title: fullTitle,
      description: description,
      url: canonical,
      siteName: "SERC",
      images: [defaultOgImage],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description,
      images: [defaultOgImage.url],
    },
  };
}
