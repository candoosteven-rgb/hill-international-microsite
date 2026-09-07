import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export: the app has no API routes or server actions, so it
  // ships as plain HTML/CSS/JS that Cloudflare Pages/Workers can serve directly.
  output: "export",
};

export default nextConfig;
