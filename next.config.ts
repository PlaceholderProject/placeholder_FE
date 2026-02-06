import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/profile_images/**",
      },
      {
        protocol: "https",
        hostname: "placeholder-prod.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  serverExternalPackages: [],

  turbopack: {},

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  trailingSlash: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
