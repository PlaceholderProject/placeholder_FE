import { BASE_URL } from "@/constants/baseURL";
import { MyAdsResponse, MyMeetupsResponse } from "@/types/mySpaceType";
import Cookies from "js-cookie";

// 모임 공통 로직 재사용
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
    console.log("me 내공간 데이터:", myMeetupsData);
    return myMeetupsData;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};

// 우선 가져오는 기본 로직 있고
// 가져 오는 순간에 ongoing인지 ended인지 상태를 param으로 넣어서 가져옴
// ongoing의 isCurrent = true
// ended의 isCurrent = false
// 근데 가져온뒤에 시간이 지나면 걔가 ongoing에서 ended로 변하고
// 그걸 프론트에서 확인해서 컴포넌ㅌ트를 변경해줘야 함?
// 엥 그냥 도니ㅡㄴ데??????

// 현재 모임
// --TO DO-- param 동적으로 넣어줘야됨
// export const getOngoingMyMeetupsApi = async () => {
//   return getMyMeetupsApi();
// };

// 과거 모임
// --TO DO-- param 동적으로 넣어줘야됨
// export const getEndedMyMeetupsApi = async () => {
//   return getMyMeetupsApi("ended", "1", "10");
// };

// 광고 공통로직
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
    console.log("내광고 데이터", myAdsData);
    return myAdsData;
  } catch (error) {
    console.error("광고 api 호출 실패", error);
    throw error;
  }
};

// // 현광고
// export const getOngoingMyAdsApi = async () => {
//   return getMyAds("ongoing");
// };

// // 지난광고
// export const getEndedMyAdsApi = async () => {
//   return getMyAds("ended");
// };

// 모임 멤버 가져오기 Api
export const getMyMeetupMembersApi = async (meetupId: number | undefined) => {
  if (!meetupId) {
    throw new Error("meetupId is required");
  }

  console.log("=== API 호출 시작 ===");
  console.log("받은 meetupId:", meetupId);
  console.log("meetupId 타입:", typeof meetupId);
  console.log("meetupId 존재 여부:", !!meetupId);
  console.log("===================");

  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/member`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("멤버 조회 api 에러 응답", errorText);
    throw new Error("내 모임 멤버 조회에 실패.");
  }

  // 👇 실제 API 응답 구조 확인

  const myMeetupMembersData = await response.json();
  console.log("=== API 응답 데이터 ===");
  console.log("전체 응답:", myMeetupMembersData);
  console.log("result 배열:", myMeetupMembersData.result);
  if (myMeetupMembersData.result && myMeetupMembersData.result[0]) {
    console.log("첫 번째 멤버:", myMeetupMembersData.result[0]);
  }
  console.log("=====================");
  console.log("내공간 멤버 데이터:", myMeetupMembersData);
  console.log("내공간 멤버데이터 모임 아이디:", myMeetupMembersData.result[0].meetupId);
  console.log("내공간 멤버데이터 모임 - 유저 아이디:", myMeetupMembersData.result[0].user?.id);
  console.log("내공간 멤버데이터 모임 - 유저 닉네임:", myMeetupMembersData.result[0].user?.nickname);
  return myMeetupMembersData;
};

//모임 멤버 삭제하기 Api
export const deleteMeetupMemberApi = async (member_id: number) => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/member/${member_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
