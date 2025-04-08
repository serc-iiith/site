import Image from 'next/image';
import {
    siX,
    siYoutube,
    siFacebook
} from 'simple-icons/icons';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 py-8 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex flex-col md:flex-row md:justify-between gap-8">
                    <div>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 mb-6">
                            <div className="mb-4 sm:mb-0">
                                <Image src="/images/logo.png" width={100} height={100} alt="SERC Logo" />
                            </div>
                            <div className="flex flex-col text-base sm:text-lg text-gray-400">
                                <span className="font-semibold text-white mb-1">Software Engineering Research Center</span>
                                <span className="text-gray-300">IIIT Hyderabad</span>
                                <span className="text-gray-300">Telangana, India</span>
                                <a href="mailto:serc@iiit.ac.in" className="hover:text-blue-300 mt-1">
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="20" height="16" x="2" y="4" rx="2" />
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                        </svg>
                                        serc@iiit.ac.in
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-social self-center mb:4 md:self-start">
                        <h3 className="mb-6 text-lg text-white relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bottom-[-6px] after:left-0 after:bg-blue-400">
                            Follow Us
                        </h3>
                        <ul className="flex justify-center md:justify-start flex-wrap gap-6 p-0 list-none">
                            <li className="flex flex-col items-center text-center">
                                <a
                                    href="https://www.linkedin.com/company/serciiith/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-gray-300 hover:text-[#0077B5] transition-colors"
                                >
                                    <span className="mb-2">
                                        <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm">LinkedIn</span>
                                </a>
                            </li>
                            <li className="flex flex-col items-center text-center">
                                <a
                                    href="https://www.youtube.com/@serc-iiith8746"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-gray-300 hover:text-[#FF0000] transition-colors"
                                >
                                    <span className="mb-2">
                                        <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d={siYoutube.path} />
                                        </svg>
                                    </span>
                                    <span className="text-sm">YouTube</span>
                                </a>
                            </li>
                            <li className="flex flex-col items-center text-center">
                                <a
                                    href="https://www.facebook.com/SERC.IIITH/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-gray-300 hover:text-[#1877F2] transition-colors"
                                >
                                    <span className="mb-2">
                                        <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d={siFacebook.path} />
                                        </svg>
                                    </span>
                                    <span className="text-sm">Facebook</span>
                                </a>
                            </li>
                            <li className="flex flex-col items-center text-center">
                                <a
                                    href="https://x.com/SERC_IIITH"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-gray-300 hover:text-[#1DA1F2] transition-colors"
                                >
                                    <span className="mb-2">
                                        <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d={siX.path} />
                                        </svg>
                                    </span>
                                    <span className="text-sm">X (Twitter)</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-8 mt-4 border-t border-gray-700">
                    <p className="flex items-center justify-center mb-2 text-gray-300">
                        Made with <Heart className="mx-1 h-4 w-4 text-red-700 fill-red-600" /> by Arihant, Aviral and Mohit
                    </p>
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Software Engineering Research Center. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;