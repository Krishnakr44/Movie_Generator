import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Don't bundle these: they use __dirname for .afm font files and fail when bundled
    serverComponentsExternalPackages: ["mongoose", "pdfkit", "fontkit"],
  },
  webpack: (config) => {
    // Workaround: Next.js edge runtime expects next-response as separate module
    const stubPath = path.join(__dirname, "lib", "next-response-stub.js");
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/dist/server/web/exports/next-response": stubPath,
    };
    return config;
  },
};

export default nextConfig;
