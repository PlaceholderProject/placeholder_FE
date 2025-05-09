import { BASE_URL } from "@/constants/baseURL";
import { newReplyProps } from "@/types/replyType";
import Cookies from "js-cookie";

// 스케줄 댓글 생성
export const createScheduleReply = async (newReply: newReplyProps, scheduleId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/schedule/${scheduleId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReply),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail || "댓글 등록에 실패했습니다.");
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("댓글 등록 중 오류:", error);
    alert("댓글을 등록하지 못했습니다. 다시 시도해주세요.");
    return;
  }
};

// 스케줄 댓글에 답글 생성
export const createScheduleNestedReply = async (newReply: newReplyProps, replyId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/schedule-comment/${replyId}/reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReply),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail || "답글 등록에 실패했습니다.");
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("답글 등록 중 오류:", error);
    alert("답글을 등록하지 못했습니다. 다시 시도해주세요.");
    return;
  }
};

// 스케줄 댓글 목록 조회
export const getScheduleReply = async (scheduleId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/schedule/${scheduleId}/comment`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorResult = await response.json();
      console.error("댓글 조회 실패:", errorResult);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("댓글 데이터 가져오기 오류:", error);
    return null;
  }
};

// 스케줄 댓글 수정
export const updateScheduleReply = async (text: string, replyId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/schedule-comment/${replyId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail || "댓글 수정에 실패했습니다.");
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("댓글 수정 중 오류:", error);
    alert("댓글을 수정하지 못했습니다. 다시 시도해주세요.");
    return null;
  }
};

// 스케줄 댓글 삭제
export const deleteScheduleReply = async (replyId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/schedule-comment/${replyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorResult = await response.json().catch(() => ({ message: "댓글 삭제에 실패했습니다." }));
      alert(errorResult.message || "댓글 삭제에 실패했습니다.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("댓글 삭제 중 오류:", error);
    alert("댓글을 삭제하지 못했습니다. 다시 시도해주세요.");
    return false;
  }
};