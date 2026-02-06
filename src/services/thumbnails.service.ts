import { BASE_URL } from "@/constants/baseURL";
import { TypePurposeType, TypeRegionType, SortType } from "@/types/meetupType";
import Cookies from "js-cookie";
export const getHeadhuntingsApi = async ({ sortType, place, category }: { sortType: SortType; place?: TypeRegionType; category?: TypePurposeType }, page: number = 1, size: number = 10) => {
  const token = Cookies.get("accessToken");
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());

  let url = `${BASE_URL}/api/v1/meetup?sort=${sortType}&${queryParams.toString()}`;

  if (place) {
    url = url + `&place=${place}`;
  }

  if (category) {
    url = url + `&category=${category}`;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("광고글 목록 가져오기 실패");
  }
  const headhuntingsData = await response.json();
  return headhuntingsData;
};
export const getHeadhuntingItemApi = async (thumbnailId: number) => {
  const token = Cookies.get("accessToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("해당 id 광고아이템 가져오기 실패");
  }

  const headhuntingItemData = await response.json();

  return await headhuntingItemData;
};
