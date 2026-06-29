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
  const fullTitle = `${input.title} | SERC IIIT Hyderabad`;
  const canonical = `https://serc.iiit.ac.in${input.path}`;

  return {
    title: fullTitle,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: canonical,
      siteName: "SERC",
      images: [defaultOgImage],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [defaultOgImage.url],
    },
  };
}
