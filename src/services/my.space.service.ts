import { BASE_URL } from "@/constants/baseURL";
import { MyAd, MyMeetup } from "@/types/mySpaceType";
import Cookies from "js-cookie";

// export const getMyMeetupsApi = async () => {
//   const token = Cookies.get("accessToken");
//   const response = await fetch(`${BASE_URL}/api/v1/user/me/meetup`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("내모임 가져오기 에러발생");
//   }

//   const myMeetupsData = await response.json();
//   return myMeetupsData.result;
// };

// 모임 공통 로직 재사용
export const getMyMeetups = async (status: string): Promise<MyMeetup[]> => {
  const token = Cookies.get("accessToken");
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("status", status);

    const response = await fetch(`${BASE_URL}/api/v1/user/me/meetup?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API 응답 온 status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`내모임 가져오기 에러 : ${response.status} 
        ${response.statusText}`);
    }

    const myMeetupsData = await response.json();
    return myMeetupsData.result;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};

// 현재 모임

export const getOngoingMyMeetupsApi = async () => {
  return getMyMeetups("ongoing");
};

// 과거 몽ㅁ
export const getEndedMyMeetupsApi = async () => {
  return getMyMeetups("ended");
};

// 광고 공통로직
export const getMyAds = async (status: string): Promise<MyAd[]> => {
  const token = Cookies.get("accessToken");

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("status", status);

    const response = await fetch(`${BASE_URL}/api/v1/user/me/ad?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`내 광고 가져오기 에러: ${response.status}`);
    }

    const myAdsData = await response.json();
    console.log("내광고 데이터", myAdsData);
    return myAdsData.result;
  } catch (error) {
    console.error("광고 api 호출 실패", error);
    throw error;
  }
};

// 현광고

export const getOngoingMyAdsApi = async () => {
  return getMyAds("ongoing");
};

// 지난광고

export const getEndedMyAdsApi = async () => {
  return getMyAds("ended");
};
