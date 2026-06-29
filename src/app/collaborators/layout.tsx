import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Collaborators",
  description:
    "Explore SERC collaborators and sponsors across industry, academia, and government supporting software engineering research and impact.",
  path: "/collaborators",
  keywords: [
    "SERC collaborators",
    "research partners",
    "industry collaboration",
    "academic collaboration",
    "sponsors",
  ],
});

export default function CollaboratorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
