import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains는 deprecated되었으므로 제거..하려 했으나
    // 호환성을 위해 domains도 유지
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/profile_images/**",
      },
      // 프로덕션 환경을 위한 도메인도 추가하는 것이 좋습니다
      {
        protocol: "https",
        hostname: "your-production-domain.com",
        pathname: "/media/profile_images/**",
      },
    ],
  },

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false, // 타입 에러 무시하지 않음
  },

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false, // 빌드 시 ESLint 에러 무시하지 않음
  },

  // Next.js 15에서 변경된 설정 (experimental에서 최상위로 이동)
  serverExternalPackages: [], // 필요시 외부 패키지 추가

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
