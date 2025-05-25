import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env  : {
    NEXT_PUBLIC_ZEGO_APP_ID:"18352097",
    NEXT_PUBLIC_ZEGO_SERVER_SECRET:"306a6d7ec40a3ca3b12758c70cdf82cb"

  },
  images : {
    domains: [
      "lh3.googleusercontent.com",
      "cdn.pixabay.com",
      "localhost"
    ]
  }

};

export default nextConfig;
