import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";
import { FileType } from "@/types/meetupType";

// 모임 생성 api
export const createMeetupApi = async (meetupFormData: FormData): Promise<void> => {
  const token = Cookies.get("accessToken");

  //FormDAta 내용 확인
  console.log("FormData 페이로드:", JSON.parse(meetupFormData.get("payload") as string));
  const response = await fetch(`${BASE_URL}/api/v1/meetup`, {
    method: "POST",
    headers: {
      // ContentType: "multipart/formdata",
      Authorization: `Bearer ${token}`,
    },
    body: meetupFormData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    await refreshToken();
    console.log(errorText);
    throw new Error("모임 생성 실패");
  }
  const responseDataToCheck = await response.json();
  console.log("서버 응답 데이터 확인:", responseDataToCheck);
  return await responseDataToCheck;
};

// --TODO--
// meeups, ads, thumbnails
// id 해당 meetup or ad or thumbnail,
// 가져오는 함수들 다른 service.ts에 같은 url, 다른 이름으로 중복 로직 있음

// id 해당 모임 get api
export const getMeetupByIdApi = async (meetupId: number) => {
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
    console.error("가져오기 실패: ", response.status, response.statusText);
    throw new Error("해당 id 모임 가져오기 실패");
  }

  const meetupByIdData = await response.json();
  console.log("해당 id 모임 가져오기 성공", meetupByIdData);
  // console.log("json()하지 않은 해당 id 모임: ", response);
  // console.log("가져온 해당 id 모임:", meetupByIdData.json());
  // 아니 왜 콘솔에 .json() 넣으면 브라우저 에러 나는 것?
  // 안 그러다기???????????????

  // // 🫠🫠🫠🫠🫠🫠🫠🫠🫠 이거는 필요 없고 onSuccess에서 하면 됨 되는거야 마는거야 🫠🫠🫠🫠🫠🫠🫠 아마 안됨
  // setPreviewImage(`${meetupByIdData.image}`);

  // console.log("가져온 데이터: ", meetupByIdData);
  // console.log("meetupId 타입 뭐야?", typeof meetupByIdData.id);

  return meetupByIdData;
};

// 모임 수정 api
export const editMeetupApi = async (meetupId: number, formData: FormData): Promise<void> => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    throw new Error("모임 수정 실패");
  }

  // 🚨🚨🚨🚨🚨서버 응답 형태 확인용 지금 date랑 checkbox 인풋만 수정이 안되거든요🚨🚨🚨🚨🚨
  const responseData = await response.json();
  console.log("모임 수정 서버 응답:", responseData);
  return responseData;
};

// presigned URL 생성 api
export const getMeetupPresignedUrl = async (filetype: FileType) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/presigned-url?filetype=image/jpg`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Presigned URL ㅇ청 실패");
  }
  console.log("프리사인드 응답:", response);

  return await response.json();
};
