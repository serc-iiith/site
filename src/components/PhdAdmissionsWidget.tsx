"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import newsData from "../../public/data/news.json";
import {
  X,
  FileText,
  Mail,
  Image as ImageIcon,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Info,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Download,
  GraduationCap,
  Bot,
  HeartPulse,
  Zap,
  BookOpen,
  Newspaper
} from "lucide-react";

export default function PhdAdmissionsWidget() {
  const phdEvent = newsData.find(event => event.slug === "phd-admissions-serc-2026");
  const hasTime = (phdEvent as any)?.hasTime !== false;
  const [isMinimized, setIsMinimized] = useState(false); // Widget minimized to badge
  const [showPosterModal, setShowPosterModal] = useState(false); // Lightbox modal for poster image
  const [zoomScale, setZoomScale] = useState(1); // Zoom scale for poster (1.0 to 4.0)
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
    const minimized = localStorage.getItem("serc_phd_announcement_minimized");
    if (minimized === "true") {
      setIsMinimized(true);
    }
  }, []);

  if (!hasMounted) return null;

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMinimized = !isMinimized;
    setIsMinimized(nextMinimized);
    localStorage.setItem("serc_phd_announcement_minimized", nextMinimized ? "true" : "false");
  };

  // Prefilled email parameters
  const emailSubject = encodeURIComponent("Application for Ph.D. Opportunities - SERC 2026");
  const emailBody = encodeURIComponent(
    "Dear Admissions Committee,\n\nI am writing to express my interest in the Ph.D. opportunities at the Software Engineering Research Centre (SERC), IIIT Hyderabad.\n\nPlease find attached my Cover Letter, Curriculum Vitae (CV), and Statement of Purpose (SOP).\n\nInterested Research Area(s):\n- [Please specify research area(s) e.g., Engineering Agentic AI Systems, Human-Centred Immersive Healthcare, etc.]\n\nLooking forward to hearing from you.\n\nSincerely,\n[Your Name]\n[Contact Information]"
  );
  const emailMailto = `mailto:serc.admin@iiit.ac.in?subject=${emailSubject}&body=${emailBody}`;

  return (
    <>
      <AnimatePresence>
        {isMinimized ? (
          /* Minimized Pulsing Badge */
          <motion.div
            key="minimized-badge"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setIsMinimized(false);
              localStorage.setItem("serc_phd_announcement_minimized", "false");
            }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto justify-center sm:justify-start z-[999] flex items-center gap-2 px-4 py-3 rounded-full cursor-pointer bg-[color:var(--primary-color)] text-white shadow-xl hover:shadow-2xl border border-white/20 transition-all group font-medium text-sm md:text-base"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </div>
            <GraduationCap size={18} className="text-white" />
            <span>Ph.D. Opportunities 2026</span>
          </motion.div>
        ) : (
          /* Expanded Card Widget */
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto z-[999] w-auto sm:w-full sm:max-w-[380px] rounded-2xl shadow-2xl bg-[color:var(--foreground)] border border-[color:var(--border-color)] overflow-hidden"
          >
            {/* Visual Header Strip */}
            <div className="h-2 bg-gradient-to-r from-[color:var(--primary-color)] via-[color:var(--info-color)] to-[color:var(--accent-color)] w-full" />

            <div className="p-5">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[color:var(--primary-color)]/10 text-[color:var(--primary-color)] border border-[color:var(--primary-color)]/20 animate-pulse">
                  <Sparkles size={12} />
                  <span>PH.D. OPPORTUNITIES</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMinimize}
                    title="Collapse Announcement"
                    className="flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-[color:var(--hover-bg)] text-xs font-semibold text-[color:var(--secondary-color)] hover:text-[color:var(--text-color)] border border-[color:var(--border-color)] transition-colors"
                  >
                    <ChevronDown size={14} />
                    <span>Minimize</span>
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <h3 className="text-lg font-bold text-[color:var(--text-color)] leading-snug mb-2">
                Join SERC @ IIIT-H
              </h3>
              <p className="text-xs text-[color:var(--secondary-color)] mb-4">
                The Software Engineering Research Centre (SERC) at IIIT Hyderabad invites Ph.D. applications for 2026. Join a world-class environment pushing the limits of software engineering.
              </p>

              {/* Research Areas Highlights */}
              <div className="bg-[color:var(--background)] rounded-xl p-3 mb-4 border border-[color:var(--border-color)]">
                <h4 className="text-xs font-semibold text-[color:var(--text-color)] mb-2 flex items-center gap-1">
                  {/* <Info size={12} className="text-[color:var(--primary-color)]" /> */}
                  Key Research Frontiers:
                </h4>
                <ul className="space-y-1.5 text-xs text-[color:var(--text-color)]">
                  <li className="flex items-center gap-2">
                    <Bot size={14} className="text-[color:var(--primary-color)] flex-shrink-0" />
                    <span className="font-medium">Engineering Agentic AI Systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <HeartPulse size={14} className="text-[color:var(--info-color)] flex-shrink-0" />
                    <span className="font-medium">Immersive Healthcare (HCI/VR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap size={14} className="text-[color:var(--warning-color)] flex-shrink-0" />
                    <span className="font-medium">Trustworthy Parallel Computing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[color:var(--success-color)] flex-shrink-0" />
                    <span className="font-medium">AI & Educational Technology</span>
                  </li>
                </ul>
              </div>

              {/* Important details */}
              <div className="flex justify-between items-center text-xs mb-4">
                <span className="text-[color:var(--secondary-color)] font-medium">Deadline:</span>
                <span className="font-bold text-[color:var(--warning-color)] bg-[color:var(--warning-color)]/10 px-2 py-0.5 rounded-md border border-[color:var(--warning-color)]/20">
                  {(() => {
                    const endTimeStr = phdEvent?.endTime || "2026-09-15T23:59";
                    const date = new Date(endTimeStr);
                    const formattedDate = date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });
                    if (hasTime) {
                      const formattedTime = date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                      return `${formattedDate} at ${formattedTime}`;
                    }
                    return formattedDate;
                  })()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Email Apply CTA */}
                <a
                  href={emailMailto}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[color:var(--primary-color)] text-white hover:bg-[color:var(--primary-color)]/95 font-semibold text-sm hover:shadow-lg transition-all group"
                >
                  <Mail size={16} />
                  <span>Apply via Email</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>

                {/* News Article CTA */}
                <Link
                  href="/news/phd-admissions-serc-2026"
                  onClick={() => {
                    setIsMinimized(true);
                    localStorage.setItem("serc_phd_announcement_minimized", "true");
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--background)] hover:bg-[color:var(--hover-bg)] text-[color:var(--text-color)] hover:border-[color:var(--primary-color)]/50 font-semibold text-xs transition-all group"
                >
                  <Newspaper size={14} className="text-[color:var(--info-color)] animate-pulse" />
                  <span>Read Full Announcement Post</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Second Row CTAs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowPosterModal(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] hover:bg-[color:var(--hover-bg)] text-[color:var(--text-color)] text-xs font-semibold transition-colors"
                  >
                    <ImageIcon size={14} className="text-[color:var(--primary-color)]" />
                    <span>View Poster</span>
                  </button>

                  <a
                    href="/assets/Advt_JD_SERC_Ph.d.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[color:var(--border-color)] bg-[color:var(--background)] hover:bg-[color:var(--hover-bg)] text-[color:var(--text-color)] text-xs font-semibold transition-colors"
                  >
                    <FileText size={14} className="text-[color:var(--success-color)]" />
                    <span>Details PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Modal for PhD Poster Image */}
      <AnimatePresence>
        {showPosterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowPosterModal(false);
              setZoomScale(1);
            }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full bg-neutral-950 flex flex-col overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex justify-between items-center px-4 py-3 bg-black/50 backdrop-blur-md border-b border-white/10 z-10 text-white">
                <span className="text-sm font-semibold flex items-center gap-1.5 truncate max-w-[50%]">
                  <Sparkles size={14} className="text-[color:var(--primary-color)] flex-shrink-0" />
                  <span className="truncate">Ph.D. Opportunities Poster - SERC IIIT Hyderabad</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-md font-mono text-white/80">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomScale(prev => Math.max(1, prev - 0.25))}
                    disabled={zoomScale <= 1}
                    title="Zoom Out"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={() => setZoomScale(prev => Math.min(4, prev + 0.25))}
                    disabled={zoomScale >= 4}
                    title="Zoom In"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => setZoomScale(1)}
                    disabled={zoomScale === 1}
                    title="Reset Zoom"
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                  <div className="w-px h-5 bg-white/10 mx-1"></div>
                  <a
                    href="/images/PhD. Posting.png"
                    download="PhD. Posting.png"
                    title="Download Poster Image"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => {
                      setShowPosterModal(false);
                      setZoomScale(1);
                    }}
                    title="Close"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Content - Draggable Image Container */}
              <div 
                ref={containerRef}
                className="flex-1 w-full h-full overflow-hidden flex items-center justify-center relative bg-neutral-950 select-none"
              >
                <motion.img
                  src="/images/PhD. Posting.png"
                  alt="Ph.D. Admission Opportunities 2026 - SERC"
                  drag={zoomScale > 1}
                  dragConstraints={containerRef}
                  dragElastic={0.15}
                  animate={{ scale: zoomScale }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain select-none pointer-events-auto cursor-zoom-in"
                  style={{ cursor: zoomScale > 1 ? 'grab' : 'zoom-in' }}
                  onClick={() => setZoomScale(prev => prev > 1 ? 1 : 2)}
                />
              </div>

              {/* Modal Bottom Bar */}
              <div className="px-6 py-4 bg-black/50 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 z-10 text-white">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-white/70">
                    Interested? Submit cover letter, CV, and SOP to <span className="font-semibold text-white">serc.admin@iiit.ac.in</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={emailMailto}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-lg bg-[color:var(--primary-color)] text-white hover:bg-[color:var(--primary-color)]/95 font-semibold text-xs transition-colors"
                  >
                    <Mail size={14} />
                    <span>Apply via Email</span>
                  </a>
                  <a
                    href="/assets/Advt_JD_SERC_Ph.d.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-lg border border-white/15 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    <FileText size={14} className="text-[color:var(--success-color)]" />
                    <span>Download PDF Details</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
