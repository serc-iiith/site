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
  "To be a globally respected software research center that addresses Indian challenges and creates worldwide impact by advancing how intelligent, reliable, human-centered and responsible software is designed, developed and sustained through deep academia-industry collaboration.";

const missionStatement =
  "As software systems become more intelligent and deeply embedded in society, building them well and understanding whom and why we build it is essential. Our mission is to understand how human intelligence and autonomous computation can come together to create software that is human-centered, functional, efficient, trustworthy and remains understandable.";

type CommitmentIcon = "brain" | "microscope" | "handshake";

const commitments: Array<{ title: string; icon: CommitmentIcon; text: string }> = [
  {
    title: "Advancing Knowledge",
    icon: "brain",
    text: "We advance software engineering through research across programming languages, formal methods, software quality, and human computer interaction, design, and immersive systems. We focus on human centered approaches that ensure systems are inclusive, accessible, and aligned with human cognition, while software engineering for AI and AI for software engineering, self adaptive systems, sustainability, and human and autonomous collaboration.",
  },
  {
    title: "Developing People",
    icon: "microscope",
    text: "We nurture researchers and practitioners who can move between theory and practice and think beyond technical boundaries. Through education and mentorship, we prepare individuals who are technically strong and aware of the broader social and human impact of their work.",
  },
  {
    title: "Creating Impact",
    icon: "handshake",
    text: "We connect software engineering with HCI and design, treating user experience as a core engineering concern. Working with partners across academia, industry, and government, we translate research into intelligent and sustainable solutions for real world challenges in areas such as healthcare, education, and governance.",
  },
];

export default function AboutUsPage() {
  return <AboutUsContent visionStatement={visionStatement} missionStatement={missionStatement} commitments={commitments} />;
}
