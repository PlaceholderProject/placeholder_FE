import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { Member } from "@/types/scheduleType";
import { HttpError } from "@/utils/httpError";

export const getMeetupMembers = async (meetupId: number): Promise<Member[]> => {
  if (!Number.isSafeInteger(meetupId) || meetupId <= 0) {
    throw new HttpError(404, "모임을 찾을 수 없습니다.");
  }

  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/member`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new HttpError(response.status, response.status === 404 ? "모임을 찾을 수 없습니다." : "멤버 목록을 불러오지 못했습니다.");
  }

  const data = await response.json();
  return data.result;
};

export const getMeetup = async (meetupId: number) => {
  if (!Number.isSafeInteger(meetupId) || meetupId <= 0) {
    throw new HttpError(404, "모임을 찾을 수 없습니다.");
  }

  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new HttpError(response.status, response.status === 404 ? "모임을 찾을 수 없습니다." : "모임 정보를 불러오지 못했습니다.");
  }

  return await response.json();
};
