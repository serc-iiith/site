import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Contact",
  description:
    "Contact the Software Engineering Research Center (SERC), IIIT Hyderabad for collaboration, research, and institutional inquiries.",
  path: "/contact",
  keywords: [
    "contact SERC",
    "IIIT Hyderabad contact",
    "research collaboration",
    "software engineering center",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
