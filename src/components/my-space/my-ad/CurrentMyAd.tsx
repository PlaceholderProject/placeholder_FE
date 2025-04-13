"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getOngoingMyAdsApi } from "@/services/my.space.service";
import RoleIcon from "../my-meetup/RoleIcon";
import Link from "next/link";

const CurrentMyAd = () => {
  const [isOrganizer, setIsOrganizer] = useState(true);
  const {
    data: myAdsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myAds", "ongoing"],
    queryFn: getOngoingMyAdsApi,
  });

  console.log("광고글", myAdsData);

  if (isPending) return <div>로딩중..</div>;
  if (isError) return <div>에러: {error.message}</div>;
  if (!myAdsData || myAdsData.length === 0) return <div>현재 광고글이 없습니다.</div>;
  return (
    <>
      <div className="grid grid-cols-1">
        {myAdsData.map(myAd => (
          // --TO DO--
          // 해당 Id 광고페이지로 이동하게 링크 바꿔야함
          <Link href={`http://localhost:3000/ad/${myAd.id}`} key={myAd.id} className="flex justify-between">
            <RoleIcon isOrganizer={isOrganizer} />
            광고글 이름: {myAd.ad_title} 광고종료일: {myAd.ad_ended_at}
          </Link>
        ))}
      </div>
    </>
  );
};

export default CurrentMyAd;
