/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Don't bundle these: they use __dirname for .afm font files and fail when bundled
    serverComponentsExternalPackages: ["mongoose", "pdfkit", "fontkit"],
  },
};

export default nextConfig;
