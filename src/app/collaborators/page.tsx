"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import CollaboratorsData from '../../../public/data/collaborators.json';

interface Collaborator {
  name: string;
  logo: string;
  website: string;
  description?: string;
  category: string;
  id: string;
}

const collaboratorsData = CollaboratorsData as Collaborator[];

export default function CollaboratorsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredCollaborator, setHoveredCollaborator] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500); // Small delay for animation
  }, []);

  const categories = [
    { id: 'all', name: 'All Partners' },
    { id: 'industry', name: 'Industry Partners' },
    { id: 'government', name: 'Government Organizations' },
    { id: 'academic', name: 'Academic Institutions' }
  ];

  const filteredCollaborators = activeCategory === 'all'
    ? collaboratorsData
    : collaboratorsData.filter(collab => collab.category === activeCategory);

  // For the 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.transition = "transform 0.1s";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s";
  };

  return (
    <div className="min-h-screen pt-32 bg-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Our Collaborators & Sponsors
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              We&apos;re proud to work with leading organizations that support our research and innovation.
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === category.id
                  ? 'bg-[color:var(--primary-color)] text-white shadow-md'
                  : 'bg-[color:var(--background)] text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)] border border-[color:var(--border-color)]'}`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Collaborators Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 auto-rows-fr"
        >
          <AnimatePresence>
            {filteredCollaborators.map((collaborator) => (
              <motion.div
                key={collaborator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <Link
                  href={collaborator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div
                    className="bg-[color:var(--background)] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col border border-[color:var(--border-color)]"
                    onMouseMove={(e) => handleMouseMove(e, collaborator.id)}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => setHoveredCollaborator(collaborator.id)}
                  >
                    <div className="p-5 flex items-center justify-center h-48 bg-test">
                      <div className="relative w-full h-full">
                        <Image
                          src={collaborator.logo}
                          alt={`${collaborator.name} logo`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          style={{
                            objectFit: 'contain',
                            transition: 'transform 0.7s ease-in-out',
                            transform: hoveredCollaborator === collaborator.id ? 'scale(1.05)' : 'scale(1)'
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="font-bold text-lg text-[color:var(--text-color)] mb-2">{collaborator.name}</h3>
                      {collaborator.description && (
                        <p className="text-[color:var(--secondary-color)] text-sm">{collaborator.description}</p>
                      )}
                    </div>
                    <div className="px-6 py-3 bg-[color:var(--background)] border-t border-[color:var(--border-color)]">
                      <span className="flex items-center text-[color:var(--primary-color)] text-sm font-medium">
                        Visit Website
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-[color:var(--primary-color)] rounded-xl shadow-lg p-8 text-white text-center mx-auto max-w-3xl"
        >
          <h2 className="text-2xl font-bold mb-4">Interested in collaborating with us?</h2>
          <p className="mb-6">
            We&apos;re always looking for new partners to work with on innovative research projects.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[color:var(--primary-color)] bg-white hover:bg-gray-100"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
}