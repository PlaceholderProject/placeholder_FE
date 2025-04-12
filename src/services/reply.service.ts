import { BASE_URL } from "@/constants/baseURL";
import { newReplyProps } from "@/types/replyType";
import Cookies from "js-cookie";

// create reply
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

// create nested reply

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
