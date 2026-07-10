import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 서버와 프로덕션 빌드가 동시에 실행되어도 manifest를 덮어쓰지 않도록 분리합니다.
  // yarn dev: .next-dev / yarn build: .next
  distDir: process.env.NEXT_DIST_DIR || ".next",

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeholder-prod.s3.amazonaws.com",
        pathname: "/**",
      },
      // 목업 데이터용 임시 이미지 (picsum.photos)
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      // 리디자인 목업용 임시 이미지 (Unsplash)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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

  // 서버 전용 패키지가 추가되면 이 목록에서 관리합니다.
  serverExternalPackages: [], // 필요시 외부 패키지 추가

  // 빌드 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 정적 파일 최적화
  trailingSlash: false,

};

export default nextConfig;
