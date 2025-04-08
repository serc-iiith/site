"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{
      background: `linear-gradient(to bottom right, var(--background), var(--foreground))`
    }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-extrabold mb-4" style={{ color: 'var(--primary-color)' }}>404</h1>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="h-1 w-24 mx-auto" style={{ 
              background: `linear-gradient(to right, var(--primary-color), var(--info-color))` 
            }}></div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Page Not Found!</h2>
          
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--secondary-color)' }}>
            Oopsie Woopsie! The code monkeys at our headquarters are working vewy hard to fix this!
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              style={{
                background: `linear-gradient(to right, var(--primary-color), var(--info-color))`
              }}
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
              Back to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Additional navigation suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-color)' }}>You might be looking for:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {["/projects", "/people", "/blog", "/events", "/research", "/contact"].map((path) => (
            <Link 
              key={path}
              href={path}
              className="px-4 py-2 border rounded-md transition"
              style={{
                background: 'var(--foreground)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--foreground)'}
            >
              {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}