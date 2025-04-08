'use client'
 
export default function localImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    // Check if the src is a local path
    if (src.startsWith('/')) {
        // If it's a local path, return it as is
        return `${src}?w=${width}&q=${quality || 75}`
    }
    // For remote images, return the src as is
    return src
}