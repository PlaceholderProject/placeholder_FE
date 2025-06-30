import { BASE_URL } from "@/constants/baseURL";

// 이미지 URL 생성 유틸리티 함수
export const getImageURL = (imagePath: string | null): string => {
  if (!imagePath) return "/profile.png"; // 기본 이미지 경로
  // 이미 http:// 또는 https://로 시작하는 전체 URL이면 그대로 사용
  if (imagePath.startsWith("http")) return imagePath;
  // 그렇지 않으면 BASE_URL과 결합
  return `${BASE_URL}/${imagePath}`;
};

export const getS3ImageURL = (s3Key: string | null): string => {
  if (!s3Key) return "/profile.png"; // 기본 이미지

  // 이미 전체 URL이면 그대로 반환
  if (s3Key.startsWith("http")) return s3Key;

  // S3 key를 전체 URL로 변환
  return `https://placeholder-prod.s3.amazonaws.com/${s3Key}`;
};
