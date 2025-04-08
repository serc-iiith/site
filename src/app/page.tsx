"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import Slideshow from "@/components/SlideShow";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import CustomCountUp from "@/components/CustomCountUp";
import projectsData from "../../public/data/projects.json";
import researchData from "../../public/data/papers.json";
import collabData from "../../public/data/collaborators.json";
import peopleData from "../../public/data/people.json";
import blogData from "../../public/data/blogs.json";
import eventsData from "../../public/data/events.json";
import { ArrowRight, BarChart3, BookMarked, Brain, Calculator, CheckCircle, Code, Fingerprint, FlaskConical, FolderGit2, Gamepad2, Glasses, Handshake, Leaf, Microscope, RefreshCw, Smartphone } from "lucide-react";

const researchTopics = [
  {
    title: "Formal Methods",
    icon: "📊",
    description:
      "Applying mathematical techniques for specification, development, and verification of software systems to ensure correctness and reliability.",
    color: "border-orange-400",
  },
  {
    title: "Gamification",
    icon: "🎮",
    description:
      "Applying game design principles and mechanics to non-game contexts to enhance user engagement, motivation, and learning outcomes.",
    color: "border-purple-400",
  },
  {
    title: "HCI",
    icon: "👆",
    description:
      "Researching Human-Computer Interaction to design intuitive, accessible, and effective user interfaces and interaction paradigms.",
    color: "border-yellow-400",
  },
  {
    title: "IoT",
    icon: "📱",
    description:
      "Developing software solutions for Internet of Things ecosystems, including device interconnectivity, data processing, and system integration.",
    color: "border-green-400",
  },
  {
    title: "Programming Languages",
    icon: "💻",
    description:
      "Innovating in language design, semantics, compilers, and runtime systems to enable safer, more expressive, and efficient software development.",
    color: "border-teal-400",
  },
  {
    title: "SE and ML",
    icon: "🧠",
    description:
      "Exploring the intersection of software engineering and machine learning to build more intelligent, adaptive software systems.",
    color: "border-amber-400",
  },
  {
    title: "Self-Adaptive Systems",
    icon: "🔄",
    description:
      "Engineering systems that can modify their behavior automatically in response to changes in operating environments and requirements.",
    color: "border-cyan-400",
  },
  {
    title: "Software Analytics",
    icon: "📈",
    description:
      "Analyzing software artifacts and processes to gain insights for improving software quality, team productivity, and development workflows.",
    color: "border-pink-400",
  },
  {
    title: "Software Quality",
    icon: "✅",
    description:
      "Developing methodologies and tools to assess, measure, and improve the reliability, performance, and security of software systems.",
    color: "border-red-400",
  },
  {
    title: "Software Sustainability",
    icon: "♻️",
    description:
      "Investigating approaches to create software that is environmentally sustainable, resource-efficient, and maintainable over extended periods.",
    color: "border-emerald-400",
  },
  {
    title: "Virtual Labs",
    icon: "🔬",
    description:
      "Building immersive, interactive virtual laboratory environments for education and research that simulate real-world scenarios and experiments.",
    color: "border-blue-400",
  },
  {
    title: "VR and AR",
    icon: "🥽",
    description:
      "Exploring virtual and augmented reality technologies to create immersive interfaces and environments for various software applications.",
    color: "border-indigo-400",
  },
];

const slides = [
  {
    image: "/images/slideshow1.webp",
    title: "Slide 1",
  },
  {
    image: "/images/slideshow2.webp",
    title: "Slide 2",
  },
  {
    image: "/images/slideshow3.webp",
    title: "Slide 3",
  },
];

// Hex pattern SVG component for visual interest
const HexPattern = () => (
  <div className="absolute inset-0 z-0 opacity-5">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="hexagons"
          width="50"
          height="43.4"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(2)"
        >
          <polygon
            points="25,0 50,14.4 50,28.8 25,43.4 0,28.8 0,14.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  </div>
);

