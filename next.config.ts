import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains는 deprecated되었으므로 제거
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/profile_images/**",
      },
      // 프로덕션 환경을 위한 도메인도 추가하는 것이 좋습니다
      // {
      //   protocol: "https",
      //   hostname: "your-production-domain.com",
      //   pathname: "/media/profile_images/**",
      // },
    ],
  },
  // 빌드 오류 해결을 위한 추가 설정
  experimental: {
    serverComponentsExternalPackages: [], // 필요시 외부 패키지 추가
  },
  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false, // 타입 에러 무시하지 않음
  },
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false, // 빌드 시 ESLint 에러 무시하지 않음
  },
};

export default nextConfig;
