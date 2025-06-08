import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

// --TODO--
// meeups, ads, thumbnails
// id 해당 meetup or ad or thumbnail,
// 가져오는 함수들 다른 service.ts에 같은 url, 다른 이름으로 중복 로직 있음

export const getAdByIdApi = async (meetupId: number) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