const CircuitPattern = () => (
  <div className="absolute inset-0 z-0 opacity-5">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="circuit"
          width="70"
          height="70"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,35 L15,35 M35,0 L35,15 M35,55 L35,70 M55,35 L70,35"
            stroke="var(--accent-color)"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="35" cy="35" r="5" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" />
          <circle cx="35" cy="35" r="1" fill="var(--accent-color)" />
          <circle cx="15" cy="35" r="2" fill="var(--accent-color)" />
          <circle cx="55" cy="35" r="2" fill="var(--accent-color)" />
          <circle cx="35" cy="15" r="2" fill="var(--accent-color)" />
          <circle cx="35" cy="55" r="2" fill="var(--accent-color)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  </div>
);

// Custom section transition component
const SectionTransition = ({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Function to return the appropriate Lucide icon based on topic title
const getIconForTopic = (title: String) => {
  switch (title) {
    case "Formal Methods":
      return <Calculator className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Gamification":
      return <Gamepad2 className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "HCI":
      return <Fingerprint className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "IoT":
      return <Smartphone className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Programming Languages":
      return <Code className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "SE and ML":
      return <Brain className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Self-Adaptive Systems":
      return <RefreshCw className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Software Analytics":
      return <BarChart3 className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Software Quality":
      return <CheckCircle className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Software Sustainability":
      return <Leaf className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "Virtual Labs":
      return <FlaskConical className="w-6 h-6 text-[color:var(--primary-color)]" />;
    case "VR and AR":
      return <Glasses className="w-6 h-6 text-[color:var(--primary-color)]" />;
    default:
      return <Code className="w-6 h-6 text-[color:var(--primary-color)]" />;
  }
};

// Research topic card with hover effect
interface ResearchTopicCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const ResearchTopicCard = ({
  title,
  icon,
  description,
}: ResearchTopicCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-background rounded-lg p-4 shadow-md flex flex-col border border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]"
    >
      <div className="flex items-center mb-3">
        <div className="mr-3 p-2 bg-[color:var(--primary-color)]/10 rounded-md">
          {icon}
        </div>
        <h3 className="text-base font-bold text-[color:var(--text-color)]">{title}</h3>
      </div>
      <p className="text-sm text-[color:var(--secondary-color)] flex-grow">{description}</p>
    </motion.div>
  );
};

// Publication card with hover effect
interface UpdatesCardProps {
  type: "blog" | "publication";
  title: string;
  authors: string;
  conference: string;
  year: string;
  link: string;
}

