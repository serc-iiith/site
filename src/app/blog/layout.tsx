import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Blog",
  description:
    "Read SERC insights on software engineering, AI, systems, and research practices from faculty, researchers, and students.",
  path: "/blog",
  keywords: [
    "SERC blog",
    "software engineering blog",
    "research insights",
    "AI and software engineering",
  ],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
