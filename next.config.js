/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";
const nextConfig = {
  basePath: isProduction ? "/yuanchenOAass" : "",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
