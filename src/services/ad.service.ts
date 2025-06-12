import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

// --TODO--
// meeups, ads, thumbnails
// id 해당 meetup or ad or thumbnail,
// 가져오는 함수들 다른 service.ts에 같은 url, 다른 이름으로 중복 로직 있음

export const getAdByIdApi = async (meetupId: number) => {
  const token = Cookies.get("accessToken");
  // 헤더 객체를 조건부로 구성
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 토큰이 있을 때만 Authorization 헤더 추가
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    console.error("가져오기 실패: ", response.status, response.statusText);
    throw new Error("해당 id 모임 가져오기 실패");
  }

  const AdByIdData = await response.json();
  console.log("광고에서 해당 id 모임 가져오기 성공 :", AdByIdData);
  // console.log("가져온 데이터:", AdByIdData);
  // console.log("Ad 타입 뭐야?", typeof AdByIdData.id);

  return AdByIdData;
};

// 광고글 삭제 함수
// --TO DO--
// 이거 ad.servie.ts 로 빼야됨
export const deleteAd = async ({ meetupId }: { meetupId: number }) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("광고글 삭제 실패: ", response.status, response.statusText);
    throw new Error("광고글 삭제에 실패했습니다.");
  }
};
