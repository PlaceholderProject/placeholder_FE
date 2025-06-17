import { BASE_URL } from "@/constants/baseURL";
import React from "react";

const LikeTmp = () => {
  //광고글 하나의 좋아요 개수 가져오는 함수
  const getLikeCount = async (meetupId: number) => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`);
    const headhuntingData = await response.json();
    return headhuntingData.likeCount;
  };

  const getIsLike = async (meetupId: number, userNickname: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/nickname`);
    const headhuntingData = await response.json();
    // return headhuntingData.isLike;
    // 리턴하면 아래 바로 실해안되지 바보야

    if (response.status === 200) {
      return true;
    } else if (response.status === 404) {
      return false;
    } else {
      throw new Error("광고글의 like 여부 가져오기 실패");
    }
  };

  const likeHeadhunting = async (meetupId: number, userNickname: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/nickname`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${token}`,
      },
      // body: ?
      // MeetupForm 에는 있는 Authorization과 body가 코드잇에는 우선 없다
    });
    if (!response.ok) {
      throw new Error("광고글 좋아요 하기 실패");
    }
  };

  const unlikeHeadhunting = async (meetupId: number, userNickname: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/nickname`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("좋아요 취소하기 실패");
    }
  };
  return <div></div>;
};

export default LikeTmp;
