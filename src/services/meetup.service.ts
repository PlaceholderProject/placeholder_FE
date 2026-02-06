import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";
import { FileType, Meetup, NewMeetup, S3PresignedResponse } from "@/types/meetupType";
export const getMeetupPresignedUrl = async (filetype: FileType): Promise<S3PresignedResponse> => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup/presigned-url?filetype=${filetype}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    await refreshToken();
    throw new Error("Presigned URL ㅇ청 실패");
  }
  const data: S3PresignedResponse = await response.json();
  return data;
};

export const createMeetupApi = async (meetupData: NewMeetup, imageUrl: string) => {
  const token = Cookies.get("accessToken");
  const payload = {
    ...meetupData,
    image: imageUrl,
  };

  const response = await fetch(`${BASE_URL}/api/v1/meetup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("모임 생성 오류");
  }
  const data = await response.json();
  return data;
};
export const getMeetupByIdApi = async (meetupId: number) => {
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

  const url = `${BASE_URL}/api/v1/meetup/${meetupId}`;
  if (!response.ok) {
    console.error("가져오기 실패: ", response.status, response.statusText);
    throw new Error("해당 id 모임 가져오기 실패");
  }

  const meetupByIdData = await response.json();

  return meetupByIdData;
};
export const editMeetupApi = async (meetupData: Meetup, imageUrl: string, meetupId: number) => {
  const token = Cookies.get("accessToken");
  const payload = {
    ...meetupData,
    image: imageUrl,
  };

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("모임 수정 오류");
  }
  const data = await response.json();
  return data;
};
