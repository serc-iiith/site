import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Projects",
  description:
    "Discover SERC projects spanning software engineering, AI-enabled systems, design, education, security, and real-world technology impact.",
  path: "/projects",
  keywords: [
    "SERC projects",
    "software engineering projects",
    "AI projects",
    "research projects",
  ],
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
