import { BASE_URL } from "@/constants/baseURL";
export const getImageURL = (imagePath: string | null): string => {
  if (!imagePath) return "/profile.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}/${imagePath}`;
};

export const getS3ImageURL = (s3Key: string | null): string => {
  if (!s3Key) return "/profile.png";
  if (s3Key.startsWith("http")) return s3Key;
  return `https://placeholder-prod.s3.amazonaws.com/${s3Key}`;
};
