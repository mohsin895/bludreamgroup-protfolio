/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bluedreamprotfolio.nelsistech.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
