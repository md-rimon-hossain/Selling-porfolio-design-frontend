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
      "images.pexels.com",
      "https://images.pexels.com",
      "images.unsplash.com",
      "https://images.unsplash.com",
      "avatars.dicebear.com",
      // OAuth Provider Images
      "lh3.googleusercontent.com", // Google profile images
      "avatars.githubusercontent.com", // GitHub profile images
      "scontent.fdac99-1.fna.fbcdn.net", // Facebook profile images
      "https://www.shutterstock.com"
    ],
  },
};

export default nextConfig;
