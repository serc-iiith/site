"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Calendar, Users, BookOpen, Bookmark, X, Copy, Info, Link, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";
import CustomCountUp from '@/components/CustomCountUp';
import SearchFilterBar from '@/components/SearchFilterBar'
import ResearchModal from '@/components/ResearchModal';

interface ExternalResource {
  name: string;
  url: string;
}

interface Paper {
  title: string;
  authors: string[];
  venue: string;
  year: string;
  cite: string;
  doi: string;
  url: string;
  externalResources: ExternalResource[];
}

export default function ResearchPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchVenue, setSearchVenue] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const papersPerPage = 12;

  useEffect(() => {
    async function fetchPapers() {
      try {
        // TODO: follow basePath in next.config.js
        const response = await fetch('/data/papers.json');
        const data = await response.json();
        setPapers(data);
      } catch (error) {
        toast.error('Error fetching papers');
      } finally {
        setLoading(false);
      }
    }

    fetchPapers();
  }, []);

  // Add effect to disable scrolling when dialog is open
  useEffect(() => {
    if (openDialogId !== null) {
      // Disable scrolling
      document.body.classList.add('overflow-hidden');
    } else {
      // Enable scrolling
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [openDialogId]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear, selectedVenues, selectedAuthors]);

  const years = useMemo(() => {
    return Array.from(new Set(papers.map(paper => paper.year))).sort((a, b) => parseInt(b) - parseInt(a));
  }, [papers]);

  const venues = useMemo(() => {
    return Array.from(new Set(papers.map(paper => paper.venue)));
  }, [papers]);

  const authors = useMemo(() => {
    const allAuthors = papers.flatMap(paper => paper.authors);
    return Array.from(new Set(allAuthors)).sort();
  }, [papers]);

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        paper.venue.toLowerCase().includes(searchQuery.toLowerCase());

      const minYear = parseInt(selectedYear?.split('-')[0] || '0')
      const maxYear = parseInt(selectedYear?.split('-')[1] || '9999')
      const paperYear = parseInt(paper.year);
      const matchesYear = selectedYear ? paperYear >= minYear && paperYear <= maxYear : true;

      const matchesVenue = selectedVenues.length > 0
        ? selectedVenues.includes(paper.venue)
        : true;

      const matchesAuthor = selectedAuthors.length > 0
        ? paper.authors.some(author => selectedAuthors.includes(author))
        : true;

      return matchesSearch && matchesYear && matchesVenue && matchesAuthor;
    });
  }, [papers, searchQuery, selectedYear, selectedVenues, selectedAuthors]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPapers.length / papersPerPage);
  const indexOfLastPaper = currentPage * papersPerPage;
  const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
  const currentPapers = filteredPapers.slice(indexOfFirstPaper, indexOfLastPaper);

  const paginate = (pageNumber: number) => {
    // Only paginate within bounds
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Smooth scroll to top of papers section
      document.getElementById('papers-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function resetFilters() {
    setSelectedYear("");
    setSelectedVenues([]);
    setSelectedAuthors([]);
    setSearchQuery('');
    setSearchVenue('');
    setSearchAuthor('');
  }

  // Check if any filter is active
  const isAnyFilterActive = useCallback(() => {
    return searchQuery !== '' ||
      selectedYear !== '' ||
      selectedVenues.length > 0 ||
      selectedAuthors.length > 0;
  }, [searchQuery, selectedYear, selectedVenues, selectedAuthors]);

  // Generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const showPages = 5; // Max number of page buttons to show
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading research papers...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground">
      {/* Hero Section */}
      <section className="pt-32 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Research Publications
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Browse through our collection of research publications by our faculty and students.
          </p>
        </motion.div>

        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          venues={venues}
          selectedVenues={selectedVenues}
          setSelectedVenues={setSelectedVenues}
          searchVenue={searchVenue}
          setSearchVenue={setSearchVenue}
          authors={authors}
          selectedAuthors={selectedAuthors}
          setSelectedAuthors={setSelectedAuthors}
          searchAuthor={searchAuthor}
          setSearchAuthor={setSearchAuthor}
          resetFilters={resetFilters}
        />
      </section>

      {/* Stats Section - will stay in DOM but change visibility */}
      <motion.section
        className="py-20 px-4 relative overflow-hidden"
        initial={{ opacity: 1, height: 'auto' }}
        animate={{
          opacity: isAnyFilterActive() ? 0 : 1,
          height: isAnyFilterActive() ? 0 : 'auto',
          marginTop: isAnyFilterActive() ? 0 : undefined,
          marginBottom: isAnyFilterActive() ? 0 : undefined,
          padding: isAnyFilterActive() ? 0 : undefined
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-indigo-600 rounded-full blur-3xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.05 + 0.02,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[var(--background)] p-8 rounded-xl shadow-xl hover:shadow-2xl text-center group hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors duration-300">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <CustomCountUp value={papers.length.toString()} title="TOTAL PUBLICATIONS" icon="" customStyle="text-5xl font-bold text-red-600 mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[var(--background)] p-8 rounded-xl shadow-xl hover:shadow-2xl text-center group hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <CustomCountUp value={(years.length > 0 ? parseInt(years[0]) - parseInt(years[years.length - 1]) + 1 : 0).toString()} title="YEARS OF RESEARCH" icon="" customStyle="text-5xl font-bold text-green-600 mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-[var(--background)] p-8 rounded-xl shadow-xl hover:shadow-2xl text-center group hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 transition-colors duration-300">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <CustomCountUp value={authors.length.toString()} title="UNIQUE AUTHORS" icon="" customStyle="text-5xl font-bold text-yellow-600 mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-[var(--background)] p-8 rounded-xl shadow-xl hover:shadow-2xl text-center group hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <Filter className="w-8 h-8 text-orange-600" />
              </div>
              <CustomCountUp value={venues.length.toString()} title="PUBLICATION VENUES" icon="" customStyle="text-5xl font-bold text-orange-600 mb-3" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Research Modal */}
      <AnimatePresence mode="wait">
        {openDialogId !== null && (
          <ResearchModal
            paper={filteredPapers[openDialogId]}
            isOpen={openDialogId !== null}
            onClose={() => setOpenDialogId(null)}
            setSelectedVenues={setSelectedVenues}
            setSelectedAuthors={setSelectedAuthors}
            setIsFilterOpen={setIsFilterOpen}
          />
        )}
      </AnimatePresence>

      {/* Papers Grid */}
      <section id="papers-section" className="max-w-7xl mx-auto py-12 px-4">
        {filteredPapers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-lg text-gray-600">No papers match your search criteria</p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {currentPapers.map((paper, index) => (
                  <motion.div
                    key={`${paper.title}-${index}-${currentPage}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.3,
                      delay: index % 12 * 0.03,
                      ease: "easeOut"
                    }}
                    whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                    className="bg-[var(--background)] rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all duration-200"
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--info-color)]/10 text-[var(--info-color)]">
                          {paper.venue.length > 30 ? paper.venue.substring(0, 30) + "..." : paper.venue}
                        </span>
                        <span className="inline-flex items-center text-secondary bg-[var(--background-secondary)]/30 px-2 py-0.5 rounded-md">
                          <Calendar className="w-3 h-3 mr-1" />
                          {paper.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text mb-3 line-clamp-2 group-hover:text-[var(--primary-color)] transition-colors">
                        {paper.title}
                      </h3>

                      {/* Authors */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {paper.authors.slice(0, 3).map((author, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--background-secondary)]/40 text-secondary hover:bg-[var(--background-secondary)]/60 transition-colors"
                          >
                            {author}
                          </span>
                        ))}
                        {paper.authors.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--background-secondary)]/30 text-tertiary">
                            +{paper.authors.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-6 mt-auto">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setOpenDialogId(indexOfFirstPaper + index)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-[var(--border-color)] text-sm font-medium rounded-md text-text bg-[var(--background)] hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-all duration-200"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </button>
                        <a
                          href={paper.url || `https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-all duration-200"
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          View PDF
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center">
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPage === 1
                        ? 'text-gray-500 bg-[var(--background)] cursor-not-allowed'
                        : 'text-[var(--text-color)] bg-[var(--background)] hover:bg-[var(--accent-color)] hover:text-white'
                      }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="ml-1">Previous</span>
                  </button>

                  {/* First page shortcut */}
                  {getPaginationRange()[0] > 1 && (
                    <>
                      <button
                        onClick={() => paginate(1)}
                        className={"relative inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-all duration-200 text-[var(--text-color)] bg-[var(--background)] hover:bg-[var(--accent-color)]"}
                      >
                        1
                      </button>
                      {getPaginationRange()[0] > 2 && (
                        <span className="mx-1 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Numbered pages */}
                  {getPaginationRange().map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-all duration-200 ${currentPage === number
                          ? 'z-10 text-white bg-[var(--accent-color)]'
                          : 'text-[var(--text-color)] bg-[var(--background)] hover:bg-[var(--accent-color)] hover:text-white'
                        }`}
                    >
                      {number}
                    </button>
                  ))}

                  {/* Last page shortcut */}
                  {getPaginationRange()[getPaginationRange().length - 1] < totalPages && (
                    <>
                      {getPaginationRange()[getPaginationRange().length - 1] < totalPages - 1 && (
                        <span className="mx-1 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => paginate(totalPages)}
                        className={"relative inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-all duration-200 text-[var(--text-color)] bg-[var(--background)] hover:bg-[var(--accent-color)]"}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                        ? 'text-gray-500 bg-[var(--background)] cursor-not-allowed'
                        : 'text-[var(--text-color)] bg-[var(--background)] hover:bg-[var(--accent-color)] hover:text-white'
                      }`}
                  >
                    <span className="mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Showing <span className="font-medium">{indexOfFirstPaper + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastPaper, filteredPapers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredPapers.length}</span> results
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: 'green',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'red',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
}