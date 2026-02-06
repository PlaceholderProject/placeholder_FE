import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { toast } from "sonner";
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
        toast.error(errorResult.message);
      } else {
        const errorText = await response.text();
        toast.error(errorText);
      }
      return;
    }

    const result = await response.json();

    return result;
  } catch (error) {
    toast.error("신청서를 보내는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
};
export const getOrganizedMeetups = async () => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me/meetup?organizer=true&status=ongoing`, {
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
    return result;
  } catch (error) {
    console.error("모임 정보를 가져오는데 실패했습니다:", error);
    return [];
  }
};
export const getReceivedProposals = async (meetupId: number, page: number) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return { proposals: [], total: 0 };
  const size = 5;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me/meetup/${meetupId}/proposal?page=${page}&size=${size}&status=pending`, {
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

    const data = await response.json();
    return { proposals: data.result, total: data.total };
  } catch (error) {
    console.error("모임 정보를 가져오는데 실패했습니다:", error);
    return { proposals: [], total: 0 };
  }
};
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
    return result;
  } catch (error) {
    console.error("신청서 수락을 실패했습니다:", error);
  }
};
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
    return result;
  } catch (error) {
    console.error("신청서 거절을 실패했습니다:", error);
  }
};
export const getSentProposal = async (page: number) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return { proposals: [], total: 0 };
  const size = 5;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me/proposal?page=${page}&size=${size}`, {
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

    const data = await response.json();

    return {
      proposals: data.result,
      total: data.total,
    };
  } catch (error) {
    console.error("모임 정보를 가져오는데 실패했습니다:", error);
    return { proposals: [], total: 0 };
  }
};
export const cancelProposal = async (proposalId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/proposal/${proposalId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.detail || "신청서 취소에 실패했습니다.");
    }
    const contentLength = response.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      console.warn("서버에서 빈 응답을 반환했습니다.");
      return { message: "Proposal canceled successfully." };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("신청서 취소 중 오류", error);
  }
};
export const hideProposal = async (proposalId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/proposal/${proposalId}/hide`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }
    return;
  } catch (error) {
    console.error("신청서 숨기기를 실패했습니다:", error);
  }
};
export const getMyProposalStatus = async (meetupId: number) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/proposal/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "알 수 없는 오류");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("상태를 가져오는데 실패했습니다:", error);
    return null;
  }
};
