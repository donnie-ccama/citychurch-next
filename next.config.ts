import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Kit pages are read from disk at request time, so ship them with the
  // server function. They are never placed in public/.
  outputFileTracingIncludes: {
    '/discipleship/*': ['./content/discipleship/**/*'],
    '/api/discipleship/booklet': ['./content/discipleship/**/*.pdf'],
  },
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
      {
        protocol: 'https',
        hostname: 'oykedxzykofrjvkbdckz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },
};

export default nextConfig;
