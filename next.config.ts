import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Projektordner explizit festlegen – sonst greift Next.js auf eine
  // package-lock.json im Benutzerordner (C:\Users\domin) zurück.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
