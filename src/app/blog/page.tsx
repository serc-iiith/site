"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronDown,
  Eye,
  Search,
  Filter,
  X,
  BookOpen,
} from "lucide-react";

// Import blog data
import blogData from "../../../public/data/blogs.json";

// Define types for blog data
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  role?: string;
  date: string;
  readTime: number;
  category: string;
  coverImage: string;
}

// Helper function to generate author image URL from name
const getAuthorImageUrl = (authorName: string): string => {
  // Remove 'Dr.' prefix if present
  const cleanName = authorName.replace(/^Dr\.\s+/, "");

  // Convert to lowercase and replace spaces with hyphens
  const formattedName = cleanName.toLowerCase().replace(/\s+/g, "-");

  return `/images/people/${formattedName}.png`;
};

// Category color mapping
const categoryColors: Record<string, string> = {
  "Virtual Labs": "bg-[color:var(--primary-color)]",
  "ML-Enabled Systems": "bg-[color:var(--success-color)]",
  "VR/XR Systems": "bg-[color:var(--info-color)]",
  IoT: "bg-[color:var(--accent-color)]",
  "Design & Technology": "bg-[color:var(--accent-color)]",
  "Software Quality": "bg-[color:var(--error-color)]",
  "Programming Languages": "bg-[color:var(--success-color)]",
  "Formal Methods": "bg-[color:var(--info-color)]",
  "Software Analytics": "bg-[color:var(--accent-color)]",
  "Self-Adaptive Systems": "bg-[color:var(--primary-color)]",
  "Software Engineering": "bg-[color:var(--warning-color)]",
  "Software Sustainability": "bg-[color:var(--success-color)]",
  "AI in SE": "bg-[color:var(--error-color)]",
  DevOps: "bg-[color:var(--primary-color)]",
  "SE Trends": "bg-[color:var(--success-color)]",
  "Open Source": "bg-[color:var(--info-color)]",
};

