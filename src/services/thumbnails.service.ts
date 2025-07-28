import { BASE_URL } from "@/constants/baseURL";
import { TypePurposeType, TypeRegionType, SortType } from "@/types/meetupType";
import Cookies from "js-cookie";

// --TODO--
// meeups, ads, thumbnails
// id 해당 meetup or ad or thumbnail,
// 가져오는 함수들 다른 service.ts에 같은 url, 다른 이름으로 중복 로직 있음

// meetups(headhuntings) 광고글 전부 가져오는 api
// sortType을 기본 파라미터로 받아 정렬되고 있음
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

  // 헤더 객체를 로그인 여부 조건부로 구성하기
  // 새삼 헤더도 객체지..
  // headers: {}임. 당연함.

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  //토큰 있을 때만 헤더 추가
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  if (!response.ok) {
    throw new Error("광고글 목록 가져오기 실패");
  }
  const headhuntingsData = await response.json();
  console.log(`🙀API 호출 경로: ${url}`);
  console.log("🙀API 전체 응답 데이터:", headhuntingsData);
  console.log("🙀응답 데이터 개수:", headhuntingsData.result?.length);

  return headhuntingsData;
};

// (headhuntingItem) 광고글 하나 데이터 가져오기 api
export const getHeadhuntingItemApi = async (thumbnailId: number) => {
  const token = Cookies.get("accessToken");
  // 헤더 객체를 조건부로 구성
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 토큰이 있을 때만 Authorization 헤더 추가
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

  // console.log("아이템 하나 데이터:", headhuntingItemData);

  return await headhuntingItemData;
};
