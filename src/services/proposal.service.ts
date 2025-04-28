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
        Accept: "application/json",
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

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
    alert("신청서를 보내는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
};

// 받은 신청서 페이지 : 내가 방장인 모임 목록 가져오기
export const getOrganizedMeetups = async () => {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me/meetup?organizer=true`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const { result } = await response.json();
    console.log("내가 주최한 ongoing 모임 목록:", result);
    return result;
  } catch (error) {
    console.error("모임 정보를 가져오는데 실패했습니다:", error);
  }
};

// 받은 신청서 페이지 : 받은 신청서 가져오기
export const getReceivedProposals = async (meetupId: number) => {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/proposal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const { result } = await response.json();
    console.log("신청서 목록:", result);
    return result;
  } catch (error) {
    console.error("모임 정보를 가져오는데 실패했습니다:", error);
  }
};

// 받은 신청서 페이지 : 신청서 수락하기
export const acceptProposal = async (proposalId: number) => {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/proposal/${proposalId}/acceptance`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const result = await response.json();
    console.log("수락한 신청서:", result);
    return result;
  } catch (error) {
    console.error("신청서 수락을 실패했습니다:", error);
  }
};

// 받은 신청서 페이지 : 신청서 거절하기
export const refuseProposal = async (proposalId: number) => {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/proposal/${proposalId}/refuse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const result = await response.json();
    console.log("거절한 신청서:", result);
    return result;
  } catch (error) {
    console.error("신청서 거절을 실패했습니다:", error);
  }
};

// 보낸 신청서 페이지 : 보낸 신청서 가져오기
export const getSentProposal = async () => {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me/proposal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const { result } = await response.json();
    console.log("신청서 목록들:", result);
    return result;
  } catch (error) {
    console.error("모임 정보를 가져오는데 실패했습니다:", error);
  }
};

// 광고페이지 : 나의 신청서 상태

export const getMyProposalStatus = async (meetupId: number) => {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/proposal/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};
