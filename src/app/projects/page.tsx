"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ExternalLink } from 'lucide-react';
import projectsData from '../../../public/data/projects.json';

// Define categories based on your project data
const categories = ["all", "AI", "education", "security", "software-engineering", "blockchain", "usability"];

interface Collaborator {
  name: string;
  logo: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  collaborators: Collaborator[];
  links: { label: string; url: string }[];
  image: string;
  category: string;
  demoLink?: string;
}

// Fixed Video Modal Component
const VideoModal = ({
  isOpen,
  onClose,
  videoId
}: {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}) => {
  if (!isOpen) return null;

  // More robust video ID extraction
  let embedId = videoId;

  // Handle YouTube URLs of different formats
  if (videoId.includes('youtube.com/watch?v=')) {
    const url = new URL(videoId);
    embedId = url.searchParams.get('v') || videoId;
  } else if (videoId.includes('youtu.be/')) {
    embedId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
  } else if (videoId.includes('youtube.com/embed/')) {
    embedId = videoId.split('youtube.com/embed/')[1]?.split('?')[0] || videoId;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl rounded-xl overflow-hidden bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          aria-label="Close video"
        >
          <X size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredListProject, setHoveredListProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoId: '' });

  useEffect(() => {
    setProjects(projectsData as Project[]);
    setIsLoaded(true);
  }, []);

  const openVideoModal = (videoId: string) => {
    setVideoModal({ isOpen: true, videoId });
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoId: '' });
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  // Filter projects based on active category and search query
  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === "all" || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground)] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Our Projects
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Exploring cutting-edge technologies and innovative solutions to real-world problems
          </p>
        </motion.div>

        {/* Controls: Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <div className="flex w-full max-w-2xl items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-10 rounded-full bg-[var(--background)] shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all text-lg text-text"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tertiary absolute left-3 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {/* View Mode Buttons */}
            <div className="flex bg-hover rounded-full p-1 hidden md:block lg:block">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-full text-secondary ${viewMode === 'grid' ? 'bg-[var(--background)] shadow-md' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-full text-secondary ${viewMode === 'list' ? 'bg-[var(--background)] shadow-md' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize
                ${activeCategory === category
                  ? 'bg-[var(--primary-color)] text-white shadow-md'
                  : 'bg-[var(--background)] text-text hover:bg-hover'}`}
            >
              {category === "all" ? "All Projects" : category.replace("-", " ")}
            </button>
          ))}
        </motion.div>

        {/* Projects Display (Grid View) */}
        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div
                    className="h-full bg-[var(--background)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className="relative h-48 w-full bg-[var(--foreground)]">
                      <Image
                        src={project.image || "/images/projects_fallback.png"}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700"
                        style={{
                          transform: hoveredProject === project.id ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />
                      {/* Category badge */}
                      <div className="absolute top-3 right-3 bg-[var(--background)] bg-opacity-85 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text shadow-md capitalize">
                        {project.category.replace("-", " ")}
                      </div>

                      {/* Video play button overlay - shown if project has demo video */}
                      {project.demoLink && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVideoModal(project.demoLink || '');
                          }}
                        >
                          <div className="p-3 bg-[var(--primary-color)] rounded-full shadow-lg transform hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-text mb-2 group-hover:text-[var(--primary-color)]">
                        {project.title}
                      </h3>

                      <div className="overflow-hidden transition-all text-justify duration-500 ease-in-out">
                        <p className="text-secondary text-sm mb-4">
                          {project.description}
                        </p>
                      </div>

                      {project.collaborators.length > 0 && (
                        <div className="mt-auto">
                          <h4 className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-2">Collaborators</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.collaborators.map((collab, i) => (
                              <Link
                                key={i}
                                href={collab.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-white p-1 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                title={collab.name}
                              >
                                {collab.logo ? (
                                  <div className="relative w-12 h-8 rounded-md overflow-hidden">
                                    <Image
                                      src={collab.logo}
                                      alt={collab.name}
                                      fill
                                      sizes="48px"
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-sm px-2 py-1 rounded-md text-black font-bold ">
                                    {collab.name}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-wrap gap-2 justify-between">
                        {project.demoLink && (
                          <button
                            onClick={() => openVideoModal(project.demoLink || '')}
                            className="text-sm px-3 py-1.5 rounded-lg flex items-center transition-colors bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90"
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            Watch Demo
                          </button>
                        )}

                        {/* External Links */}
                        {project.links.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-secondary hover:text-[var(--primary-color)] flex items-center px-3 py-1.5 border border-[var(--border-color)] rounded-lg hover:border-[var(--primary-color)]/30 transition-colors"
                          >
                            {link.label}
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // List View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[var(--background)] rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
                  onMouseEnter={() => setHoveredListProject(project.id)}
                  onMouseLeave={() => setHoveredListProject(null)}
                >
                  <div className="relative w-full md:w-1/3 h-48 bg-[var(--foreground)] flex-shrink-0">
                    <Image
                      src={project.image || "/images/projects_fallback.png"}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-[var(--background)] bg-opacity-85 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text shadow-md capitalize">
                      {project.category.replace("-", " ")}
                    </div>

                    {/* Video play button overlay for list view */}
                    {project.demoLink && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => openVideoModal(project.demoLink || '')}
                      >
                        <div className="p-3 bg-[var(--primary-color)] rounded-full shadow-lg transform hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-text mb-3">
                      {project.title}
                    </h3>

                    <div className="overflow-hidden">
                      <p className="text-secondary mb-4">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      {project.collaborators.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-1">Collaborators</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.collaborators.map((collab, i) => (
                              <Link
                                key={i}
                                href={collab.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-white p-1 rounded shadow-sm border border-[var(--border-color)] hover:shadow-md transition-shadow"
                                title={collab.name}
                              >
                                {collab.logo ? (
                                  <div className="relative w-16 h-10">
                                    <Image
                                      src={collab.logo}
                                      alt={collab.name}
                                      fill
                                      sizes="64px"
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                    <span className="text-sm px-2 py-1 text-black font-bold">
                                    {collab.name}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="ml-auto flex flex-wrap gap-2">
                        {/* Demo Video Button for list view */}
                        {project.demoLink && (
                          <button
                            onClick={() => openVideoModal(project.demoLink || '')}
                            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors text-sm flex items-center"
                          >
                            <Play className="h-4 w-4 mr-1.5" />
                            Watch Demo
                          </button>
                        )}

                        {/* External Links */}
                        {project.links.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-[var(--border-color)] text-secondary rounded-lg hover:bg-hover transition-colors text-sm flex items-center"
                          >
                            {link.label}
                            <ExternalLink className="h-4 w-4 ml-1.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-text mb-2">No projects found</h3>
            <p className="text-secondary">
              Try adjusting your search or filter to find what you&apos;re looking for
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModal.isOpen && (
          <VideoModal
            isOpen={videoModal.isOpen}
            onClose={closeVideoModal}
            videoId={videoModal.videoId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}