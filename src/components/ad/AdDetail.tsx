"use client";

import React, { useEffect, useState } from "react";
import { getAdByIdApi } from "@/services/ad.service";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import { Meetup } from "@/types/meetupType";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";

const AdDetail = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);

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

        <AdNonModal meetupId={meetupId} />
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
          🐥🐥🐥🐥 날짜 계산 함수가 실행이 된다는 것 자체가 미정이 하나도 없단 뜻이고 day냐 days냐는 함수자체에서 판단해주면 된다고 생각해,, 맞지..?🐥🐥
        </div>

        <div>{adData.description}</div>
      </div>
    </>
  );
};

export default AdDetail;
