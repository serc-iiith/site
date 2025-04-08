import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SERC - Software Engineering Research Center',
        short_name: 'SERC',
        description: 'Software Engineering Research Center at IIIT-Hyderabad',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
            {
                src: '/icon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/images/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}