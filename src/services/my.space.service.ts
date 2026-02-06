import { BASE_URL } from "@/constants/baseURL";
import { MyAdsResponse, MyMeetupsResponse } from "@/types/mySpaceType";
import Cookies from "js-cookie";
export const getMyMeetupsApi = async (status: string, page: number, size: number): Promise<MyMeetupsResponse> => {
  const token = Cookies.get("accessToken");
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("status", status);
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());

    const response = await fetch(`${BASE_URL}/api/v1/user/me/meetup?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`내모임 가져오기 에러 : ${response.status} 
        ${response.statusText}`);
    }

    const myMeetupsData = await response.json();
    return myMeetupsData;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};
export const getMyAdsApi = async (status: string, page: number, size: number): Promise<MyAdsResponse> => {
  const token = Cookies.get("accessToken");

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("status", status);
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());

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
    return myAdsData;
  } catch (error) {
    console.error("광고 api 호출 실패", error);
    throw error;
  }
};
export const getMyMeetupMembersApi = async (meetupId: number | undefined) => {
  if (!meetupId) {
    throw new Error("meetupId is required");
  }

  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/member`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("내 모임 멤버 조회에 실패.");
  }

  const myMeetupMembersData = await response.json();
  if (myMeetupMembersData.result && myMeetupMembersData.result[0]) {
  }
  if (myMeetupMembersData.result && myMeetupMembersData.result[1]) {
  }
  return myMeetupMembersData;
};
export const deleteMeetupMemberApi = async (member_id: number) => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/member/${member_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
