import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export: the app has no API routes or server actions, so it
  // ships as plain HTML/CSS/JS that Cloudflare Pages/Workers can serve directly.
  output: "export",
  // Turbopack's automatic NEXT_PUBLIC_ substitution has proven unreliable in
  // this CI environment - it inlines correctly in some builds but falls back
  // to a runtime `process.env.X` property read (always empty in the browser)
  // in others, with no error either way. The `env` key below uses Next's
  // older, explicit DefinePlugin-style substitution instead, which replaces
  // this reference unconditionally at build time rather than relying on the
  // flaky NEXT_PUBLIC_ auto-detection.
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  },
};

export default nextConfig;
