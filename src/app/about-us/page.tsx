import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";
import AboutUsContent from "./AboutUsContent";

export const metadata: Metadata = buildRouteMetadata({
  title: "About Us",
  description: "Learn about SERC's vision and mission at IIIT Hyderabad, focusing on human-centered and trustworthy software engineering research.",
  path: "/about-us",
  keywords: [
    "SERC",
    "Software Engineering Research Center",
    "IIIT Hyderabad",
    "About SERC",
    "SERC vision",
    "SERC mission",
    "software engineering research India",
    "human-centered software",
    "trustworthy software",
    "academia industry collaboration",
  ],
});

const visionStatement =
  "To be a globally respected Software Engineering research centre that addresses India's challenges while creating worldwide impact by advancing the design, development, and sustainability of intelligent, reliable, human-centered, and responsible software through deep academia-industry collaboration.";

const missionStatement =
  "As software systems become increasingly intelligent and deeply embedded in society, building them well—and understanding who we build them for and why—is essential. Our mission is to understand how human intelligence and autonomous computation can work together to create software that is human-centered, functional, efficient, trustworthy, and understandable.";

type CommitmentIcon = "brain" | "microscope" | "handshake";

const commitments: Array<{ title: string; icon: CommitmentIcon; text: string }> = [
  {
    title: "Advancing Knowledge",
    icon: "brain",
    text: "We advance software engineering through research in programming languages, formal methods, software quality, human-computer interaction (HCI), design, and immersive systems. Our research spans human-centered approaches that ensure systems are inclusive, accessible, and aligned with human cognition, as well as AI for Software Engineering, Software Engineering for AI, self-adaptive systems, sustainability, and human–AI collaboration.",
  },
  {
    title: "Developing People",
    icon: "microscope",
    text: "We educate and mentor researchers, students, and practitioners who bridge theory and practice while thinking beyond technical boundaries. We cultivate leaders who are technically excellent, ethically grounded, and equipped to understand the broader societal and human impact of software.",
  },
  {
    title: "Creating Impact",
    icon: "handshake",
    text: "We connect software engineering with HCI and design, treating user experience as a core engineering concern. Working with partners across academia, industry, and government, we translate research into intelligent and sustainable solutions for real-world challenges in domains such as healthcare, education, and governance.",
  },
];

export default function AboutUsPage() {
  return <AboutUsContent visionStatement={visionStatement} missionStatement={missionStatement} commitments={commitments} />;
}
