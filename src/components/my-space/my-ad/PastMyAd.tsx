"use client";

import React, { useState } from "react";
import RoleIcon from "../my-meetup/RoleIcon";
import { useQuery } from "@tanstack/react-query";
import { getMyAdsApi } from "@/services/my.space.service";

const SIZE_LIMIT = 10;

const PastMyAd = () => {
  const [page, setPage] = useState(1);
  const [isOrganizer, setIsOrganizer] = useState(true);

  const {
    data: myAdsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myAds", "ended"],
    queryFn: () => getMyAdsApi("ended", page, SIZE_LIMIT),
  });

  if (isPending) return <div>로딩중..</div>;
  if (isError) return <div>에러: {error.message}</div>;
  if (!myAdsData || myAdsData.result.length === 0) return <div>지난 광고글이 없습니다.</div>;
  return (
    <>
      <div className="grid grid-cols-1">
        {myAdsData.result.map(myAd => (
          <div key={myAd.id} className="flex justify-between">
            <RoleIcon isOrganizer={isOrganizer} />
            광고글 이름: {myAd.ad_title} 광고종료일: {myAd.ad_ended_at}
          </div>
        ))}
      </div>
    </>
  );
};

export default PastMyAd;
