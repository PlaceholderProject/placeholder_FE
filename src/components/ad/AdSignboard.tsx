"use client";

import React, { useEffect, useState } from "react";
import { getAdByIdApi } from "@/services/ad.service";
import { Meetup } from "@/types/meetupType";

const AdSignboard = ({ meetupId }: { meetupId: number }) => {
  const [adData, setAdData] = useState<Meetup>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAd = async () => {
      try {
        const data = await getAdByIdApi(meetupId);
        setAdData(data);
      } catch (error) {
        setError(error.message);
      }
    };
    getAd();
  }, [meetupId]);

  if (error) return <div>에러 발생: {error}</div>;
  if (!adData) return <div>로딩중...</div>;

  return (
    <>
      <div>
        <h4>사인보드</h4>
        <div>{adData.adTitle}</div>
        <div>{adData.adEndedAt?.substring(0, 10)}까지 모집</div>
        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
      </div>
    </>
  );
};

export default AdSignboard;
