import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
export interface PresignedUrlData {
  url: string;
  fields: {
    "Content-Type": string;
    success_action_status: string;
    key: string;
    "x-amz-algorithm": string;
    "x-amz-credential": string;
    "x-amz-date": string;
    policy: string;
    "x-amz-signature": string;
  };
}


export const getPresignedUrls = async (fileTypes: string[], target: "user" | "schedule" | "meetup"): Promise<PresignedUrlData[]> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  const fileTypeParam = encodeURIComponent(fileTypes.join(","));
  const path = `api/v1/${target}/presigned-url`;
  const requestUrl = `${BASE_URL}/${path}?filetype=${fileTypeParam}`;
  try {
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Presigned URL을 받아오는데 실패했습니다.");
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("getPresignedUrls 함수 에러:", error);
    throw error;
  }
};


export const uploadImageToS3 = async (url: string, fields: PresignedUrlData["fields"], file: File) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("S3 Upload Error Response:", errorText);
    throw new Error("S3 이미지 업로드에 실패했습니다.");
  }

  return fields.key;
};
