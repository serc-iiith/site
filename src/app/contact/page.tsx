"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { siYoutube, siFacebook, siX } from 'simple-icons/icons';
import { motion } from 'framer-motion';

// Import the Leaflet map component dynamically with no SSR
const Map = dynamic(
  () => import("@/components/Map"),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[color:var(--forecolor)] flex items-center justify-center">
      <p className="text-[color:var(--text-color)]">Loading map...</p>
    </div>
  }
);

export default function ContactPage() {
  // IIIT Hyderabad coordinates
  const position = [17.4457, 78.3488];

  return (
    <div className="min-h-screen bg-gradient-to-b pt-32 from-[color:var(--background)] to-[color:var(--foreground)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            If you have any queries or enquires, do send us a message!
          </p>
        </motion.div>

        {/* Contact Info & Map Section */}
        <section className="px-4">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Contact Information */}
            <div className="h-[600px] overflow-y-auto bg-[color:var(--background)] rounded-lg shadow-lg p-8 border border-[color:var(--border-color)]">
              <h2 className="text-2xl font-bold mt-6 mb-6 text-[color:var(--text-color)]">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-[color:var(--primary-color)] mr-4 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[color:var(--text-color)]">Email</h3>
                    <p className="text-[color:var(--secondary-color)]">
                      <a href="mailto:serc@iiit.ac.in" className="hover:text-[color:var(--primary-color)] transition-colors">
                        serc@iiit.ac.in
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-[color:var(--primary-color)] mr-4 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[color:var(--text-color)]">Address</h3>
                    <p className="text-[color:var(--secondary-color)]">
                      IIIT Hyderabad Campus, Prof. C R Rao Road, Hyderabad, Telangana 500032
                    </p>
                    <p className="text-[color:var(--secondary-color)] mt-2">
                      <strong>Directions:</strong> Enter Himalaya Block D, and use the elevator to get to the 5th floor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-[color:var(--primary-color)] mr-4 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[color:var(--text-color)]">Working Hours</h3>
                    <p className="text-[color:var(--secondary-color)]">Monday - Saturday, 09:00 to 17:00</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[color:var(--text-color)] mt-12 mb-3">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.linkedin.com/company/serciiith/" target="_blank" rel="noreferrer"
                      className="bg-[color:var(--foreground)] hover:bg-[color:var(--info-color)]/10 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/@serc-iiith8746" target="_blank" rel="noreferrer"
                      className="bg-[color:var(--foreground)] hover:bg-[color:var(--error-color)]/10 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                        <path d={siYoutube.path} />
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/SERC.IIITH/" target="_blank" rel="noreferrer"
                      className="bg-[color:var(--foreground)] hover:bg-[color:var(--info-color)]/10 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                        <path d={siFacebook.path} />
                      </svg>
                    </a>
                    <a href="https://x.com/SERC_IIITH" target="_blank" rel="noreferrer"
                      className="bg-[color:var(--foreground)] hover:bg-[color:var(--hover-bg)] p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
                        <path d={siX.path} />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[300px] md:h-[600px] rounded-lg shadow-lg overflow-hidden border border-[color:var(--border-color)]">
              <Map position={position} />
              <div className="text-xs text-[color:var(--tertiary-color)] text-center mt-1 bg-[color:var(--background)]">
                Leaflet | © OpenStreetMap
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}