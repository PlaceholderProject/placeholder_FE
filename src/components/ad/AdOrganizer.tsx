"use client";

import React, { useEffect, useState } from "react";
import { getAdByIdApi } from "@/services/ad.service";
import { Meetup } from "@/types/meetupType";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";

const AdOrganizer = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중..</div>;
  if (!adData) return null;

  const profileImageUrl = `${BASE_URL}${adData.organizer.profileImage}`;

  return (
    <>
      <div>
        <h4>작성자: </h4>
        <div>{adData.organizer.nickname}</div>
        <img src={profileImageUrl} alt={"방장 프로필 사진"} />
      </div>
    </>
  );
};

export default AdOrganizer;
