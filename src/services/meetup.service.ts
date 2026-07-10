import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";
import { FileType, Meetup, NewMeetup, S3PresignedResponse } from "@/types/meetupType";
import { HttpError } from "@/utils/httpError";

// 모임 생성 api
// export const createMeetupApi = async (meetupFormData: FormData): Promise<void> => {
//   const token = Cookies.get("accessToken");

//   //FormDAta 내용 확인
//   const response = await fetch(`${BASE_URL}/api/v1/meetup`, {
//     method: "POST",
//     headers: {
//       // ContentType: "multipart/formdata",
//       Authorization: `Bearer ${token}`,
//     },
//     body: meetupFormData,
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     await refreshToken();
//     throw new Error("모임 생성 실패");
//   }
//   const responseDataToCheck = await response.json();
//   return await responseDataToCheck;
// };

// 1️⃣ presigned URL 생성 주세요 api
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
    await refreshToken();
    throw new Error("Presigned URL 요청 실패");
  }
  const data: S3PresignedResponse = await response.json();

  return data;
};

// 3️⃣ 모임 생성 api 수정 후 ver
// 서버에 json으로 이미지를 ㅓㄴㅎ으려면, 이미 s3에 직접 ㅏ파일 업로드가 되고
// 그 url을 서버에 보내야겟지??
// 근데 유저입장에서는 제출하고 모든게 끝난거 같지만
// 사실 제출하고 나서 프리사인드받고 그 필드값 이용해서 s3에 업로드하고 그 링크를 받아서 제출이 완료된다는거

export const createMeetupApi = async (meetupData: NewMeetup, imageUrl: string) => {
  const token = Cookies.get("accessToken");
  const payload = {
    ...meetupData,
    image: imageUrl, //s3에 들어간 이미지 url
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

// --TODO--
// meeups, ads, thumbnails
// id 해당 meetup or ad or thumbnail,
// 가져오는 함수들 다른 service.ts에 같은 url, 다른 이름으로 중복 로직 있음

// id 해당 모임 get api
export const getMeetupByIdApi = async (meetupId: number) => {
  if (!Number.isSafeInteger(meetupId) || meetupId <= 0) {
    throw new HttpError(404, "모임을 찾을 수 없습니다.");
  }

  const token = Cookies.get("accessToken");

  //헤더 객체 조건부로
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  //토큰 있어야 헤더 추가
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new HttpError(response.status, response.status === 404 ? "모임을 찾을 수 없습니다." : "모임 정보를 불러오지 못했습니다.");
  }

  return response.json();
};

// 모임 수정 api
// export const editMeetupApi = async (meetupId: number, formData: FormData): Promise<void> => {
//   const token = Cookies.get("accessToken");
//   const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${token}` },
//     body: formData,
//   });
//   if (!response.ok) {
//     throw new Error("모임 수정 실패");
//   }

//   // 🚨🚨🚨🚨🚨서버 응답 형태 확인용 지금 date랑 checkbox 인풋만 수정이 안되거든요🚨🚨🚨🚨🚨
//   const responseData = await response.json();
//   return responseData;
//   return responseData;
// };

//모임 수정 api 수정 후 ver
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
