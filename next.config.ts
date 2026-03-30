import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "121bd99b-e7e4-4369-8203-5fddd6c80511-00-16pls4jlld4j5.janeway.replit.dev",
    "*.replit.dev",
    "*.repl.co",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
