import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "example.com",
      "https://api.dicebear.com",
      "api.dicebear.com",
      "plus.unsplash.com",
      "https://www.pexels.com",
      "www.pexels.com",
      "images.pexels.com"
    ],
  },
};

export default nextConfig;
