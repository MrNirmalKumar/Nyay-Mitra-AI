/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  // Pre-warm all main pages so first navigation is instant
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
