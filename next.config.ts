import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http", // ✅ FIXED
                hostname: "localhost",
                pathname: "/**", // ✅ allow all paths
            },
        ],
    },
};

export default nextConfig;