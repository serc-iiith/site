"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Handshake, Microscope } from "lucide-react";

type CommitmentIcon = "brain" | "microscope" | "handshake";

type Commitment = {
  title: string;
  icon: CommitmentIcon;
  text: string;
};

type AboutUsContentProps = {
  visionStatement: string;
  missionStatement: string;
  commitments: Commitment[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const iconMap = {
  brain: Brain,
  microscope: Microscope,
  handshake: Handshake,
} satisfies Record<CommitmentIcon, typeof Brain>;

export default function AboutUsContent({
  visionStatement,
  missionStatement,
  commitments,
}: AboutUsContentProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[color:var(--background)] to-[color:var(--foreground)] pt-32 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="text-center mb-16 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-[color:var(--primary-color)] mb-3">
            Software Engineering Research Center • IIIT Hyderabad
          </p>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Vision & Mission
          </motion.h1>
          <p className="text-xl text-[color:var(--secondary-color)] max-w-3xl mx-auto leading-relaxed">
            Advancing the design, development, and sustainability of intelligent, reliable, human-centered, and responsible software through deep academia-industry collaboration.
          </p>
        </motion.header>

        <motion.section variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.article
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] shadow-lg p-8 h-full"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--secondary-color)] mb-2">
              Long-Term Direction
            </p>
            <div className="w-14 h-1 bg-[color:var(--primary-color)] mb-4"></div>
            <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-4">Vision</h2>
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--secondary-color)]">
              {visionStatement}
            </p>
          </motion.article>

          <motion.article
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] shadow-lg p-8 h-full"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--secondary-color)] mb-2">
              Core Purpose
            </p>
            <div className="w-14 h-1 bg-[color:var(--primary-color)] mb-4"></div>
            <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-4">Mission</h2>
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--secondary-color)]">
              {missionStatement}
            </p>
          </motion.article>
        </motion.section>

        <motion.section variants={itemVariants} className="mt-8">
          <div className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] shadow-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[color:var(--text-color)] mb-2">Why This Matters</h3>
              <p className="text-base leading-relaxed text-[color:var(--secondary-color)] max-w-3xl">
                Software now shapes healthcare, education, governance, and everyday life. We focus on systems that are not only advanced, but trustworthy, efficient, and aligned with people.
              </p>
            </div>
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <Link
                href="/research"
                className="inline-flex items-center px-4 py-2 rounded-md bg-[color:var(--primary-color)] text-white text-sm md:text-base font-semibold hover:opacity-90 transition-opacity w-fit"
              >
                Explore our research
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} id="commitments" className="mt-14">
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--secondary-color)] mb-3">
              How We Work
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--text-color)] mb-2">
              Our Three Commitments
            </h2>
            <p className="text-base text-[color:var(--secondary-color)]">
              We pursue this mission through three core commitments:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {commitments.map((commitment, index) => {
              const Icon = iconMap[commitment.icon];

              return (
                <motion.article
                  key={commitment.title}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] shadow-lg p-6 h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 rounded-md bg-[color:var(--primary-color)]/10">
                      <Icon className="h-5 w-5 text-[color:var(--primary-color)]" />
                    </span>
                    <span className="text-xs font-semibold tracking-[0.12em] text-[color:var(--secondary-color)]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[color:var(--text-color)] mb-3">
                    {commitment.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-[color:var(--secondary-color)]">
                    {commitment.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mt-10">
          <div className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] shadow-lg p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm md:text-base text-[color:var(--secondary-color)]">
              Interested in collaborating with SERC on research, systems, or societal challenges?
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/research"
                  className="inline-flex items-center text-[color:var(--primary-color)] hover:underline"
                >
                  Explore Research
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-[color:var(--primary-color)] hover:underline"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
