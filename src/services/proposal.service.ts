import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

// 광고 페이지 : 신청서 생성
export const createProposal = async (proposalText: string, meetupId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/proposal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: proposalText }),
    });

    if (!response.ok) {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const errorResult = await response.json();
        alert(errorResult.message);
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
      return;
    }

    const result = response.status;

    return result;
  } catch (error) {
    console.log(error);
    alert("신청서를 보내는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
};

// 받은 신청서 페이지 : 받은 신청서 가져오기
export const getReceivedProposal = async () => {};

// 보낸 신청서 페이지 : 보낸 신청서 가져오기
export const getSentProposal = async () => {};
