"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaEdit,
  FaSave,
  FaMedium,
  FaGlobe,
  FaResearchgate,
  FaOrcid,
  FaUserGraduate,
  FaUniversity,
} from "react-icons/fa";
import { SiGooglescholar, SiSemanticscholar, SiAcm, SiIeee, SiScopus } from "react-icons/si";
import { HiExternalLink } from "react-icons/hi";

// Define TypeScript types for our data
type Education = {
  degree: string;
  institution: string;
  year: number;
};

type Paper = {
  authors: string[];
  year: string;
  title: string;
  cite: string;
  venue: string;
  doi: string;
  url: string;
};

type Person = {
  name: string;
  title: string;
  email: string;
  imageURL: string;
  slug: string;
  social_links: Record<string, string>;
  interests?: string[];
  education?: Education[];
  bio?: string;
};

type PersonProfileProps = {
  person: Person;
  category: string;
  publications: Paper[];
};

export default function PersonProfile({ person, category, publications }: PersonProfileProps) {
  // State for authentication and editing mode
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // State for editable person data
  const [editablePerson, setEditablePerson] = useState<Person>({ ...person });
  // Add this with your other state variables
  const [showAllPublications, setShowAllPublications] = useState(false);

  // New states for education and interests arrays
  const [newInterest, setNewInterest] = useState("");
  const [newEducation, setNewEducation] = useState<Education>({
    degree: "",
    institution: "",
    year: new Date().getFullYear(),
  });

  // Social link editing
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Use useEffect to mark when component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    if (!isMounted) return;
    
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");

      setIsLoggedIn(!!token);

      // Check if this is the current user's profile
      // In a real app, you'd compare with the authenticated user's email
      if (userEmail && userEmail === person.email) {
        setIsCurrentUserProfile(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [person.email, isMounted]);

  // Helper function to get icon for social media
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <FaLinkedin size={20} />;
      case "twitter":
        return <FaTwitter size={20} />;
      case "github":
        return <FaGithub size={20} />;
      case "google scholar":
        return <SiGooglescholar size={20} />;
      case "researchgate":
        return <FaResearchgate size={20} />;
      case "orcid":
        return <FaOrcid size={20} />;
      case "medium":
        return <FaMedium size={20} />;
      case "website":
      case "personal website":
        return <FaGlobe size={20} />;
      case "semantic scholar":
        return <SiSemanticscholar size={20} />;
      case "acm":
      case "acm digital library":
        return <SiAcm size={20} />;
      case "ieee":
      case "ieee xplore":
        return <SiIeee size={20} />;
      case "scopus":
        return <SiScopus size={20} />;
      case "academia":
      case "academia.edu":
        return <FaUserGraduate size={20} />;
      case "university":
      case "institution":
        return <FaUniversity size={20} />;
      default:
        return <HiExternalLink size={20} />;
    }
  };

  // Handle field changes in edit mode
  const handleFieldChange = (field: string, value: any) => {
    setEditablePerson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle interest changes
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setEditablePerson((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setEditablePerson((prev) => ({
      ...prev,
      interests: prev.interests?.filter((_, i) => i !== index),
    }));
  };

  // Handle education changes
  const handleAddEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setEditablePerson((prev) => ({
        ...prev,
        education: [...(prev.education || []), { ...newEducation }],
      }));
      setNewEducation({
        degree: "",
        institution: "",
        year: new Date().getFullYear(),
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEditablePerson((prev) => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index),
    }));
  };

  // Handle social link changes
  const handleAddSocialLink = () => {
    if (newSocialPlatform.trim() && newSocialUrl.trim()) {
      setEditablePerson((prev) => ({
        ...prev,
        social_links: {
          ...(prev.social_links || {}),
          [newSocialPlatform.trim()]: newSocialUrl.trim(),
        },
      }));
      setNewSocialPlatform("");
      setNewSocialUrl("");
    }
  };

  const handleRemoveSocialLink = (platform: string) => {
    const updatedLinks = { ...editablePerson.social_links };
    delete updatedLinks[platform];

    setEditablePerson((prev) => ({
      ...prev,
      social_links: updatedLinks,
    }));
  };

  // Handle save action
  const handleSave = () => {
    console.log("Saving profile:", editablePerson);
    setIsEditMode(false);
    toast.success("Profile updated successfully!");
  };

  // Prevent hydration issues by not rendering client-specific parts during SSR
  const personToDisplay = isMounted ? editablePerson : person;
  
  // Handle loading state after mounted
  if (isLoading && isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[color:var(--background)]">
        <div className="w-10 h-10 border-4 border-[color:var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--background)] to-[color:var(--foreground)] pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button and Edit toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/people"
            className="flex items-center text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to People
          </Link>

          {isMounted && isLoggedIn && isCurrentUserProfile && (
            <button
              onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
              className="flex items-center px-4 py-2 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition"
            >
              {isEditMode ? (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          )}
        </div>

        <div className="bg-[color:var(--background)] rounded-2xl shadow-xl overflow-hidden border border-[color:var(--border-color)]">
          {/* Hero banner */}
          <div className="relative bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] h-48 md:h-64 flex flex-col pt-10 px-6 md:px-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 text-white text-center md:text-left truncate">
              {person.name}
            </h1>

            {isEditMode ? (
              <input
                type="text"
                value={personToDisplay.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="text-xl md:text-2xl lg:text-3xl bg-white/10 text-white border border-white/30 rounded px-2 py-1 w-full md:w-2/3"
              />
            ) : (
              <p className="text-xl md:text-2xl lg:text-3xl opacity-90 text-white text-center md:text-left truncate">
                {personToDisplay.title}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column with image and contact */}
            <div className="md:w-[40%] lg:w-[30%] xl:w-1/4 px-4 sm:px-6 py-8 border-b md:border-b-0 md:border-r border-[color:var(--border-color)] flex flex-col items-center">
              <div className="relative -mt-24 md:-mt-32 w-full flex justify-center">
                <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-[color:var(--background)] shadow-lg">
                  <Image
                    src={personToDisplay.imageURL}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 192px"
                    priority
                    unoptimized
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
                        span.className = "text-6xl font-bold text-white";
                        span.textContent = person.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("");
                        target.parentElement?.appendChild(span);
                      }
                    }}
                  />
                </div>
                {isMounted && isEditMode && (
                  <div className="mt-4 text-center">
                    <label className="inline-block px-4 py-2 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition cursor-pointer">
                      <span>Change Photo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          // In a real app, you would upload this file and update the imageURL
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                handleFieldChange(
                                  "imageURL",
                                  event.target.result
                                );
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-6 w-full">
                {person.email && (
                  <div className="flex items-center space-x-2 break-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[color:var(--primary-color)] flex-shrink-0"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <a
                      href={`mailto:${person.email}`}
                      className="text-[color:var(--primary-color)] hover:text-[color:var(--info-color)] text-md md:text-sm md:text-base"
                    >
                      {person.email}
                    </a>
                  </div>
                )}

                {/* Research Interests */}
                {personToDisplay.interests && personToDisplay.interests.length > 0 && (
                  <div className="w-full">
                    <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3">
                      Research Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personToDisplay.interests?.map((interest, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[color:var(--tag-bg)] text-[color:var(--primary-color)] rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social links */}
                {personToDisplay.social_links && Object.keys(personToDisplay.social_links).length > 0 && (
                  <div className="w-full">
                    <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3">
                      Connect
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(personToDisplay.social_links || {}).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-2 bg-[color:var(--foreground)] hover:bg-[color:var(--hover-bg)] rounded-lg transition"
                            aria-label={platform}
                          >
                            <span className="text-[color:var(--secondary-color)]">
                              {getSocialIcon(platform)}
                            </span>
                            <span className="ml-2 text-sm text-[color:var(--text-color)]">
                              {platform}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column with bio and education */}
            <div className="md:w-[60%] lg:w-[70%] xl:w-3/4 px-4 sm:px-6 py-8 overflow-x-hidden">
              {/* Bio section */}
              {personToDisplay.bio && (
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[color:var(--text-color)] mb-4">
                    Biography
                  </h2>
                  {isMounted && isEditMode ? (
                    <textarea
                      value={personToDisplay.bio || ""}
                      onChange={(e) => handleFieldChange("bio", e.target.value)}
                      className="w-full h-64 px-4 py-3 text-[color:var(--secondary-color)] bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md"
                      placeholder="Write your biography here... Markdown is supported."
                    />
                  ) : (
                    <article
                      className="prose prose-lg max-w-none mx-6 text-justify
                                      dark:prose-invert 
                                      prose-headings:font-bold 
                                      prose-h1:text-2xl prose-h1:leading-tight 
                                      prose-h2:text-xl prose-h2:leading-tight prose-h2:mt-10 prose-h2:mb-4
                                      prose-h3:text-lg prose-h3:leading-snug prose-h3:mt-8 prose-h3:mb-3
                                      prose-p:text-md prose-p:leading-relaxed prose-p:mb-6 
                                      prose-a:text-primary prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary
                                      prose-strong:font-semibold
                                      prose-ul:my-6 prose-li:my-2 prose-li:text-lg prose-li:leading-relaxed
                                      prose-blockquote:border-l-4 prose-blockquote:border-primary/70 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                                      prose-p:text-[var(--text-color)] prose-headings:text-[var(--text-color)] prose-strong:text-[var(--text-color)] prose-li:text-[var(--text-color)]"
                    >
                      {personToDisplay.bio?.split("\n\n").map((paragraph, index) => {
                        // Check if paragraph is a heading (starts with # for h1, ## for h2, etc.)
                        if (paragraph.startsWith("# ")) {
                          return (
                            <h1
                              key={index}
                              className="text-2xl font-bold mt-10 mb-6 text-text"
                            >
                              {paragraph.substring(2)}
                            </h1>
                          );
                        } else if (paragraph.startsWith("## ")) {
                          return (
                            <h2
                              key={index}
                              className="text-xl font-bold mt-8 mb-4 text-text"
                            >
                              {paragraph.substring(3)}
                            </h2>
                          );
                        } else if (paragraph.startsWith("### ")) {
                          return (
                            <h3
                              key={index}
                              className="text-lg font-bold mt-6 mb-3 text-text"
                            >
                              {paragraph.substring(4)}
                            </h3>
                          );
                        } else if (paragraph.startsWith("> ")) {
                          // Blockquote
                          return (
                            <blockquote
                              key={index}
                              className="border-l-4 border-primary/70 pl-4 italic my-6"
                            >
                              <p className="text-slate-700 dark:text-slate-300 text-lg">
                                {paragraph.substring(2)}
                              </p>
                            </blockquote>
                          );
                        } else if (paragraph.startsWith("- ")) {
                          // Simple list support
                          const items = paragraph
                            .split("\n- ")
                            .map((item) => item.replace(/^- /, ""));
                          return (
                            <ul key={index} className="list-disc pl-6 my-6">
                              {items.map((item, i) => (
                                <li key={i} className="my-2 text-text text-lg">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          );
                        } else if (paragraph.trim() === "") {
                          // Handle empty paragraphs for spacing
                          return <div key={index} className="h-4"></div>;
                        } else {
                          // Regular paragraph
                          return (
                            <p
                              key={index}
                              className="mb-6 text-md leading-relaxed text-text"
                            >
                              {/* Parse potential links in format [text](url) */}
                              {paragraph
                                .split(/(\[.*?\]\(.*?\))/)
                                .map((part, i) => {
                                  if (part.match(/\[(.*?)\]\((.*?)\)/)) {
                                    const text = part.match(/\[(.*?)\]/)[1];
                                    const url = part.match(/\((.*?)\)/)[1];
                                    return (
                                      <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-medium border-b border-primary/30 hover:border-primary transition-colors"
                                      >
                                        {text}
                                      </a>
                                    );
                                  }
                                  return part;
                                })}
                            </p>
                          );
                        }
                      })}
                    </article>
                  )}
                </div>
              )}

              {/* Education section */}
              {personToDisplay.education && personToDisplay.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[color:var(--text-color)] mb-4">
                    Education
                  </h2>
                  {isMounted && isEditMode ? (
                    <div className="space-y-6">
                      {personToDisplay.education?.map((edu, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mr-4 flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-[color:var(--primary-color)]/10 flex items-center justify-center">
                              <input
                                type="number"
                                value={edu.year}
                                onChange={(e) => {
                                  const updatedEducation = [
                                    ...(personToDisplay.education || []),
                                  ];
                                  updatedEducation[index].year = parseInt(
                                    e.target.value
                                  );
                                  handleFieldChange(
                                    "education",
                                    updatedEducation
                                  );
                                }}
                                className="w-16 text-center bg-transparent text-[color:var(--primary-color)] text-sm font-black"
                              />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2 min-w-0">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updatedEducation = [
                                  ...(personToDisplay.education || []),
                                ];
                                updatedEducation[index].degree = e.target.value;
                                handleFieldChange("education", updatedEducation);
                              }}
                              className="w-full px-3 py-2 text-[color:var(--text-color)] bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md"
                              placeholder="Degree"
                            />
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updatedEducation = [
                                  ...(personToDisplay.education || []),
                                ];
                                updatedEducation[index].institution =
                                  e.target.value;
                                handleFieldChange("education", updatedEducation);
                              }}
                              className="w-full px-3 py-2 text-[color:var(--secondary-color)] bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md"
                              placeholder="Institution"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveEducation(index)}
                            className="ml-2 text-[color:var(--error-color)] hover:text-[color:var(--error-color)]/80 text-lg flex-shrink-0"
                          >
                            &times;
                          </button>
                        </div>
                      ))}

                      <div className="mt-4 p-4 border border-dashed border-[color:var(--border-color)] rounded-lg">
                        <h4 className="text-sm font-medium text-[color:var(--text-color)] mb-3">
                          Add New Education
                        </h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={newEducation.degree}
                            onChange={(e) =>
                              setNewEducation({
                                ...newEducation,
                                degree: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-[color:var(--text-color)] bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md"
                            placeholder="Degree"
                          />
                          <input
                            type="text"
                            value={newEducation.institution}
                            onChange={(e) =>
                              setNewEducation({
                                ...newEducation,
                                institution: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-[color:var(--secondary-color)] bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md"
                            placeholder="Institution"
                          />
                          <div className="flex items-center">
                            <label className="text-sm text-[color:var(--secondary-color)] mr-2">
                              Year:
                            </label>
                            <input
                              type="number"
                              value={newEducation.year}
                              onChange={(e) =>
                                setNewEducation({
                                  ...newEducation,
                                  year: parseInt(e.target.value),
                                })
                              }
                              className="w-24 px-3 py-2 text-[color:var(--secondary-color)] bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md"
                            />
                          </div>
                          <button
                            onClick={handleAddEducation}
                            className="w-full px-3 py-2 bg-[color:var(--primary-color)] text-white rounded-md hover:bg-[color:var(--primary-color)]/90"
                          >
                            Add Education
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {personToDisplay.education?.map((edu, index) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-[color:var(--primary-color)]/10 flex items-center justify-center">
                              <span className="text-[color:var(--primary-color)] text-sm font-black">
                                {edu.year}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-[color:var(--text-color)]">
                              {edu.degree}
                            </h3>
                            <p className="text-[color:var(--secondary-color)]">
                              {edu.institution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Publications section */}
              <div className="mt-10">
                <h2 className="text-4xl font-bold text-[color:var(--text-color)] mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mr-3 text-[color:var(--primary-color)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Publications
                </h2>

                {publications.length > 0 ? (
                  <div className="space-y-4">
                    {/* Show first 5 papers initially */}
                    {publications
                      .slice(0, isMounted && showAllPublications ? undefined : 5)
                      .map((paper, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-[color:var(--primary-color)]/30 bg-[color:var(--foreground)]/50 hover:bg-[color:var(--foreground)] hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className="hidden sm:flex h-10 w-10 rounded-full bg-[color:var(--primary-color)]/10 items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-[color:var(--primary-color)] font-medium">
                                {paper.year}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-[color:var(--text-color)] leading-tight">
                                <a
                                  href={paper.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-[color:var(--primary-color)] transition-colors duration-200"
                                >
                                  {paper.title}
                                </a>
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-2 text-sm mt-2">
                                <span className="sm:hidden px-2 py-1 bg-[color:var(--primary-color)]/10 text-[color:var(--primary-color)] rounded text-xs">
                                  {paper.year}
                                </span>
                                <span className="text-[color:var(--secondary-color)] italic">
                                  {paper.venue}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <a
                                  href={paper.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[color:var(--primary-color)]/10 text-[color:var(--primary-color)] hover:bg-[color:var(--primary-color)]/20 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                  View Paper
                                </a>
                                {isMounted && (
                                  <button
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[color:var(--foreground)] text-[color:var(--secondary-color)] hover:text-[color:var(--text-color)] transition-colors"
                                    onClick={() => {
                                      if (navigator.clipboard) {
                                        navigator.clipboard.writeText(paper.cite);
                                        toast.success("Citation copied to clipboard!");
                                      }
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                    Cite
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {publications.length > 5 && isMounted && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setShowAllPublications(!showAllPublications)}
                          className="px-6 py-2.5 bg-foreground hover:bg-[color:var(--hover-bg)] text-[color:var(--text-color)] hover:text-[color:var(--primary-color)] border border-[color:var(--border-color)] rounded-lg text-sm font-medium flex items-center transition-all duration-200"
                        >
                          {showAllPublications ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                              Show Less
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                              Show All ({publications.length})
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 px-6 bg-[color:var(--foreground)] rounded-xl border border-[color:var(--border-color)] shadow-sm">
                    <div className="flex flex-col items-center justify-center text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-[color:var(--accent-color)] mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-1">
                        Publications Coming Soon
                      </h3>
                      <p className="text-[color:var(--secondary-color)] max-w-md">
                        Research publications are currently in progress and will
                        be available here when published.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMounted && (
        <Toaster
          position="bottom-right"
          toastOptions={{
            // Customize default toast options
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
      )}
    </div>
  );
}
