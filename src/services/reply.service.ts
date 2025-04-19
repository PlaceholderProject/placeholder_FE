import { BASE_URL } from "@/constants/baseURL";
import { newReplyProps } from "@/types/replyType";
import Cookies from "js-cookie";

// create-reply
export const createReply = async (newReply: newReplyProps, meetupId: string | string[]) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReply),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail);
      return;
    }

    const result = response.status;
    alert("댓글이 등록되었습니다.");

    return result;
  } catch (error) {
    console.log(error);
    alert("댓글을 등록하지 못했습니다. 다시 시도해주세요.");
    return;
  }
};

// create-nested-reply
export const createNestedReply = async (newReply: newReplyProps, replyId: number) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup-comment/${replyId}/reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReply),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail);
      return;
    }

    const result = response.status;
    alert("답글이 등록되었습니다.");

    return result;
  } catch (error) {
    console.log(error);
    alert("답글을 등록하지 못했습니다. 다시 시도해주세요.");
    return;
  }
};

// read reply
export const getReply = async (meetupId: string | string[]) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/comment`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail);
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};

// update-reply
export const editReply = async (text: string, replyId: number) => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/meetup-comment/${replyId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail);
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};

// delete-reply
export const deleteReply = async (replyId: number) => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/meetup-comment/${replyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 응답 본문 확인
    const contentLength = response.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      return { message: "User delete successfully." }; // 기본 메시지
    }

    alert("댓글이 삭제되었습니다.");
    // JSON 형식으로 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("댓글 데이터 삭제 중 오류", error);
  }
};
