import { BASE_URL } from "@/constants/baseURL";

// 이미지 URL 생성 유틸리티 함수
export const getImageURL = (imagePath: string | null): string => {
  if (!imagePath) return "/profile.png"; // 기본 이미지 경로
  // 이미 http:// 또는 https://로 시작하는 전체 URL이면 그대로 사용
  if (imagePath.startsWith("http")) return imagePath;
  // 그렇지 않으면 BASE_URL과 결합
  return `${BASE_URL}${imagePath}`;
};