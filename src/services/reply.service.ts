import { BASE_URL } from "@/constants/baseURL";
import { newReplyProps } from "@/types/replyType";
import Cookies from "js-cookie";
import { toast } from "sonner";
export const createReply = async (newReply: newReplyProps, meetupId: number) => {
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
      toast.error(errorResult.detail);
      return;
    }

    const result = response.status;
    toast.success("댓글이 등록되었습니다.");

    return result;
  } catch (error) {
    toast.error("댓글을 등록하지 못했습니다. 다시 시도해주세요.");
    return;
  }
};
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
      toast.error(errorResult.detail);
      return;
    }

    const result = response.status;
    toast.success("답글이 등록되었습니다.");

    return result;
  } catch (error) {
    toast.error("답글을 등록하지 못했습니다. 다시 시도해주세요.");
    return;
  }
};
export const getReply = async (meetupId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/comment`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorResult = await response.json();
      toast.error(errorResult.detail);
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};
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
      toast.error(errorResult.detail);
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};
export const deleteReply = async (replyId: number) => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/meetup-comment/${replyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const contentLength = response.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      return { message: "User delete successfully." };
    }

    toast.success("댓글이 삭제되었습니다.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("댓글 데이터 삭제 중 오류", error);
  }
};
