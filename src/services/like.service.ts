import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

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
  // const getUserResponse = await getUser();
  // if (!getUserResponse) {

  //   alert("로그인한 유저만 좋아요를 누를 수 있습니다.");
  //   return;
  // }
  // toast.error("로그인한 유저만 좋아요를 누를 수 있습니다.");
  // return;

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
  // 응답 바디 확인
  const contentLength = response.headers.get("content-length");
  let responseData = null;

  if (contentLength && contentLength !== "0") {
    try {
      responseData = await response.json();
    } catch (error) {
    }
  } else {
  }

  // 현재는 서버에서 데이터를 안 보내주므로 성공 신호만 반환
  return {
    success: true,
  };
};
