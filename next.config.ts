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

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false, // 타입 에러 무시하지 않음
  },

  // Next.js 15에서 변경된 설정 (experimental에서 최상위로 이동)
  serverExternalPackages: [], // 필요시 외부 패키지 추가

  // Next.js 16에서 Turbopack이 기본값이므로 명시해 webpack 커스텀과 충돌 경고를 해소
  turbopack: {},

  // 빌드 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 정적 파일 최적화
  trailingSlash: false,

  // 웹팩 설정 (클라이언트 빌드 오류 해결)
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
