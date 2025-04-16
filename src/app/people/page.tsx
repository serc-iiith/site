"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import peopleData from "../../../public/data/people.json";
import {
  siGithub,
  siX,
  siInstagram,
  siGooglescholar,
} from "simple-icons/icons";
import { motion } from "framer-motion";

interface SocialLinks {
  [key: string]: string;
}

interface Person {
  name: string;
  title: string;
  email: string;
  social_links: SocialLinks;
  slug: string;
  imageURL: string;
}

interface PeopleData {
  [category: string]: Person[];
}

export default function PeoplePage() {
  // Default category is now "Overall" which will show all people
  const [activeCategory, setActiveCategory] = useState<string>("Overall");
  const categories = ["Overall", ...Object.keys(peopleData)];

  // Get all people across all categories
  const getAllPeople = () => {
    const allPeople: Person[] = [];
    Object.values(peopleData).forEach((categoryPeople) => {
      allPeople.push(...categoryPeople);
    });
    return allPeople;
  };

  // Get statistics about the team
  const getTeamStats = () => {
    const allPeople = getAllPeople();
    const stats = {
      total: allPeople.length,
      categories: Object.keys(peopleData).map((category) => ({
        name: category,
        count: (peopleData as PeopleData)[category].length,
      })),
    };
    return stats;
  };

  const stats = getTeamStats();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="text-[color:var(--text-color)] hover:text-[color:var(--secondary-color)] w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={siGithub.path} />
          </svg>
        );
      case "LinkedIn":
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="text-[#0A66C2] hover:text-[#084d8f] w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
          </svg>
        );
      case "Twitter":
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="text-[#000000] hover:text-[color:var(--secondary-color)] w-5 h-5 fill-current dark:text-white dark:hover:text-[color:var(--tertiary-color)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={siX.path} />
          </svg>
        );
      case "Google Scholar":
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={siGooglescholar.path} />
          </svg>
        );
      case "Instagram":
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="text-[#E4405F] hover:text-[#c9304d] w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={siInstagram.path} />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderPersonCard = (person: Person) => {
    const imagePath = person.imageURL;

    return (
      <div
        key={person.name}
        className="bg-[color:var(--background)] rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl border border-[color:var(--border-color)] group"
        onClick={(e) => {
          if (!e.defaultPrevented && !(e.target as Element).closest("a")) {
            window.location.href = `/people/${person.slug}`;
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="p-6">
          <div className="h-32 w-32 rounded-full mx-auto mb-4 overflow-hidden relative">
            <Image
              src={imagePath}
              alt={person.name}
              width={128}
              height={128}
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
                  span.className = "text-4xl font-bold text-white";
                  span.textContent = person.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("");
                  target.parentElement?.appendChild(span);
                }
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-center text-[color:var(--text-color)] mb-1 group-hover:text-[color:var(--primary-color)] transition-colors duration-200">
            {person.name}
          </h3>
          <p className="text-sm text-center text-[color:var(--secondary-color)] mb-2">
            {person.title}
          </p>
          {person.email && (
            <p className="text-xs text-center text-[color:var(--tertiary-color)] mb-3 truncate">
              <a
                href={`mailto:${person.email}`}
                className="hover:text-[color:var(--primary-color)]"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
              >
                {person.email}
              </a>
            </p>
          )}
          <div className="flex justify-center space-x-3 mt-4">
            {Object.entries(person.social_links || {}).map(
              ([platform, link]) => (
                <a
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-125 transition-transform"
                  title={platform}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                  }}
                >
                  {getSocialIcon(platform)}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 bg-[color:var(--foreground)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Our Team
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Meet the talented researchers and students driving innovation at our
            center
          </p>
        </motion.div>

        {/* Team Stats */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-4 sm:mt-8 mb-8 sm:mb-16 px-2 sm:px-4">
          <div className="bg-[color:var(--background)] rounded-lg shadow-md p-2 sm:p-3 text-center w-[calc(50%-0.5rem)] sm:w-60 md:w-72 h-24 sm:h-32 flex flex-col justify-center animate-bounce-slow hover:animate-jiggle transform transition-all duration-300 border border-[color:var(--border-color)]">
            <h3 className="text-2xl sm:text-3xl font-bold text-[color:var(--primary-color)]">
              {stats.total}
            </h3>
            <p className="text-sm sm:text-base text-[color:var(--secondary-color)]">
              Total Members
            </p>
          </div>
          {stats.categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-[color:var(--background)] rounded-lg shadow-md p-2 sm:p-3 text-center w-[calc(50%-0.5rem)] sm:w-60 md:w-72 h-24 sm:h-32 flex flex-col justify-center animate-bounce-slow hover:animate-jiggle transform transition-all duration-300 border border-[color:var(--border-color)]"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-[color:var(--primary-color)]">
                {cat.count}
              </h3>
              <p className="text-sm sm:text-base text-[color:var(--secondary-color)]">
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
                ${activeCategory === category
                  ? "bg-[color:var(--primary-color)] text-white"
                  : "bg-[color:var(--background)] text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)] border border-[color:var(--border-color)]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* People Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activeCategory === "Overall"
            ? getAllPeople().map((person) => renderPersonCard(person))
            : [...(peopleData as PeopleData)[activeCategory]]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((person) => renderPersonCard(person))
          }
        </div>
      </div>
    </div>
  );
}
