import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "bluedreamprotfolio.nelsistech.com",
                pathname: "/public/uploads/**",
            },
        ],
    },
};

export default nextConfig;