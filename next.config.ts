import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "cdn.wallip.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "twfhqhkpaaogtqvwllrk.supabase.co" },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