// Components for page transitions and animations
const PageTransition = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Category Badge Component
const CategoryBadge = ({ category }: { category: string }): JSX.Element => {
  const categoryColor =
    categoryColors[category] || "bg-[color:var(--tertiary-color)]";

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${categoryColor} inline-flex items-center`}
    >
      {category}
    </span>
  );
};

// Blog post card component
const BlogCard = ({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}): JSX.Element => {
  // Generate author image URL from name and get category color
  const authorImageUrl = getAuthorImageUrl(post.author);
  const cleanName = post.author.replace(/^Dr\.\s+/, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="bg-[color:var(--background)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]/40 cursor-pointer group">
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={post.coverImage || "/images/blog_fallback.png"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <CategoryBadge category={post.category} />
            </div>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <div className="flex items-center justify-between text-sm text-[color:var(--tertiary-color)] mb-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-[color:var(--text-color)] group-hover:text-[color:var(--primary-color)] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-[color:var(--secondary-color)] mb-5 line-clamp-3 text-sm">
              {post.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[color:var(--background)] shadow-sm">
                  <Image
                    src={authorImageUrl}
                    alt={post.author}
                    width={16}
                    height={16}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement?.classList.add(
                        "bg-gradient-to-br",
                        "from-[color:var(--primary-color)]",
                        "to-[color:var(--info-color)]",
                        "flex",
                        "items-center",
                        "justify-center"
                      );

                      if (!target.nextElementSibling) {
                        const span = document.createElement("span");
                        span.className = "text-xl font-bold text-white";
                        span.textContent = cleanName
                          .split(" ")
                          .map((word) => word[0])
                          .join("");
                        target.parentElement?.appendChild(span);
                      }
                    }}
                  />
                </div>
                <span className="ml-2 text-sm text-[color:var(--secondary-color)] font-medium">
                  {post.author}
                </span>
              </div>

              <span className="text-[color:var(--tertiary-color)] font-medium text-sm flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {Math.floor(Math.random() * 1000)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Featured blog post component
const FeaturedBlogPost = ({ post }: { post: BlogPost }): JSX.Element => {
  // Generate author image URL from name
  const authorImageUrl = getAuthorImageUrl(post.author);
  const cleanName = post.author.replace(/^Dr\.\s+/, "");

  return (
    <div className="relative pl-4 md:pl-10 pt-10">
      {/* Pattern background with offset */}
      <div className="absolute top-0 right-0 w-full h-full rounded-2xl transform -translate-y-12 translate-x-12 md:translate-x-20 md:-translate-y-10 z-0 pt-16 md:pt-10 md:pr-10">
        <div
          className="w-full h-full"
          ref={(el) => {
            if (el) {
              const accentColor = getComputedStyle(document.documentElement)
                .getPropertyValue("--accent-color")
                .trim();

              el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodeURIComponent(
                accentColor
              )}' stroke-opacity='0.15' stroke-width='1'%3E%3Cpath d='M0 0 L60 0 L60 60 L0 60 Z'/%3E%3Cpath d='M15 0 L15 60'/%3E%3Cpath d='M30 0 L30 60'/%3E%3Cpath d='M45 0 L45 60'/%3E%3Cpath d='M0 15 L60 15'/%3E%3Cpath d='M0 30 L60 30'/%3E%3Cpath d='M0 45 L60 45'/%3E%3C/g%3E%3C/svg%3E")`;
            }
          }}
        ></div>
      </div>

      <Link href={`/blog/${post.slug}`} className="block group relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl"
        >
          {/* Animated gradient border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[color:var(--primary-color)] via-[color:var(--accent-color)] to-[color:var(--info-color)] opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-black">
            <Image
              src={post.coverImage || "/images/blog_fallback.png"}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
              <div className="mb-4">
                <CategoryBadge category={post.category} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-5 leading-tight">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-200 mb-5 sm:mb-8 max-w-3xl leading-relaxed line-clamp-2 sm:line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between flex-wrap">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow">
                    <Image
                      src={authorImageUrl}
                      alt={post.author}
                      className="object-cover"
                      width={100}
                      height={100}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement?.classList.add(
                          "bg-gradient-to-br",
                          "from-[color:var(--primary-color)]",
                          "to-[color:var(--info-color)]",
                          "flex",
                          "items-center",
                          "justify-center"
                        );

                        if (!target.nextElementSibling) {
                          const span = document.createElement("span");
                          span.className = "text-2xl font-bold text-white";
                          span.textContent = cleanName
                            .split(" ")
                            .map((word) => word[0])
                            .join("");
                          target.parentElement?.appendChild(span);
                        }
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">{post.author}</div>
                    <div className="text-gray-300 text-sm">
                      {post.role || "Contributor"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Calendar className="w-4 h-4 mr-1" />
                  <time dateTime={post.date}>{post.date}</time>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </div>

                <div className="hidden md:flex items-center bg-[color:var(--primary-color)] text-white py-2 px-4 rounded-lg group-hover:px-5 transition-all duration-300">
                  <span className="mr-2">Read Article</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element => {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-1 mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? "text-[color:var(--tertiary-color)] cursor-not-allowed"
            : "text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
        }`}
        aria-label="Previous page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-[color:var(--primary-color)] text-white"
                : "text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
            }`}
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 text-[color:var(--tertiary-color)]">...</span>
          )}
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded-md ${
            currentPage === pageNumber
              ? "bg-[color:var(--primary-color)] text-white"
              : "text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-[color:var(--tertiary-color)]">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-[color:var(--primary-color)] text-white"
                : "text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? "text-[color:var(--tertiary-color)] cursor-not-allowed"
            : "text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
        }`}
        aria-label="Next page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default function BlogPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [searchAuthor, setSearchAuthor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  // Load blog data from JSON file
  useEffect(() => {
    setBlogPosts(blogData as BlogPost[]);
  }, []);

  // Get unique categories for filter
  const categories = [
    "All",
    ...Array.from(new Set(blogPosts.map((post) => post.category))),
  ].sort();

  // Get unique authors for filter
  const authors = [
    ...Array.from(new Set(blogPosts.map((post) => post.author))),
  ].sort();

  // Reset all filters
  const resetFilters = (): void => {
    setSelectedCategory("All");
    setSelectedCategories([]);
    setSelectedAuthors([]);
    setSearchCategory("");
    setSearchAuthor("");
  };

  // Count active filters
  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    selectedCategories.length +
    selectedAuthors.length;

  // Filter posts based on search term, category, and authors
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      post.category === selectedCategory ||
      (selectedCategories.length > 0 &&
        selectedCategories.includes(post.category));

    const matchesAuthor =
      selectedAuthors.length === 0 || selectedAuthors.includes(post.author);

    return matchesSearch && matchesCategory && matchesAuthor;
  });

  // Helper function to parse dates (assuming format "Month DD, YYYY")
  const parseDate = (dateString: string): Date => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date(0) : date; // Return Jan 1, 1970 if invalid
  };

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );

  // Use the most recent post as the featured post
  const featuredPost = sortedPosts.length > 0 ? sortedPosts[0] : null;

  // All posts except the featured one (when showing all)
  const regularPosts =
    searchTerm || activeFilterCount > 0 ? sortedPosts : sortedPosts.slice(1); // Skip the featured post

  // Calculate total pages for pagination
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  // Get current posts based on pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCategories, selectedAuthors]);

  return (
    <div className="min-h-screen bg-[color:var(--foreground)] overflow-x-hidden">
      <PageTransition>
        {/* Hero Section with Header */}
        <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--primary-color)]/10 to-transparent z-[-1]"></div>

          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 md:mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4 md:mb-6">
                User Stories
              </h1>
              <p className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto px-4">
                Explore fantastic stories from our community of researchers,
                developers, and students.
              </p>
            </motion.div>

            {/* Search Bar & Filter UI from provided code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 max-w-3xl mx-auto bg-[color:var(--background)] shadow-md rounded-full flex items-center p-2 z-50"
            >
              <Search className="w-5 h-5 text-[color:var(--secondary-color)] ml-4" />
              <input
                type="text"
                placeholder="Search blogs by title, author, or content..."
                className="w-full py-3 px-4 bg-transparent text-[color:var(--text-color)] placeholder-[color:var(--tertiary-color)] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`
                  flex items-center space-x-1 px-4 py-2.5 rounded-full transition-all duration-200 ml-2
                  ${
                    isFilterOpen
                      ? "bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] text-white shadow-lg"
                      : "bg-[color:var(--hover-bg)] hover:bg-opacity-50 text-[color:var(--text-color)]"
                  }
                  ${
                    activeFilterCount > 0
                      ? "bg-[color:var(--primary-color)]"
                      : ""
                  }
                `}
                aria-expanded={isFilterOpen}
              >
                <Filter
                  className={`w-4 h-4 ${
                    isFilterOpen
                      ? "text-white"
                      : "text-[color:var(--text-color)]"
                  }`}
                />
                {activeFilterCount > 0 ? (
                  <span className="text-sm font-medium">Filters</span>
                ) : (
                  <span className="text-sm font-medium hidden sm:inline">
                    Filter
                  </span>
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
                  className="max-w-3xl mx-auto mt-6 bg-[color:var(--background)] rounded-lg shadow-lg border border-[color:var(--border-color)] overflow-hidden z-40 relative"
                >
                  <div className="bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] h-1 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-[color:var(--text-color)]">
                        Filter Articles
                      </h3>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-[color:var(--secondary-color)] hover:text-[color:var(--text-color)] p-1 rounded-full hover:bg-[color:var(--hover-bg)]"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Category Filter */}
                      <div>
                        <h4 className="text-sm font-medium text-[color:var(--secondary-color)] mb-2 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-[color:var(--info-color)]" />
                          Article Categories
                          {selectedCategories.length > 0 && (
                            <span className="ml-2 text-xs text-white bg-[color:var(--info-color)] bg-opacity-10 px-2 py-0.5 rounded-full">
                              {selectedCategories.length} selected
                            </span>
                          )}
                        </h4>
                        <div className="bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-lg shadow-sm overflow-hidden mb-2">
                          <div className="flex items-center px-3 py-2 bg-[color:var(--foreground)] border-b border-[color:var(--border-color)]">
                            <Search className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                            <input
                              type="text"
                              placeholder="Search categories..."
                              className="block w-full pl-2 pr-3 py-1 border-0 bg-transparent focus:outline-none text-sm text-[color:var(--text-color)]"
                              value={searchCategory}
                              onChange={(e) =>
                                setSearchCategory(e.target.value)
                              }
                            />
                            <button
                              onClick={() => {
                                const categoryContainer =
                                  document.getElementById(
                                    "categories-container"
                                  );
                                if (categoryContainer) {
                                  categoryContainer.classList.toggle(
                                    "max-h-16"
                                  );
                                  categoryContainer.classList.toggle(
                                    "max-h-96"
                                  );
                                }
                              }}
                              className="ml-2 p-1 rounded hover:bg-[color:var(--hover-bg)]"
                              title="Expand/Collapse"
                            >
                              <ChevronDown className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                            </button>
                          </div>
                          <div
                            id="categories-container"
                            className="max-h-16 overflow-y-auto p-2 transition-all duration-300"
                          >
                            <div className="flex flex-wrap gap-2">
                              {categories
                                .filter((category) => category !== "All")
                                .filter(
                                  (category) =>
                                    !searchCategory ||
                                    category
                                      .toLowerCase()
                                      .includes(searchCategory.toLowerCase())
                                )
                                .map((category) => (
                                  <button
                                    key={category}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                      selectedCategories.includes(category)
                                        ? "bg-[color:var(--info-color)] text-white"
                                        : "bg-[color:var(--hover-bg)] text-[color:var(--text-color)] hover:bg-opacity-50"
                                    }`}
                                    onClick={() => {
                                      if (
                                        selectedCategories.includes(category)
                                      ) {
                                        setSelectedCategories(
                                          selectedCategories.filter(
                                            (c) => c !== category
                                          )
                                        );
                                      } else {
                                        setSelectedCategories([
                                          ...selectedCategories,
                                          category,
                                        ]);
                                      }
                                    }}
                                  >
                                    {category.length > 30
                                      ? category.substring(0, 30) + "..."
                                      : category}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                        {selectedCategories.length > 0 && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-[color:var(--tertiary-color)]">
                              {selectedCategories.length === 1
                                ? "1 category selected"
                                : `${selectedCategories.length} categories selected`}
                            </span>
                            <button
                              onClick={() => setSelectedCategories([])}
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2 text-[color:var(--success-color)]"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
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
                              value={searchAuthor}
                              onChange={(e) => setSearchAuthor(e.target.value)}
                            />
                            <button
                              onClick={() => {
                                const authorsContainer =
                                  document.getElementById("authors-container");
                                if (authorsContainer) {
                                  authorsContainer.classList.toggle("max-h-16");
                                  authorsContainer.classList.toggle("max-h-96");
                                }
                              }}
                              className="ml-2 p-1 rounded hover:bg-[color:var(--hover-bg)]"
                              title="Expand/Collapse"
                            >
                              <ChevronDown className="h-4 w-4 text-[color:var(--tertiary-color)]" />
                            </button>
                          </div>
                          <div
                            id="authors-container"
                            className="max-h-16 overflow-y-auto p-2 transition-all duration-300"
                          >
                            <div className="flex flex-wrap gap-2">
                              {authors
                                .filter(
                                  (author) =>
                                    !searchAuthor ||
                                    author
                                      .toLowerCase()
                                      .includes(searchAuthor.toLowerCase())
                                )
                                .map((author) => (
                                  <button
                                    key={author}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                      selectedAuthors.includes(author)
                                        ? "bg-[color:var(--success-color)] text-white"
                                        : "bg-[color:var(--hover-bg)] text-[color:var(--text-color)] hover:bg-opacity-50"
                                    }`}
                                    onClick={() => {
                                      if (selectedAuthors.includes(author)) {
                                        setSelectedAuthors(
                                          selectedAuthors.filter(
                                            (a) => a !== author
                                          )
                                        );
                                      } else {
                                        setSelectedAuthors([
                                          ...selectedAuthors,
                                          author,
                                        ]);
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
                                ? "1 author selected"
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
        </section>

        {/* Featured Post Section - Show most recent post */}
        {featuredPost && activeFilterCount === 0 && !searchTerm && (
          <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)] flex items-center">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[color:var(--primary-color)] rounded-full flex items-center justify-center mr-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </span>
                  Featured Article
                </h2>
              </motion.div>

              <FeaturedBlogPost post={featuredPost} />
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text-color)]">
                {searchTerm || activeFilterCount > 0
                  ? `${filteredPosts.length} ${
                      filteredPosts.length === 1 ? "Result" : "Results"
                    }`
                  : "Latest Articles"}
              </h2>

              {filteredPosts.length > 0 && (
                <div className="text-sm text-[color:var(--tertiary-color)]">
                  Showing {Math.min(currentPosts.length, postsPerPage)} of{" "}
                  {regularPosts.length} articles
                </div>
              )}
            </motion.div>

            {currentPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {currentPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 md:py-20 bg-[color:var(--background)] rounded-2xl shadow-sm border border-[color:var(--border-color)]"
              >
                <div className="text-5xl sm:text-6xl mb-4">
                  <svg
                    className="mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-[color:var(--text-color)] mb-3">
                  No articles found
                </h3>
                <p className="text-[color:var(--secondary-color)] max-w-lg mx-auto mb-6 px-4">
                  We couldn't find any articles matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <button
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition-colors shadow-md"
                  onClick={() => {
                    setSearchTerm("");
                    resetFilters();
                  }}
                >
                  Reset filters
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {regularPosts.length > postsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            )}
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
