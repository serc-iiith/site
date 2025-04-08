import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, Calendar, Link as LinkIcon, Copy, Bookmark, ExternalLink, Github, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ExternalResource {
  name: string;
  url: string;
  type?: 'github' | 'linkedin' | 'url';
  label?: string;
}

interface Paper {
  id: string;
  title: string;
  authors: string[]; // Authors as string array
  venue: string;
  year: string;
  doi?: string;
  url?: string;
  cite?: string;
  externalResources?: ExternalResource[];
}

interface ResearchModalProps {
  paper: Paper;
  isOpen: boolean;
  onClose: () => void;
  setSelectedVenues: (venues: string[]) => void;
  setSelectedAuthors: (authors: string[]) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
}

// Helper function for gradient colors
const getGradientForTitle = (title: string): string => {
  const hash = title.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(hash) % 360;
  return `bg-gradient-to-r from-[hsl(${hue},70%,60%)] to-[hsl(${(hue + 40) % 360},70%,60%)]`;
};

// Helper function to get the appropriate icon for a resource type
const getResourceIcon = (type?: string) => {
  switch(type?.toLowerCase()) {
    case 'github':
      return <Github className="h-4 w-4" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

const ResearchModal: React.FC<ResearchModalProps> = ({
  paper,
  isOpen,
  onClose,
  setSelectedVenues,
  setSelectedAuthors,
  setIsFilterOpen
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-black/40 dark:bg-black/60 flex items-start justify-center p-2 sm:p-4 sm:pt-24"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-[color:var(--foreground)] text-[color:var(--text-color)] backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[90vh] overflow-y-auto mt-16 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${getGradientForTitle(paper.title)} h-3 w-full sticky top-0 z-10`} />
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <span
              className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[color:var(--primary-color)] text-white bg-opacity-15 backdrop-blur-sm line-clamp-1 max-w-[70%] cursor-pointer hover:bg-opacity-25"
              onClick={() => {
                setSelectedVenues([paper.venue]);
                onClose();
                setIsFilterOpen(true);
              }}
            >
              {paper.venue}
            </span>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="text-[color:var(--text-color)] bg-[color:var(--hover-bg)] backdrop-blur-sm p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 leading-tight text-[color:var(--text-color)]">
            {paper.title}
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[color:var(--foreground)] backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-[color:var(--border-color)] shadow-sm">
              <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center text-[color:var(--secondary-color)]">
                <Users className="w-4 h-4 mr-2 text-[color:var(--primary-color)]" />
                Authors
              </h3>
              <div className="flex flex-wrap gap-2">
                {paper.authors.map((author, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[color:var(--primary-color)] bg-[color:var(--background)] bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors border border-[color:var(--primary-color)] border-opacity-20"
                    onClick={() => {
                      setSelectedAuthors([author]);
                      onClose();
                      setIsFilterOpen(true);
                    }}
                  >
                    {author}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[color:var(--foreground)] backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-[color:var(--border-color)] shadow-sm">
                <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center text-[color:var(--secondary-color)]">
                  <Calendar className="w-4 h-4 mr-2 text-[color:var(--success-color)]" />
                  Publication Year
                </h3>
                <div className="flex items-center bg-[color:var(--background)] rounded-lg p-2 border border-[color:var(--border-color)]">
                  {paper.year}
                </div>
              </div>
              <div className="bg-[color:var(--foreground)] backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-[color:var(--border-color)] shadow-sm">
                <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center text-[color:var(--secondary-color)]">
                  <LinkIcon className="h-4 w-4 mr-2 text-[color:var(--warning-color)]" />
                  Digital Object Identifier (DOI)
                </h3>
                <div className="flex items-center bg-[color:var(--background)] rounded-lg p-2 border border-[color:var(--border-color)]">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--primary-color)] hover:underline font-mono text-xs sm:text-sm truncate mr-2 flex-1"
                  >
                    {paper.doi || "N/A"}
                  </a>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (paper.doi) {
                        navigator.clipboard.writeText(paper.doi);
                        toast.success("DOI copied to clipboard!");
                      }
                    }}
                    className="text-[color:var(--text-color)] bg-[color:var(--background)] p-1.5 rounded-lg shadow-sm border border-[color:var(--border-color)]"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* External Resources Section */}
            {paper.externalResources && paper.externalResources.length > 0 && (
              <div className="bg-[color:var(--foreground)] backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-[color:var(--border-color)] shadow-sm">
                <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center text-[color:var(--secondary-color)]">
                  <ExternalLink className="w-4 h-4 mr-2 text-[color:var(--info-color)]" />
                  External Resources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {paper.externalResources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-3 py-1.5 bg-[color:var(--background)] text-[color:var(--text-color)] rounded-lg hover:bg-opacity-75 transition-colors border border-[color:var(--border-color)]"
                      title={resource.label || resource.name}
                    >
                      {getResourceIcon(resource.type)}
                      {resource.label ? (
                        <span className="ml-2 text-sm">{resource.label}</span>
                      ) : (
                        <span className="ml-2 text-sm">{resource.name}</span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {paper.cite && (
              <div className="bg-[color:var(--foreground)] backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-[color:var(--border-color)] shadow-sm">
                <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center text-[color:var(--secondary-color)]">
                  <Bookmark className="w-4 h-4 mr-2 text-[color:var(--primary-color)]" />
                  Citation
                </h3>
                <div className="relative">
                  <div className="bg-[color:var(--background)] p-3 sm:p-4 rounded-lg border border-[color:var(--border-color)] text-xs sm:text-sm font-mono text-[color:var(--text-color)] max-h-32 sm:max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{paper.cite}</pre>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(paper.cite);
                      toast.success("Citation copied to clipboard!");
                    }}
                    className="absolute top-2 right-2 text-[color:var(--text-color)] bg-[color:var(--background)] p-1.5 rounded-lg shadow-sm border border-[color:var(--border-color)]"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-[color:var(--border-color)] text-[color:var(--text-color)] rounded-lg shadow-sm hover:bg-[color:var(--hover-bg)]"
            >
              Close
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={paper.url || `https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2 text-white rounded-lg shadow-md flex items-center justify-center"
              style={{ background: 'linear-gradient(to right, var(--primary-color), var(--info-color))' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Publication
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResearchModal;