import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { getUser } from "./user.service";
import { toast } from "sonner";

// 개별 like 가져오는 api 임시
// export const getLikeByIdApi = async (thumbnailId: number) => {
//   const token = Cookies.get("accessToken");

//   const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}/like`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-type": "application/json",
//     },
//   });

//   return response.json();
// };

// like 토글 api
export const toggleLikeApi = async (thumbnailId: number, currentIsLike: boolean) => {
  const token = Cookies.get("accessToken");

  // 로그인하지 않은 유저는 좋아요 눌러도 소용없게
  const getUserResponse = await getUser();
  if (!getUserResponse) {
    // console.log("겟유저 리턴값은:", getUserResponse);

    toast.error("로그인한 유저만 좋아요를 누를 수 있습니다.");
    return;
  }

  const newIsLike = !currentIsLike;
  console.log("🔍 API 요청 - 현재 상태:", currentIsLike, "→ 새로운 상태:", newIsLike);

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
  // console.log("🔍 서버 응답 스테이터스:", response.status);
  // console.log("🔍 서버 응답 헤더:", response.headers);
  // console.log("🔍 Content-Length:", response.headers.get("content-length"));
  if (!response.ok) {
    throw new Error(`좋아요 토글 실패: ${response.status}`);
  }
  // 응답 바디 확인
  const contentLength = response.headers.get("content-length");
  let responseData = null;

  if (contentLength && contentLength !== "0") {
    try {
      responseData = await response.json();
      console.log("🔍 서버 응답 데이터:", responseData);
    } catch (error) {
      console.log("🔍 JSON 파싱 실패 (응답이 JSON이 아님):", error);
    }
  } else {
    console.log("🔍 서버 응답 바디 없음 (content-length: 0)");
  }

  // 현재는 서버에서 데이터를 안 보내주므로 성공 신호만 반환
  return {
    success: true,
  };
};
