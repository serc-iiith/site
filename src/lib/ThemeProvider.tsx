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

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>('system')

    // Initialize theme from localStorage on component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null
        if (storedTheme) {
            setTheme(storedTheme)
        }
    }, [])

    // Apply theme changes
    useEffect(() => {
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
    }, [theme])

    // Listen for system theme changes when in system mode
    useEffect(() => {
        if (theme !== 'system') return

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
    }, [theme])

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