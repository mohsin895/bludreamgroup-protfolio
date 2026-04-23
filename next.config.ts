import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["localhost"], // ✅ allow local backend images
    },
};

export default nextConfig;


