/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.remotePatterns", "img.youtube.com"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
