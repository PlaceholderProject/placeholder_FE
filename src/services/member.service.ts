import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { Member } from "@/types/scheduleType";

export const getMeetupMembers = async (meetupId: number): Promise<Member[]> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/member`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("멤버 목록 가져오기 실패");
  }

  const data = await response.json();
  return data.result;
};

export const getMeetup = async (meetupId: number) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("모임 정보 가져오기 실패");
  }

  return await response.json();
};