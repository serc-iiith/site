import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navbar: {
          bg: "var(--navbar-bg)",
          shadow: "var(--navbar-shadow)",
        },
        text: "var(--text-color)",
        accent: "var(--accent-color)",
        hover: "var(--hover-bg)",
        border: "var(--border-color)",
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
        success: "var(--success-color)",
        warning: "var(--warning-color)",
        error: "var(--error-color)",
        info: "var(--info-color)",
        test: "var(--test-color)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade': 'fade 1s ease-in-out',
        'slideDown': 'slideDown 0.5s ease-in-out',
        'bounce-slow': 'bounce-2px 3s ease-in-out infinite',
        'jiggle': 'jiggle 5s ease-in-out infinite',
        'card-border-path': 'card-border-path 12s linear infinite',
        'trail-1': 'trail-follow 12s linear infinite 0.1s',
        'trail-2': 'trail-follow 12s linear infinite 0.2s',
        'trail-3': 'trail-follow 12s linear infinite 0.3s',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-2px': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        jiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        'card-border-path': {
          '0%': { 'offset-distance': '0%' },
          '100%': { 'offset-distance': '100%' },
        },
        'trail-follow': {
          '0%': { 'offset-distance': '0%', opacity: '1' },
          '30%': { opacity: '1' },
          '60%': { opacity: '0' },
          '100%': { 'offset-distance': '100%', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;