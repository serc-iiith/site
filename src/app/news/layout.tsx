import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "News",
  description:
    "Track the latest SERC events, talks, workshops, and announcements from the Software Engineering Research Center at IIIT Hyderabad.",
  path: "/news",
  keywords: [
    "SERC news",
    "software engineering events",
    "workshops",
    "research announcements",
  ],
});

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
