import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: [
    "@flagix/react",
    "@flagix/js-sdk",
    "@flagix/evaluation-core",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "svgl.app",
      },
    ],
  },
};

export default nextConfig;
