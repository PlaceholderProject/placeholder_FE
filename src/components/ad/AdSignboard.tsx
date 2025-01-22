"use client";

import React from "react";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

const AdSignboard = async ({ meetupId }: { meetupId: number }) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log("에러 뭐야:", error);
      throw new Error("해당 id 모임 가져오기 실패");
    }

    const meetupAsAd = await response.json();
    console.log(meetupAsAd);

    return (
      <>
        <div>
          <h4>사인보드</h4>
          <div>{meetupAsAd.adTitle}</div>
          <div>{meetupAsAd.adEndedAt.substring(0, 10)}까지 모집</div>
          <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        </div>
      </>
    );
  } catch (error) {
    return <div>에러 발생: {error.message}</div>;
  }
};

export default AdSignboard;
