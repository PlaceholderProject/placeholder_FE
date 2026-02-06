import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

export const getAdByIdApi = async (meetupId: number) => {
  const token = Cookies.get("accessToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
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
  return AdByIdData;
};
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
