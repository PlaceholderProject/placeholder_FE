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
      <div className="mx-auto mt-[2rem] w-[32.1rem] space-y-[0.5rem]">
        <div className="w-full">
          <div className="flex justify-start text-lg">{adData.adTitle}</div>
        </div>
        <div className="w-full">
          <div className="flex justify-end text-xs text-gray-medium">{adData.adEndedAt?.substring(0, 10)}까지 모집</div>
        </div>
      </div>
    </>
  );
};

export default AdSignboard;
