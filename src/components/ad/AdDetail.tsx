"use client";

import React, { useEffect, useState } from "react";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";

const AdDetail = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);
  const [isAuthorized, setIsAuthorized] = useState(false);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중...</div>;
  if (!adData) return null;

  const startedAt = adData.startedAt;
  const endedAt = adData.endedAt;

  const imageUrl = `${BASE_URL}${adData.image}`;

  return (
    <>
      <div>
        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        {/* <Image width={50} height={20} src={imageUrl} alt={"모임 광고글 이미지"} /> */}
        <img src={imageUrl} alt={"모임 광고글 이미지"} />

        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        <div>🩵 모임이름 : {adData.name}</div>

        {isAuthorized ?? <AdNonModal meetupId={meetupId} />}
        <div>
          🍎 모임장소 : [{adData.place}] {adData.placeDescription}
        </div>
        <div>
          모임날짜 : {startedAt === null ? "미정" : startedAt.substring(0, 10)} ~ {endedAt === null ? "미정" : endedAt.substring(0, 10)}
          <div>
            {startedAt && endedAt
              ? calculateDays({
                  startedAt: startedAt,
                  endedAt: endedAt,
                })
              : ""}
          </div>
          <br />
        </div>

        <div>{adData.description}</div>
      </div>
    </>
  );
};

export default AdDetail;
