import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the project root. Turbopack otherwise infers it from the nearest
    // lockfile, and a stray package-lock.json in the user's home directory
    // makes that inference wrong.
    root: import.meta.dirname,
  },
};

export default nextConfig;
