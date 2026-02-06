import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
export const toggleLikeApi = async (thumbnailId: number, currentIsLike: boolean) => {
  const token = Cookies.get("accessToken");

  const newIsLike = !currentIsLike;
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      isLike: newIsLike,
    }),
  });
  if (!response.ok) {
    throw new Error(`좋아요 토글 실패: ${response.status}`);
  }
  const contentLength = response.headers.get("content-length");
  let responseData = null;

  if (contentLength && contentLength !== "0") {
    try {
      responseData = await response.json();
    } catch (error) {
    }
  } else {
  }
  return {
    success: true,
  };
};
