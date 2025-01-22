import { BASE_URL } from "@/constants/baseURL";

// 광고 페이지 : 신청서 생성
export const createProposal = async (proposalText: string, meetupId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: proposalText }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.message);
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
