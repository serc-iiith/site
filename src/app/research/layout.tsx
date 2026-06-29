import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Research",
  description:
    "Explore SERC research areas, publications, and software engineering contributions across AI, formal methods, HCI, software quality, and systems engineering.",
  path: "/research",
  keywords: [
    "SERC research",
    "software engineering research",
    "research publications",
    "formal methods",
    "HCI",
    "AI for software engineering",
  ],
});

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
