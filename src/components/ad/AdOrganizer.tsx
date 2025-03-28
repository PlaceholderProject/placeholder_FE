"use client";

import React, { useEffect, useState } from "react";
import { getAdByIdApi } from "@/services/ad.service";
import { Meetup } from "@/types/meetupType";
import { BASE_URL } from "@/constants/baseURL";

const AdOrganizer = ({ meetupId }: { meetupId: number }) => {
  const [adData, setAdData] = useState<Meetup>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAd = async () => {
      try {
        const data = await getAdByIdApi(meetupId);
        // console.log("받아온 전체 데이터:", data); // 전체 데이터 구조 확인
        // console.log("방장 데이터:", data.organizer); // organizer 객체 구조 확인
        // console.log("프사 데이터:", data.organizer.profileImage);
        setAdData(data);
      } catch (error) {
        setError(error.message);
      }
    };
    getAd();
  }, [meetupId]);

  if (error) return <div>에러 발생: {error}</div>;
  if (!adData) return <div>로딩중...</div>;

  const profileImageUrl = `${BASE_URL}${adData.organizer.profileImage}`;

  return (
    <>
      <div>
        <h4>작성자: </h4>
        <div>{adData.organizer.nickname}</div>
        <img src={profileImageUrl} alt={"방장프사"} />
      </div>
    </>
  );
};

export default AdOrganizer;
