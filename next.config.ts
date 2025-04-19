// 25.04.02 수정 전
// ⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
//next.config.ts 파일에서 domains 설정을 완전히 제거하고 remotePatterns만 사용하도록 수정해야 합니다.
// 경고 메시지는 domains 설정이 더 이상 권장되지 않는다는 내용이니까요.

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ["localhost"], // 또는 서버 도메인

//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8000",
//         pathname: "/media/profile_images/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

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
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**", // 다른 미디어 경로도 포함하려면
      },
    ],
  },
};
