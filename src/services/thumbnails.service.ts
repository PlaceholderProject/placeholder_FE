import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

// meetups(headhuntings) 광고글 전부 가져오는 api
export const getHeadhuntingsApi = async () => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("광고글 목록 가져오기 실패");
  }
  const headhuntingsData = await response.json();
  console.log("getHeadhuntingsApi실행!!!1 가져온 광고글 목록: ", headhuntingsData);
  return headhuntingsData;
};

// (headhuntingItem) 광고글 하나 데이터 가져오기 api
export const getHeadhuntingItemApi = async (thumbnailId: number) => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("해당 id 광고아이템 가져오기 실패");
  }

  const headhuntingItemData = await response.json();

  // console.log("아이템 하나 데이터:", headhuntingItemData);

  return await headhuntingItemData;
};
