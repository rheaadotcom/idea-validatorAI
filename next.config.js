/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Turbopack configuration for Next 16
  turbopack: {
    // Explicit root directory for Turbopack to resolve modules correctly
    root: __dirname,
  },
  // Packages that should be treated as external server modules
  serverExternalPackages: [],
};

module.exports = nextConfig;
