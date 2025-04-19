"use client";

import React, { useEffect, useState } from "react";

import { useAdItem } from "@/hooks/useAdItem";

const AdSignboard = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);

  if (error) return <div>에러 발생 : {error.message} </div>;
  if (isPending) return <div>로딩중...</div>;
  if (!adData) return null;

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
