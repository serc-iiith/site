/**
 * Environment variables utility
 * Access environment variables with type safety and default values
 */

export const env = {
    // Site information
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://serc.iiit.ac.in',
    SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'SERC',

    // Analytics
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',

    // Node environment
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

    // Feature flags
    ENABLE_API: process.env.NEXT_PUBLIC_ENABLE_API === 'true',
};