import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build a fully static site into /out, ready to upload to S3 and serve through CloudFront.
  output: "export",
  // Export pages as folder/index.html (e.g. /privacy/index.html) so clean URLs map onto
  // files with the small CloudFront Function in the README.
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
