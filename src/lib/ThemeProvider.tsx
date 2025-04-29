"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
    children: React.ReactNode
}

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Script to be injected into <head> to prevent theme flash
const themeScript = `
  (function() {
    // Get stored theme from localStorage or default to system
    const storedTheme = localStorage.getItem('theme');
    
    // Remove any existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Apply the correct theme immediately
    if (storedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      // Handle system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme + '-theme');
    }
  })();
`;

export function ThemeProvider({ children }: ThemeProviderProps) {
    // Create script element for theme initialization
    useEffect(() => {
        // Add the theme script to prevent flashing
        if (!document.getElementById('theme-script')) {
            const script = document.createElement('script');
            script.id = 'theme-script';
            script.innerHTML = themeScript;
            document.head.appendChild(script);
        }
    }, []);

    const [theme, setTheme] = useState<Theme>('system')
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize theme from localStorage on component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null
        if (storedTheme) {
            setTheme(storedTheme)
        }
        setIsInitialized(true)
    }, [])

    // Apply theme changes
    useEffect(() => {
        // Skip first render to avoid flash
        if (!isInitialized) return;

        const root = document.documentElement

        // Remove any existing theme classes
        root.classList.remove('light-theme', 'dark-theme')

        // Handle system theme
        if (theme === 'system') {
            localStorage.removeItem('theme')
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.add(`${systemTheme}-theme`)
            return
        }

        // Handle manual theme selection
        root.classList.add(`${theme}-theme`)
        localStorage.setItem('theme', theme)
    }, [theme, isInitialized])

    // Listen for system theme changes when in system mode
    useEffect(() => {
        if (!isInitialized || theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            const systemTheme = mediaQuery.matches ? 'dark' : 'light'
            document.documentElement.classList.remove('light-theme', 'dark-theme')
            document.documentElement.classList.add(`${systemTheme}-theme`)
        }

        mediaQuery.addEventListener('change', handleChange)

        // Initial setup
        handleChange()

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, isInitialized])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}