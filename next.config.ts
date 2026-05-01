import type { NextConfig } from "next";

const nextConfig = {
  // ...konfigurasi yang sudah ada...

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // untuk Server Actions
    },
  },
};

export default nextConfig;
