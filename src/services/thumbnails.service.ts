import { BASE_URL } from "@/constants/baseURL";
import { SortType } from "@/types/meetupType";
import Cookies from "js-cookie";

// --TODO--
// meeups, ads, thumbnails
// id 해당 meetup or ad or thumbnail,
// 가져오는 함수들 다른 service.ts에 같은 url, 다른 이름으로 중복 로직 있음

// meetups(headhuntings) 광고글 전부 가져오는 api
// sortType을 기본 파라미터로 받아 정렬되고 있음
export const getHeadhuntingsApi = async (sortType: SortType) => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup?sort=${sortType}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("광고글 목록 가져오기 실패");
  }
  const headhuntingsData = await response.json();
  console.log(`API 호출: ${BASE_URL}/api/v1/meetup?sort=${sortType}`);

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
