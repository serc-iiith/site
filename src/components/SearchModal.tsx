"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Loader2, FileText, PenTool, Beaker, Users, User, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import projectsData from '../../public/data/projects.json';
import papersData from '../../public/data/papers.json';
import blogsData from '../../public/data/blogs.json';
import collaboratorsData from '../../public/data/collaborators.json';
import peopleData from '../../public/data/people.json';

// Types for search results
type ProjectResult = {
  id: string;
  title: string;
  description: string;
  category: string;
};

type PaperResult = {
  title: string;
  authors?: string[];
  year: string;
  venue: string;
  url?: string;
};

type BlogResult = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  slug?: string;
};

type CollaboratorResult = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type PersonResult = {
  name: string;
  title: string;
  interests?: string[];
  slug?: string;
};

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: 'all' | 'papers' | 'blogs' | 'projects' | 'collaborators' | 'people';
  url?: string;
};

// Function to search through the data
export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  // Convert query to lowercase for case-insensitive search
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search through people (all categories)
  Object.entries(peopleData).forEach(([category, people]) => {
    people.forEach((person: PersonResult, personIndex) => {
      if (
        person.name.toLowerCase().includes(q) ||
        person.title?.toLowerCase().includes(q) ||
        person.interests?.some(interest => interest.toLowerCase().includes(q))
      ) {
        results.push({
          id: `person-${category}-${personIndex}`,
          title: person.name,
          subtitle: `${person.title} (${category})`,
          description: person.interests?.join(', '),
          type: 'people'
        });
      }
    });
  });

  // Search through projects
  projectsData.forEach((project: ProjectResult) => {
    if (
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `project-${project.id}`,
        title: project.title,
        subtitle: project.category.charAt(0).toUpperCase() + project.category.slice(1),
        description: project.description,
        type: 'projects'
      });
    }
  });

  // Search through papers
  papersData.forEach((paper: PaperResult, index) => {
    if (
      paper.title.toLowerCase().includes(q) ||
      paper.venue?.toLowerCase().includes(q) ||
      paper.year?.toLowerCase().includes(q) ||
      paper.authors?.some(author => author.toLowerCase().includes(q))
    ) {
      results.push({
        id: `paper-${index}`,
        title: paper.title,
        subtitle: paper.venue,
        description: `Published in ${paper.year}`,
        type: 'papers',
        url: paper.url
      });
    }
  });

  // Search through blogs
  blogsData.forEach((blog: BlogResult) => {
    if (
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt.toLowerCase().includes(q) ||
      blog.author.toLowerCase().includes(q)
    ) {
      results.push({
        id: `blog-${blog.id}`,
        title: blog.title,
        subtitle: `By ${blog.author}`,
        description: blog.excerpt,
        type: 'blogs'
      });
    }
  });

  // Search through collaborators
  collaboratorsData.forEach((collaborator: CollaboratorResult) => {
    if (
      collaborator.name.toLowerCase().includes(q) ||
      collaborator.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: `collaborator-${collaborator.id}`,
        title: collaborator.name,
        subtitle: collaborator.category.charAt(0).toUpperCase() + collaborator.category.slice(1),
        description: collaborator.description,
        type: 'collaborators'
      });
    }
  });

  return results;
}

