import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, BookOpen, Users, ChevronDown } from 'lucide-react';

interface SearchFilterBarProps {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filter panel state
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;

  // Year filter
  years: string[];
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;

  // Venue filter
  venues: string[];
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  searchVenue: string;
  setSearchVenue: (venue: string) => void;

  // Author filter
  authors: string[];
  selectedAuthors: string[];
  setSelectedAuthors: (authors: string[]) => void;
  searchAuthor: string;
  setSearchAuthor: (author: string) => void;

  // Reset function
  resetFilters: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  years,
  selectedYear,
  setSelectedYear,
  venues,
  selectedVenues,
  setSelectedVenues,
  searchVenue,
  setSearchVenue,
  authors,
  selectedAuthors,
  setSelectedAuthors,
  searchAuthor,
  setSearchAuthor,
  resetFilters
}) => {
  // Count active filters
  const activeFilterCount =
    (selectedYear ? 1 : 0) +
    selectedVenues.length +
    selectedAuthors.length;

  return (
    <div className="max-w-7xl mx-auto relative text-[color:var(--text-color)] mb-6 text-xs sm:text-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 max-w-3xl mx-auto bg-[color:var(--background)] shadow-md rounded-full flex items-center p-2"
      >
        <Search className="w-5 h-5 text-[color:var(--secondary-color)] ml-4" />
        <input
          type="text"
          placeholder="Search papers by title, author, or venue..."
          className="w-full py-3 px-4 bg-transparent text-[color:var(--text-color)] placeholder-[color:var(--tertiary-color)] focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`
            flex items-center space-x-1 px-4 py-2.5 rounded-full transition-all duration-200 ml-2
            ${isFilterOpen
              ? 'bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] text-white shadow-lg'
              : 'bg-[color:var(--hover-bg)] hover:bg-opacity-50 text-[color:var(--text-color)]'
            }
            ${activeFilterCount > 0
              ? 'bg-[color:var(--primary-color)]'
              : ''
            }
          `}
          aria-expanded={isFilterOpen}
        >
          <Filter className={`w-4 h-4 ${isFilterOpen ? 'text-white' : 'text-[color:var(--text-color)]'}`} />
          {activeFilterCount > 0 ? (
            <span className="text-sm font-medium">Filters</span>
          ) : (
            <span className="text-sm font-medium hidden sm:inline">Filter</span>
          )}
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center bg-white text-[color:var(--primary-color)] rounded-full h-5 w-5 text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* Filter Dropdown Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto mt-6 bg-[color:var(--background)] rounded-lg shadow-lg border border-[color:var(--border-color)] overflow-hidden z-30 relative"
          >
            <div className="bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] h-1 w-full"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[color:var(--text-color)]">
                  Filter Publications
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-[color:var(--secondary-color)] hover:text-[color:var(--text-color)] p-1 rounded-full hover:bg-[color:var(--hover-bg)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Year Range Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[color:var(--secondary-color)] mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[color:var(--primary-color)]" />
                    Publication Year Range
                  </h4>

                  {years.length > 0 && (
                    <>
                      <div className="relative pt-5 pb-2"></div>
                      <div
                        className="h-1 w-full bg-[color:var(--border-color)] rounded-full relative"
                        id="year-slider-track"
                      >
                        <div
                          className="absolute h-1 bg-[color:var(--primary-color)] rounded-full"
                          style={{
                            left: `${((parseInt(selectedYear?.split('-')[0] || years[years.length - 1]) - parseInt(years[years.length - 1])) / (parseInt(years[0]) - parseInt(years[years.length - 1]))) * 100}%`,
                            right: `${100 - ((parseInt(selectedYear?.split('-')[1] || years[0]) - parseInt(years[years.length - 1])) / (parseInt(years[0]) - parseInt(years[years.length - 1])) * 100)}%`
                          }}
                        />

                        {/* Thumb 1 - Min Year */}
                        <div
                          className="absolute h-5 w-5 bg-[color:var(--background)] rounded-full shadow border-2 border-[color:var(--primary-color)] -mt-5 cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            left: `calc(${((parseInt(selectedYear?.split('-')[0] || years[years.length - 1]) - parseInt(years[years.length - 1])) / (parseInt(years[0]) - parseInt(years[years.length - 1]))) * 100}% - 10px)`,
                            top: '12px'
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const slider = document.getElementById('year-slider-track');
                            const rect = slider?.getBoundingClientRect();

                            const startDrag = (e: MouseEvent) => {
                              if (rect) {
                                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                const yearIndex = Math.floor(percent * (years.length - 1));
                                const minYear = years[years.length - 1 - yearIndex];
                                const maxYear = selectedYear?.split('-')[1] || years[0];
                                if (parseInt(minYear) <= parseInt(maxYear)) {
                                  setSelectedYear(`${minYear}-${maxYear}`);
                                }
                              }
                            };

                            const stopDrag = () => {
                              window.removeEventListener('mousemove', startDrag);
                              window.removeEventListener('mouseup', stopDrag);
                            };

                            window.addEventListener('mousemove', startDrag);
                            window.addEventListener('mouseup', stopDrag);
                          }}
                        />

                        {/* Thumb 2 - Max Year */}
                        <div
                          className="absolute h-5 w-5 bg-[color:var(--background)] rounded-full shadow border-2 border-[color:var(--primary-color)] -mt-5 cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            right: `calc(${100 - ((parseInt(selectedYear?.split('-')[1] || years[0]) - parseInt(years[years.length - 1])) / (parseInt(years[0]) - parseInt(years[years.length - 1]))) * 100}% - 10px)`,
                            top: '12px'
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const slider = document.getElementById('year-slider-track');
                            const rect = slider?.getBoundingClientRect();

                            const startDrag = (e: MouseEvent) => {
                              if (rect) {
                                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                const yearIndex = years.length - 1 - Math.floor(percent * (years.length - 1));
                                const maxYear = years[yearIndex];
                                const minYear = selectedYear?.split('-')[0] || years[years.length - 1];
                                if (parseInt(maxYear) >= parseInt(minYear)) {
                                  setSelectedYear(`${minYear}-${maxYear}`);
                                }
                              }
                            };

                            const stopDrag = () => {
                              window.removeEventListener('mousemove', startDrag);
                              window.removeEventListener('mouseup', stopDrag);
                            };

                            window.addEventListener('mousemove', startDrag);
                            window.addEventListener('mouseup', stopDrag);
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-sm text-[color:var(--secondary-color)] px-1 mt-2">
                        <span>
                          {selectedYear
                            ? selectedYear.split('-')[0]
                            : years[years.length - 1]}
                        </span>
                        <span>
                          {selectedYear
                            ? selectedYear.split('-')[1]
                            : years[0]}
                        </span>
                      </div>

                      {selectedYear && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => setSelectedYear(null)}
                            className="text-xs text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] flex items-center"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reset Year Range
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Venue Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[color:var(--secondary-color)] mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-[color:var(--info-color)]" />
                    Publication Venues
                    {selectedVenues.length > 0 && (
                      <span className="ml-2 text-xs text-white bg-[color:var(--info-color)] bg-opacity-10 px-2 py-0.5 rounded-full">
                        {selectedVenues.length} selected
                      </span>
                    )}
                  </h4>
                  <div className="bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-lg shadow-sm overflow-hidden mb-2">
                    <div className="flex items-center px-3 py-2 bg-[color:var(--foreground)] border-b border-[color:var(--border-color)]">
                      <Search className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                      <input
                        type="text"
                        placeholder="Search venues..."
                        className="block w-full pl-2 pr-3 py-1 border-0 bg-transparent focus:outline-none text-sm text-[color:var(--text-color)]"
                        value={searchVenue || ""}
                        onChange={e => setSearchVenue(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          const venueContainer = document.getElementById('venues-container');
                          if (venueContainer) {
                            venueContainer.classList.toggle('max-h-16');
                            venueContainer.classList.toggle('max-h-96');
                          }
                        }}
                        className="ml-2 p-1 rounded hover:bg-[color:var(--hover-bg)]"
                        title="Expand/Collapse"
                      >
                        <ChevronDown className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                      </button>
                    </div>
                    <div id="venues-container" className="max-h-16 overflow-y-auto p-2 transition-all duration-300">
                      <div className="flex flex-wrap gap-2">
                        {venues
                          .sort((a, b) => a.localeCompare(b))
                          .filter(venue => !searchVenue || venue.toLowerCase().includes((searchVenue || "").toLowerCase()))
                          .map(venue => (
                            <button
                              key={venue}
                              className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedVenues.includes(venue)
                                ? 'bg-[color:var(--info-color)] text-white'
                                : 'bg-[color:var(--hover-bg)] text-[color:var(--text-color)] hover:bg-opacity-50'
                                }`}
                              onClick={() => {
                                if (selectedVenues.includes(venue)) {
                                  setSelectedVenues(selectedVenues.filter(v => v !== venue));
                                } else {
                                  setSelectedVenues([...selectedVenues, venue]);
                                }
                              }}
                            >
                              {venue.length > 30 ? venue.substring(0, 30) + '...' : venue}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  {selectedVenues.length > 0 && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-[color:var(--tertiary-color)]">
                        {selectedVenues.length === 1
                          ? '1 venue selected'
                          : `${selectedVenues.length} venues selected`}
                      </span>
                      <button
                        onClick={() => setSelectedVenues([])}
                        className="text-xs text-[color:var(--info-color)] hover:text-[color:var(--primary-color)] flex items-center"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear selection
                      </button>
                    </div>
                  )}
                </div>

                {/* Author Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[color:var(--secondary-color)] mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-[color:var(--success-color)]" />
                    Authors
                    {selectedAuthors.length > 0 && (
                      <span className="ml-2 text-xs text-white bg-[color:var(--success-color)] bg-opacity-10 px-2 py-0.5 rounded-full">
                        {selectedAuthors.length} selected
                      </span>
                    )}
                  </h4>
                  <div className="bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-lg shadow-sm overflow-hidden mb-2">
                    <div className="flex items-center px-3 py-2 bg-[color:var(--foreground)] border-b border-[color:var(--border-color)]">
                      <Search className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                      <input
                        type="text"
                        placeholder="Search authors..."
                        className="block w-full pl-2 pr-3 py-1 border-0 bg-transparent focus:outline-none text-sm text-[color:var(--text-color)]"
                        value={searchAuthor || ""}
                        onChange={e => setSearchAuthor(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          const authorsContainer = document.getElementById('authors-container');
                          if (authorsContainer) {
                            authorsContainer.classList.toggle('max-h-16');
                            authorsContainer.classList.toggle('max-h-96');
                          }
                        }}
                        className="ml-2 p-1 rounded hover:bg-[color:var(--hover-bg)]"
                        title="Expand/Collapse"
                      >
                        <ChevronDown className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                      </button>
                    </div>
                    <div id="authors-container" className="max-h-16 overflow-y-auto p-2 transition-all duration-300">
                      <div className="flex flex-wrap gap-2">
                        {authors
                          .sort((a, b) => a.localeCompare(b))
                          .filter(author => !searchAuthor || author.toLowerCase().includes((searchAuthor || "").toLowerCase()))
                          .map(author => (
                            <button
                              key={author}
                              className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedAuthors.includes(author)
                                ? 'bg-[color:var(--success-color)] text-white'
                                : 'bg-[color:var(--hover-bg)] text-[color:var(--text-color)] hover:bg-opacity-50'
                                }`}
                              onClick={() => {
                                if (selectedAuthors.includes(author)) {
                                  setSelectedAuthors(selectedAuthors.filter(a => a !== author));
                                } else {
                                  setSelectedAuthors([...selectedAuthors, author]);
                                }
                              }}
                            >
                              {author}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                  {selectedAuthors.length > 0 && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-[color:var(--tertiary-color)]">
                        {selectedAuthors.length === 1
                          ? '1 author selected'
                          : `${selectedAuthors.length} authors selected`}
                      </span>
                      <button
                        onClick={() => setSelectedAuthors([])}
                        className="text-xs text-[color:var(--success-color)] hover:text-[color:var(--success-color)] flex items-center"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear selection
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-[color:var(--border-color)]">
                <button
                  type="button"
                  className="text-[color:var(--secondary-color)] hover:text-[color:var(--text-color)] text-sm flex items-center"
                  onClick={resetFilters}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset All
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-[color:var(--primary-color)] hover:opacity-90 text-white text-sm rounded-md shadow-sm transition-colors"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilterBar;