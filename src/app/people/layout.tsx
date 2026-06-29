import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "People",
  description:
    "Meet SERC faculty, researchers, students, and alumni at IIIT Hyderabad working on software engineering research and innovation.",
  path: "/people",
  keywords: [
    "SERC people",
    "IIIT Hyderabad faculty",
    "software engineering researchers",
    "research students",
  ],
});

export default function PeopleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
