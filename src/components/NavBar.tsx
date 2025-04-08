"use client"

// TODO: Changing of Software Research Centre to SERC not proper (zooming garbages it)

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Menu, Sun, Moon, Monitor } from 'lucide-react';
import Link from 'next/link';
import SearchModal from './SearchModal';
import { useTheme } from '@/lib/ThemeProvider';

const Navbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);

    // Function to close the mobile menu with animation
    const closeMobileMenu = () => {
        setIsClosing(true);
        // Wait for animation to complete before hiding
        setTimeout(() => {
            setMobileMenuOpen(false);
            setIsClosing(false);
        }, 300); // Match this duration with CSS transition
    };

    // Function to handle menu opening with animation
    const openMobileMenu = () => {
        // Set state for opening the menu
        setMobileMenuOpen(true);
    };

    // Function to handle search click
    const handleSearchClick = () => {
        closeMobileMenu();
        setSearchModalOpen(true);
    };

    // Handle theme selection
    const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'system') => {
        setTheme(selectedTheme);
        setThemeMenuOpen(false);
    };

    // Get theme icon based on current theme
    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun size={18} className="text-text" />;
            case 'dark':
                return <Moon size={18} className="text-text" />;
            default:
                return <Monitor size={18} className="text-text" />;
        }
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (themeMenuOpen && !target.closest('.theme-selector')) {
                setThemeMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [themeMenuOpen]);

    // Close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 800 && mobileMenuOpen) {
                setMobileMenuOpen(false);
                setIsClosing(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileMenuOpen]);

    // Handle keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Mac') !== -1;

            // Check for Cmd+K on Mac or Ctrl+K on other platforms
            if ((isMac && e.metaKey && e.key === 'k') || (!isMac && e.ctrlKey && e.key === 'k')) {
                e.preventDefault(); // Prevent default browser behavior
                setSearchModalOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <div className="flex justify-between items-center bg-[var(--navbar-bg)] backdrop-blur-[30px] px-8 h-[70px] fixed top-0 left-0 right-0 z-[1001] shadow-[var(--navbar-shadow)] border-b border-[var(--border-color)]">
                <div className="text-2xl text-text tracking-wide">
                    <Link href="/" className="flex items-center gap-3 no-underline text-text" onClick={closeMobileMenu}>
                        <Image src="/images/logo.png" width={80} height={80} alt="SERC Logo" />
                        <div className="hidden sm:flex flex-col justify-center">
                            <span className="hidden xs:hidden sm:block md:hidden lg:hidden xl:block font-black text-2xl text-text leading-tight">Software Engineering Research Center</span>
                            <span className="block xs:block sm:hidden md:block lg:block xl:hidden font-black text-2xl text-text leading-tight">SERC</span>
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu Dropdown */}
                {(mobileMenuOpen || isClosing) && (
                    <div
                        className={`absolute top-[70px] left-0 right-0 bg-[var(--background)] shadow-lg border-t border-[var(--border-color)] flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${isClosing
                            ? 'max-h-0 opacity-0 -translate-y-4'
                            : 'max-h-[80vh] opacity-100 translate-y-0'
                            }`}
                        style={{
                            maxHeight: mobileMenuOpen && !isClosing ? '80vh' : '0',
                            transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-8px)',
                        }}
                    >
                        <div className="py-2 overflow-y-auto max-h-[calc(80vh-4px)] pb-safe">
                            <Link href="/research"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[100ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '100ms'
                                }}
                                onClick={closeMobileMenu}>
                                Research
                            </Link>
                            <Link href="/projects"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[150ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '150ms'
                                }}
                                onClick={closeMobileMenu}>
                                Projects
                            </Link>
                            <Link href="/collaborators"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[200ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '200ms'
                                }}
                                onClick={closeMobileMenu}>
                                Collaborators
                            </Link>
                            <Link href="/blog"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[250ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '250ms'
                                }}
                                onClick={closeMobileMenu}>
                                Blog
                            </Link>
                            <Link href="/events"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[300ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '300ms'
                                }}
                                onClick={closeMobileMenu}>
                                Events
                            </Link>
                            <Link href="/people"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[350ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '350ms'
                                }}
                                onClick={closeMobileMenu}>
                                People
                            </Link>
                            <Link href="/contact"
                                className={`block px-8 py-3 hover:bg-hover text-text text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[400ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '400ms'
                                }}
                                onClick={closeMobileMenu}>
                                Contact Us
                            </Link>
                            <div
                                onClick={handleSearchClick}
                                className={`flex items-center px-8 py-3 hover:bg-hover text-text cursor-pointer text-lg transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[450ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '450ms'
                                }}
                            >
                                <Search className="mr-2 hover:bg-hover text-text" size={18} />
                                Search
                            </div>

                            {/* Theme selector for mobile with animation */}
                            <div
                                className={`px-8 py-3 transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 delay-[500ms]'}`}
                                style={{
                                    opacity: mobileMenuOpen && !isClosing ? 1 : 0,
                                    transform: mobileMenuOpen && !isClosing ? 'translateY(0)' : 'translateY(-10px)',
                                    transitionDelay: '500ms'
                                }}
                            >
                                <div className="text-text text-lg font-medium mb-3 flex items-center">
                                    <span className="mr-2">Theme</span>
                                    <div className="h-px flex-grow bg-[var(--border-color)]"></div>
                                </div>
                                <div className="flex text-text flex-col gap-2 px-1">
                                    <button
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all duration-200
                                            ${theme === 'system'
                                                ? 'bg-[var(--accent-color)] bg-opacity-10 text-white font-medium shadow-sm border border-[var(--accent-color)] border-opacity-30'
                                                : 'hover:bg-hover border border-transparent'}`}
                                        onClick={() => handleThemeChange('system')}
                                    >
                                        <Monitor size={18} className={theme === 'system' ? 'text-white' : 'text-text'} />
                                        System
                                        {theme === 'system' && (
                                            <span className="ml-auto bg-white w-2 h-2 rounded-full"></span>
                                        )}
                                    </button>
                                    <button
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all duration-200
                                            ${theme === 'light'
                                                ? 'bg-[var(--accent-color)] bg-opacity-10 text-white font-medium shadow-sm border border-[var(--accent-color)] border-opacity-30'
                                                : 'hover:bg-hover border border-transparent'}`}
                                        onClick={() => handleThemeChange('light')}
                                    >
                                        <Sun size={18} className={theme === 'light' ? 'text-white' : 'text-text'} />
                                        Light
                                        {theme === 'light' && (
                                            <span className="ml-auto bg-white w-2 h-2 rounded-full"></span>
                                        )}
                                    </button>
                                    <button
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all duration-200
                                            ${theme === 'dark'
                                                ? 'bg-[var(--accent-color)] bg-opacity-10 text-white font-medium shadow-sm border border-[var(--accent-color)] border-opacity-30'
                                                : 'hover:bg-hover border border-transparent'}`}
                                        onClick={() => handleThemeChange('dark')}
                                    >
                                        <Moon size={18} className={theme === 'dark' ? 'text-white' : 'text-text'} />
                                        Dark
                                        {theme === 'dark' && (
                                            <span className="ml-auto bg-white w-2 h-2 rounded-full"></span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="lg:hidden relative">
                    {/* Mobile Menu Button - now visible below 900px */}
                    <button
                        className="text-2xl cursor-pointer text-text p-2"
                        onClick={() => isClosing ? null : (mobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="hidden lg:flex items-center gap-6">
                    <Link href="/research" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        Research
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>
                    <Link href="/projects" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        Projects
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>
                    <Link href="/collaborators" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        Collaborators
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>
                    <Link href="/blog" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        Blog
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>
                    <Link href="/events" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        Events
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>
                    <Link href="/people" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        People
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>
                    <Link href="/contact" className="group relative py-2 pl-0 font-medium text-text hover:text-accent transition-colors duration-200">
                        Contact
                        <span className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-width duration-300"></span>
                    </Link>

                    <div
                        className="flex items-center bg-hover rounded-lg px-3 py-2 gap-3 cursor-pointer border border-[var(--border-color)] transition-all duration-200 hover:bg-black/5"
                        onClick={() => setSearchModalOpen(true)}
                    >
                        <Search className="text-text" size={18} />
                        <span className="text-text mr-5">Search</span>
                        <div className="flex items-center text-xs py-0.5 px-1.5 rounded border border-[var(--border-color)] hover:bg-hover text-text ">
                            {typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Mac') !== -1 ? '⌘K' : 'Ctrl+K'}
                        </div>
                    </div>

                    {/* Theme selector for desktop */}
                    <div className="relative theme-selector">
                        <button
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-hover border border-[var(--border-color)]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setThemeMenuOpen(!themeMenuOpen);
                            }}
                        >
                            {getThemeIcon()}
                        </button>

                        {themeMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 py-2 w-40 bg-[var(--background)] rounded-md shadow-lg border border-[var(--border-color)] z-50 animate-fadeIn">
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 w-full text-left ${theme === 'system' ? 'text-[var(--accent-color)]' : 'text-text'}`}
                                    onClick={() => handleThemeChange('system')}
                                >
                                    <Monitor size={16} />
                                    System
                                </button>
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 w-full text-left ${theme === 'light' ? 'text-[var(--accent-color)]' : 'text-text'}`}
                                    onClick={() => handleThemeChange('light')}
                                >
                                    <Sun size={16} />
                                    Light
                                </button>
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 w-full text-left ${theme === 'dark' ? 'text-[var(--accent-color)]' : 'text-text'}`}
                                    onClick={() => handleThemeChange('dark')}
                                >
                                    <Moon size={16} />
                                    Dark
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal
                isOpen={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
            />
        </>
    );
};

export default Navbar;