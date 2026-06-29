import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | SERC IIIT Hyderabad",
  description: "Administrative dashboard for managing SERC website content and SEO verification tools.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
