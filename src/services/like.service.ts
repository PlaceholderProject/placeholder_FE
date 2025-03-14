import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

// 좋아요 토글 api 수정 후
export const toggleLikeApi = async (thumbnailId: number, isLike: boolean) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      isLike: !isLike,
    }),
  });

  if (!response.ok) {
    throw new Error(`좋아요 토글 실패: ${response.status}`);
  }

  return true;
};
