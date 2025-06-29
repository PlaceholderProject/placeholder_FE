"use client";

import React from "react";

import { useAdItem } from "@/hooks/useAdItem";

const AdSignboard = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);

  if (error) return <div>에러 발생 : {error.message} </div>;
  if (isPending) return <div>로딩중...</div>;
  if (!adData) return null;

  return (
    <>
      <div>
        <div className="text-lg">{adData.adTitle}</div>
        <div className="flex justify-end text-xs text-gray-medium">{adData.adEndedAt?.substring(0, 10)}까지 모집</div>
      </div>
    </>
  );
};

export default AdSignboard;
