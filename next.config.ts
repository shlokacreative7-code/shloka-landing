import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build a fully static site into /out, deployed as Cloudflare Workers static assets (wrangler.jsonc).
  output: "export",
  // Export pages as folder/index.html (e.g. /privacy/index.html), which static hosts serve at clean URLs.
  trailingSlash: true,
  // The built-in image optimiser needs a server; static hosts serve images as-is.
  images: { unoptimized: true },
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;