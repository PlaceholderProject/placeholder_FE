import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

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
  console.log("가져온 데이터:", AdByIdData);
  console.log("Ad 타입 뭐야?", typeof AdByIdData.id);

  return AdByIdData;
};
