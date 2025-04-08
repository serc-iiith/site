import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/lib/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://serc.iiit.ac.in"),
  title: "SERC - Software Engineering Research Center",
  description: "SERC - Software Engineering Research Center at IIIT-Hyderabad specializes in research and development of state-of-the-art software engineering techniques and tools.",
  keywords: "software engineering, research, IIIT-Hyderabad, programming languages, machine learning, SE and ML, formal methods, gamification, HCI, IoT, programming languages, self-adaptive systems, software analytics, software quality, software sustainiblity, VR and AR",
  authors: [{ name: "SERC Team" }],
  openGraph: {
    title: "SERC - Software Engineering Research Center",
    description: "Software Engineering Research Center at IIIT-Hyderabad",
    url: "https://serc.iiit.ac.in/",
    siteName: "SERC",
    images: [
      {
        url: "/images/serc_team.png",
        width: 1200,
        height: 630,
        alt: "SERC Team",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SERC - Software Engineering Research Center",
    description: "Software Engineering Research Center at IIIT-Hyderabad",
    images: ["/images/serc_team.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