type FilterType = 'all' | 'papers' | 'blogs' | 'projects' | 'collaborators' | 'people';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLUListElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Reset search when modal closes
      setSearchQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Actual search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Reset selected index when search changes
      setSelectedIndex(-1);

      // Add a small delay to prevent too many searches while typing
      const timer = setTimeout(async () => {
        try {
          const searchResults = await searchAll(searchQuery);
          setResults(searchResults);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Reset selected index when filter changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [activeFilter]);

  // Filter results based on active filter
  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter(result => result.type === activeFilter);

  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    // Get the type and ID
    const type = result.type;
    const idParts = result.id.split('-');
    const id = idParts.slice(1).join('-'); // Handle IDs that might contain multiple hyphens

    // Navigate based on result type
    switch (type) {
      case 'papers':
        // For papers, use the URL from the paper data if available
        const paperIndex = parseInt(id);
        if (!isNaN(paperIndex) && paperIndex >= 0 && paperIndex < papersData.length) {
          const paperUrl = papersData[paperIndex].url;
          if (paperUrl) {
            window.open(paperUrl, '_blank');
          }
        }
        break;

      case 'blogs':
        // For blogs, find matching blog by ID and use its slug
        const blogId = parseInt(id);
        const blog = blogsData.find(b => b.id === blogId);
        if (blog) {
          window.location.href = `/blog/${blog.slug}`;
        }
        break;

      case 'projects':
        // For projects, redirect to project page
        window.location.href = `/projects`;
        break;

      case 'collaborators':
        // For collaborators, redirect to collaborators page
        window.location.href = `/collaborators`;
        break;

      case 'people':
        // For people, get category and index and redirect to people page
        const [category, personIndex] = id.split('-');
        const personSlug = peopleData[category]?.[parseInt(personIndex)]?.slug;
        if (personSlug) {
          window.location.href = `/people/${personSlug}`;
        }
        break;
    }

    onClose();
  }, [onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (filteredResults.length > 0) {
            setSelectedIndex(prev => (prev + 1) % filteredResults.length);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (filteredResults.length > 0) {
            setSelectedIndex(prev =>
              prev <= 0 ? filteredResults.length - 1 : prev - 1
            );
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
            handleResultSelect(filteredResults[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose, handleResultSelect]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsContainerRef.current) {
      const selectedItem = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Get capitalized filter name
  const getFilterName = (filter: FilterType) => {
    return filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  // Get appropriate icon for result type
  const getResultIcon = (type: FilterType) => {
    switch (type) {
      case 'papers':
        return <FileText className="text-blue-500" size={18} />;
      case 'blogs':
        return <PenTool className="text-purple-500" size={18} />;
      case 'projects':
        return <Beaker className="text-green-500" size={18} />;
      case 'collaborators':
        return <Users className="text-amber-500" size={18} />;
      case 'people':
        return <User className="text-rose-500" size={18} />;
      default:
        return <Search className="text-gray-500" size={18} />;
    }
  };

  // Count results by type
  const resultCounts = {
    all: results.length,
    papers: results.filter(r => r.type === 'papers').length,
    blogs: results.filter(r => r.type === 'blogs').length,
    projects: results.filter(r => r.type === 'projects').length,
    collaborators: results.filter(r => r.type === 'collaborators').length,
    people: results.filter(r => r.type === 'people').length,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-start justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-[color:var(--background)] w-full max-w-2xl rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden mt-16 sm:mt-0"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            {/* Search header */}
            <div className="flex items-center p-3 border-b border-[var(--border-color)]">
              <div className="flex items-center flex-1 px-2 py-1 bg-[var(--foreground)]/50 rounded-lg">
                <Search className="text-[color:var(--tertiary-color)] ml-1 mr-2 flex-shrink-0" size={18} />
                <input
                  ref={searchInputRef}
                  className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg text-[color:var(--text-color)] placeholder-[color:var(--tertiary-color)]"
                  placeholder="Search for projects, papers, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="p-1 rounded-full hover:bg-hover transition-colors flex-shrink-0"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X className="text-[color:var(--secondary-color)]" size={16} />
                  </button>
                )}
              </div>
              <button
                className="ml-2 p-2 rounded-full hover:bg-hover transition-colors flex-shrink-0"
                onClick={onClose}
                aria-label="Close search"
              >
                <X className="text-[color:var(--secondary-color)]" size={20} />
              </button>
            </div>

            {/* Filters */}
            <div className="overflow-x-auto scrollbar-hide border-b border-[var(--border-color)]">
              <div className="flex p-2 gap-2 min-w-max">
                {(['all', 'papers', 'blogs', 'projects', 'collaborators', 'people'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                      activeFilter === filter
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-[var(--foreground)]/80 hover:bg-[var(--foreground)] text-[color:var(--secondary-color)]'
                    }`}
                  >
                    {getFilterName(filter)}
                    {resultCounts[filter] > 0 && (
                      <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                        activeFilter === filter 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[var(--border-color)] text-[color:var(--secondary-color)]'
                      }`}>
                        {resultCounts[filter]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results area */}
            <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="animate-spin text-accent" size={28} />
                  <span className="mt-3 text-[color:var(--secondary-color)]">Searching...</span>
                </div>
              ) : searchQuery.trim() ? (
                <>
                  {filteredResults.length > 0 ? (
                    <ul ref={resultsContainerRef} className="p-2">
                      {filteredResults.map((result, index) => (
                        <motion.li
                          key={result.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className={`mb-2 p-3 rounded-lg cursor-pointer transition-colors border ${
                            selectedIndex === index
                              ? 'bg-[var(--foreground)] border-[var(--border-color)]'
                              : 'hover:bg-[var(--foreground)]/70 border-transparent'
                          }`}
                          onClick={() => handleResultSelect(result)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-2 rounded-md bg-[var(--background)] flex-shrink-0">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-1">
                                <h4 className="text-[color:var(--text-color)] font-medium text-base leading-tight">
                                  {result.title}
                                </h4>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--background)] text-[color:var(--secondary-color)] capitalize flex-shrink-0">
                                  {result.type}
                                </span>
                              </div>
                              {result.subtitle && (
                                <p className="text-sm text-[color:var(--secondary-color)] mt-1 truncate">
                                  {result.subtitle}
                                </p>
                              )}
                              {result.description && (
                                <p className="text-xs text-[color:var(--tertiary-color)] mt-1.5 line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                              {result.url && (
                                <div className="mt-2 flex items-center text-xs text-accent">
                                  <ExternalLink size={12} className="mr-1" />
                                  External link
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-12 text-center">
                      <Search className="inline-block text-[color:var(--tertiary-color)] mb-2" size={28} />
                      <p className="text-[color:var(--secondary-color)]">
                        No results found for &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-xs text-[color:var(--tertiary-color)] mt-1">
                        Try different keywords or browse categories
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center">
                  <Search className="inline-block text-[color:var(--tertiary-color)] mb-2" size={28} />
                  <p className="text-[color:var(--secondary-color)]">
                    Type to start searching
                  </p>
                  <p className="text-xs text-[color:var(--tertiary-color)] mt-1">
                    Search across all content with instant results
                  </p>
                </div>
              )}
            </div>

            {/* Footer with keyboard shortcuts */}
            <div className="p-3 border-t border-[var(--border-color)] bg-[var(--foreground)]/30">
              <div className="flex flex-wrap justify-between gap-y-2 text-xs text-[color:var(--tertiary-color)]">
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-[var(--foreground)] border border-[var(--border-color)] rounded text-[10px] mr-1">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-[var(--foreground)] border border-[var(--border-color)] rounded text-[10px] mr-1">↓</kbd>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-[var(--foreground)] border border-[var(--border-color)] rounded text-[10px] mr-1">Enter</kbd>
                    <span>to select</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-[var(--foreground)] border border-[var(--border-color)] rounded text-[10px] mr-1">Esc</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;