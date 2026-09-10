import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/',
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Images configuration
  images: {
    unoptimized: true,
  },
  // Static export for production (rsync'd to nginx). Set NEXT_DISABLE_EXPORT=1
  // for `next dev` when using the /admin dashboard, so the API route handlers
  // (POST/PUT/DELETE) run. The dashboard is dev-only and `npm run build`
  // strips it from the export regardless.
  output: process.env.NEXT_DISABLE_EXPORT ? undefined : 'export',
  trailingSlash: true,

  // Performance optimizations
  reactStrictMode: true,

  // For better debugging in production
  generateBuildId: async () => {
    return `build-${new Date().toISOString()}`;
  },
};

export default nextConfig;
