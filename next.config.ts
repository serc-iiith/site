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
  output: 'export',
  trailingSlash: true,

  // Performance optimizations
  reactStrictMode: true,

  // For better debugging in production
  generateBuildId: async () => {
    return `build-${new Date().toISOString()}`;
  },
};

export default nextConfig;