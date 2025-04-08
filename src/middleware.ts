import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Add security headers
    const securityHeaders = [
        {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
        },
        {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
        },
        {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
        },
        {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
        },
        {
            key: 'Content-Security-Policy',
            value: `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://*.vercel-insights.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://upload.wikimedia.org;
        font-src 'self' data:;
        connect-src 'self' https://*.vercel-insights.com;
        media-src 'self';
        frame-src https://www.youtube.com;
      `.replace(/\s{2,}/g, ' ').trim(),
        }
    ];

    securityHeaders.forEach((header) => {
        if (!response.headers.has(header.key)) {
            response.headers.set(header.key, header.value);
        }
    });

    return response;
}