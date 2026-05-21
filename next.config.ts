/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "bluedreamprotfolio.nelsistech.com",
//         pathname: "/**",
//       },
//     ],
//   },
// };
//
// module.exports = nextConfig;
import type { NextConfig } from "next";

const config: NextConfig = {
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'admin.shopnillchowdhury.com',
                pathname: '/**',
            },
        ],
    },
};

export default config;