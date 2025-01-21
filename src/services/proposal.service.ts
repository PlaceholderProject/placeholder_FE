import { BASE_URL } from "@/constants/baseURL";

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
