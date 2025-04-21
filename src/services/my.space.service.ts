import { BASE_URL } from "@/constants/baseURL";
import { MyAd, MyMeetup } from "@/types/mySpaceType";
import Cookies from "js-cookie";

// 모임 공통 로직 재사용
export const getMyMeetupsApi = async (status: string, page: number, size: number): Promise<MyMeetup[]> => {
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

// 모임 멤버 가져오기 Api
export const getMyMeetupMembersApi = async (meetupId: number) => {
  const token = Cookies.get("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/member`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    console.log("멤버 조회 실패");
    throw new Error("멤버 조회에 실패했습니다.");
  }
  console.log(response);
  return response.json();
};

//모임 멤버 삭제하기 Api

// export const deleteMeetupMemberApi = async(meetupId: number, memberId: number) => {
//   const token = Cookies.get("accessToken");
//   const response = await fetch(`${BASE_URL}/api/v1/meetup/`)
// }
