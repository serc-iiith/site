"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
            style={{ background: `linear-gradient(to bottom right, var(--background), var(--foreground))` }}
        >
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-extrabold mb-4" style={{ color: "var(--error-color)" }}>
                        500
                    </h1>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative mb-8"
                    >
                        <div
                            className="h-1 w-24 mx-auto"
                            style={{ background: `linear-gradient(to right, var(--error-color), var(--warning-color))` }}
                        ></div>
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--text-color)" }}>
                        Something went wrong!
                    </h2>

                    <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--secondary-color)" }}>
                        Oopsie Woopsie! The code monkeys at our headquarters are working vewy hard to fix this!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                                style={{
                                    background: "var(--background)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-color)",
                                    border: "1px solid",
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

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            onClick={reset}
                            className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                            style={{ background: `linear-gradient(to right, var(--error-color), var(--warning-color))` }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Try Again
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}