import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set the project root explicitly for Turbopack
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

