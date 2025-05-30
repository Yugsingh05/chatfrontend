import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images : {
    domains: [
      "lh3.googleusercontent.com",
      "cdn.pixabay.com",
      "localhost",
      "chatserver-production-4988.up.railway.app"
    ]
  }

};

export default nextConfig;