const UpdatesCard = ({
  type,
  title,
  authors,
  conference,
  year,
  link,
}: UpdatesCardProps) => {
  // Define border color based on type
  const borderColor =
    type === "blog"
      ? "border-[color:var(--warning-color)]"
      : "border-[color:var(--primary-color)]";

  // Define text color for link based on type
  const linkColor =
    type === "blog"
      ? "text-[color:var(--warning-color)] hover:text-[color:var(--warning-color)]/80"
      : "text-[color:var(--primary-color)] hover:text-[color:var(--info-color)]";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-foreground rounded-lg shadow-md p-3 border-l-4 ${borderColor} transition-all duration-200`}
    >
      <h3 className="font-bold text-sm text-[color:var(--text-color)] line-clamp-2">{title}</h3>
      <p className="text-xs text-[color:var(--secondary-color)] mt-1 line-clamp-1">{authors}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-[color:var(--tertiary-color)]">
          {type === "blog" ? year : `${conference}, ${year}`}
        </p>
        <Link href={link} className={`${linkColor} text-xs hover:underline`}>
          {type === "blog" ? "View →" : "Read →"}
        </Link>
      </div>
    </motion.div>
  );
};

// Event card component
interface Event {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  year: number;
  image: string;
  presenters: string[];
}

const EventCard = ({ event }: { event: Event }) => {
  const eventDate = new Date(event.startTime);
  const isUpcoming = eventDate > new Date();

  // Format date for display
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-foreground rounded-lg shadow-md p-3 border-l-4 
                 ${isUpcoming
          ? "border-[color:var(--info-color)]"
          : "border-[color:var(--success-color)]"
        } 
                 transition-all duration-200`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-sm text-[color:var(--text-color)] line-clamp-1">{event.name}</h3>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1 ${isUpcoming
            ? "bg-[color:var(--info-color)]/20 text-[color:var(--info-color)]"
            : "bg-[color:var(--success-color)]/20 text-[color:var(--success-color)]"
            }`}
        >
          {isUpcoming ? "Upcoming" : "Past"}
        </span>
      </div>
      <p className="text-xs text-[color:var(--secondary-color)] mt-1 line-clamp-2">{event.description}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-[10px] text-[color:var(--tertiary-color)]">
          {formattedDate} • {event.location.split(",")[0]}
        </p>
      </div>
    </motion.div>
  );
};

// Custom TabView component for mobile
const TabView = ({ tabs }: { tabs: { title: string; content: React.ReactNode }[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full mr-2 transition-colors ${activeTab === index
                ? "bg-[color:var(--primary-color)] text-white"
                : "bg-[color:var(--background)] text-[color:var(--text-color)]"
              }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="py-2">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

// Stats Card for mobile
const StatCard = ({ icon, value, title }: { icon: ReactNode, value: string, title: string }) => {
  return (
    <div className="flex items-center p-3 bg-[color:var(--background)] rounded-lg shadow-sm border border-[color:var(--border-color)]">
      <div className="p-2 bg-[color:var(--primary-color)]/10 rounded-md mr-3">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-[color:var(--text-color)]">{value}</div>
        <div className="text-xs text-[color:var(--secondary-color)]">{title}</div>
      </div>
    </div>
  );
};

export default function Home() {
  interface Author {
    name: string;
    url: string;
  }

  interface Paper {
    authors: string[];
    year: string;
    title: string;
    cite: string;
    venue: string;
    doi?: string;
    url?: string;
  }

  interface Blog {
    id: number;
    title: string;
    slug: string;
    author: string;
    role: string;
    date: string;
    readTime: number;
    category: string;
    coverImage: string;
    excerpt: string;
    content: string;
  }

  // Add the state for recent publications
  const [recentPublications, setRecentPublications] = useState<Paper[]>([]);
  const [latestBlogs, setLatestBlogs] = useState(blogData.slice(0, 3));
  const [topEvents, setTopEvents] = useState<Event[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Add a useEffect to fetch and process the papers
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    function fetchRecentPapers() {
      try {
        const papers: Paper[] = researchData;

        // Sort papers by year in descending order
        const sortedPapers = [...papers].sort(
          (a, b) => parseInt(b.year) - parseInt(a.year)
        );

        // Get the 5 most recent papers
        const recent = sortedPapers.slice(0, 3);
        setRecentPublications(recent);
      } catch (error) {
        console.error("Error fetching recent publications:", error);
      }
    }

    function fetchLatestBlogs() {
      try {
        const blogs: Blog[] = blogData;

        // Sort blogs by date in descending order
        const sortedBlogs = [...blogs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Get the 3 most recent blogs
        const latest = sortedBlogs.slice(0, 3);
        setLatestBlogs(latest);
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
      }
    }

    function fetchTopEvents() {
      try {
        const events: Event[] = eventsData;
        const currentDate = new Date();

        // Sort events - upcoming first (by closest date), then recent past
        const sortedEvents = [...events].sort((a, b) => {
          const dateA = new Date(a.startTime);
          const dateB = new Date(b.startTime);

          // If one is upcoming and one is past
          const aIsUpcoming = dateA > currentDate;
          const bIsUpcoming = dateB > currentDate;

          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;

          // If both are upcoming, sort by closest
          if (aIsUpcoming && bIsUpcoming) {
            return dateA.getTime() - dateB.getTime();
          }

          // If both are past, sort by most recent
          return dateB.getTime() - dateA.getTime();
        });

        // Get the top 3 events
        const top = sortedEvents.slice(0, 3);
        setTopEvents(top);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchRecentPapers();
    fetchLatestBlogs();
    fetchTopEvents();

    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Create the tabs data for the mobile view
  const updatesTabs = [
    {
      title: "Events",
      content: (
        <div className="space-y-3">
          {topEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <div className="mt-4">
            <Link
              href="/events"
              className="text-[color:var(--primary-color)] text-sm hover:underline flex items-center"
            >
              View all events
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "Publications",
      content: (
        <div className="space-y-3">
          {recentPublications.map((publication, index) => (
            <UpdatesCard
              type="publication"
              key={index}
              title={publication.title}
              authors={publication.authors.join(", ")}
              conference={publication.venue}
              year={publication.year}
              link={publication.url || "#"}
            />
          ))}
          <div className="mt-4">
            <Link
              href="/research"
              className="text-[color:var(--primary-color)] text-sm hover:underline flex items-center"
            >
              View all publications
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "Blogs",
      content: (
        <div className="space-y-3">
          {latestBlogs.map((blog) => (
            <UpdatesCard
              type="blog"
              key={blog.id}
              title={blog.title}
              authors={blog.author}
              conference={blog.category}
              year={blog.date}
              link={`/blog/${blog.slug}`}
            />
          ))}
          <div className="mt-4">
            <Link
              href="/blog"
              className="text-[color:var(--primary-color)] text-sm hover:underline flex items-center"
            >
              View all blogs
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <Slideshow slides={slides} />

      {/* Mission Section */}
      <section className="py-8 md:py-16 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="var(--accent-color)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <SectionTransition delay={0.1}>
              <div className="md:pr-6">
                <h2 className="text-3xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)] text-center md:text-left">
                  Our Mission
                </h2>
                <div className="w-24 h-1 bg-[color:var(--primary-color)] mb-6 mx-auto md:mx-0"></div>
                <p className="text-base md:text-lg text-[color:var(--text-color)] leading-relaxed text-center md:text-justify">
                  Software Engineering Research Center (SERC) aims to research
                  and develop state of art techniques, methods and tools in
                  various areas of software engineering and programming
                  languages.
                </p>
                <p className="text-base md:text-lg text-[color:var(--text-color)] mt-4 leading-relaxed text-center md:text-justify">
                  SERC has faculty with vast teaching and research experience in
                  and outside India.
                </p>
              </div>
            </SectionTransition>

            <SectionTransition delay={0.3}>
              <div className="relative w-full h-[220px] md:h-[370px] rounded-lg overflow-hidden shadow-md border border-[color:var(--border-color)]">
                <iframe
                  id="ytplayer"
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/051kkAC6eqs?autoplay=1&cc_load_policy=1&controls=0&modestbranding=1&color=white"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </SectionTransition>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
          {isMobile ? (
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                value={researchData.length.toString()}
                title="Publications"
                icon={<BookMarked className="text-[color:var(--primary-color)]" size={20} />}
              />
              <StatCard
                value={projectsData.length.toString()}
                title="Projects"
                icon={<FolderGit2 className="text-[color:var(--primary-color)]" size={20} />}
              />
              <StatCard
                value={collabData.length.toString()}
                title="Partners"
                icon={<Handshake className="text-[color:var(--primary-color)]" size={20} />}
              />
              <StatCard
                value={Object.values(peopleData)
                  .reduce((total, people) => total + people.length, 0)
                  .toString()}
                title="Researchers"
                icon={<Microscope className="text-[color:var(--primary-color)]" size={20} />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              <CustomCountUp
                value={researchData.length.toString()}
                title="Research Publications"
                icon={<BookMarked className="text-primary" size={32} />}
                customStyle="text-4xl font-bold text-text"
              />
              <CustomCountUp
                value={projectsData.length.toString()}
                title="Projects"
                icon={<FolderGit2 className="text-primary" size={32} />}
                customStyle="text-4xl font-bold text-text"
              />
              <CustomCountUp
                value={collabData.length.toString()}
                title="Industry Partners"
                icon={<Handshake className="text-primary" size={32} />}
                customStyle="text-4xl font-bold text-text"
              />
              <CustomCountUp
                value={Object.values(peopleData)
                  .reduce((total, people) => total + people.length, 0)
                  .toString()}
                title="Researchers"
                icon={<Microscope className="text-primary" size={32} />}
                customStyle="text-4xl font-bold text-text"
              />
            </div>
          )}
        </div>
      </section>

      {/* Research Topics Section */}
      <section className="relative py-12 md:py-20 bg-background text-[color:var(--text-color)] overflow-hidden">
        <HexPattern />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)]">
              Latest Updates
            </h2>
            <div className="w-32 h-1 bg-[color:var(--primary-color)] mx-auto mb-8 md:mb-16"></div>
          </motion.div>

          {isMobile ? (
            <SectionTransition>
              <TabView tabs={updatesTabs} />
            </SectionTransition>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Events Section */}
              <SectionTransition delay={0.1}>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 border-b border-[color:var(--border-color)] pb-2 text-[color:var(--text-color)]">
                    Upcoming & Recent Events
                  </h3>
                  <div className="space-y-4">
                    {topEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/events"
                      className="text-[color:var(--primary-color)] text-md hover:underline flex items-center"
                    >
                      View all events
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </SectionTransition>

              {/* Recent Research / Publications */}
              <SectionTransition delay={0.2}>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 border-b border-[color:var(--border-color)] pb-2 text-[color:var(--text-color)]">
                    Recent Publications
                  </h3>
                  <div className="space-y-4">
                    {recentPublications.map((publication, index) => (
                      <UpdatesCard
                        type="publication"
                        key={index}
                        title={publication.title}
                        authors={publication.authors.join(", ")}
                        conference={publication.venue}
                        year={publication.year}
                        link={publication.url || "#"}
                      />
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/research"
                      className="text-[color:var(--primary-color)] text-md hover:underline flex items-center"
                    >
                      View all publications
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </SectionTransition>

              {/* Latest Blogs */}
              <SectionTransition delay={0.3}>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 border-b border-[color:var(--border-color)] pb-2 text-[color:var(--text-color)]">
                    Latest Blogs
                  </h3>
                  <div className="space-y-4">
                    {latestBlogs.map((blog) => (
                      <UpdatesCard
                        type="blog"
                        key={blog.id}
                        title={blog.title}
                        authors={blog.author}
                        conference={blog.category}
                        year={blog.date}
                        link={`/blog/${blog.slug}`}
                      />
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/blog"
                      className="text-[color:var(--primary-color)] text-md hover:underline flex items-center"
                    >
                      View all blogs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </SectionTransition>
            </div>
          )}
        </div>
      </section>

      {/* Latest Updates Section with Tabs */}
      <section className="py-12 md:py-20 bg-foreground relative overflow-hidden">
        <CircuitPattern />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--info-color)]">
              Research Areas
            </h2>
            <div className="w-32 h-1 bg-[color:var(--primary-color)] mx-auto mb-4 md:mb-6"></div>
            <p className="text-base md:text-xl text-[color:var(--secondary-color)] text-center max-w-3xl mx-auto mb-8 md:mb-16">
              Exploring the frontiers of software engineering innovation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
          >
            {researchTopics.map((topic) => (
              <ResearchTopicCard
                key={topic.title}
                title={topic.title}
                icon={getIconForTopic(topic.title)}
                description={topic.description}
              />
            ))}
          </motion.div>

          <div className="text-center mt-8 md:mt-12">
            <Link
              href="/research"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-[color:var(--primary-color)] hover:bg-[color:var(--primary-color)]/90 text-sm md:text-base font-medium rounded-lg text-white transition-all duration-300 hover:shadow-lg"
            >
              Explore our research
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}