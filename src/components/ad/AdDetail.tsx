"use client";

import React, { useEffect, useState } from "react";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";
import Image from "next/image";

const AdDetail = ({ meetupId, userNickname }: { meetupId: number; userNickname: string }) => {
  const { adData, error, isPending } = useAdItem(meetupId);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const organizerNickname = adData?.organizer.nickname;

  useEffect(() => {
    if (organizerNickname === userNickname) {
      setIsAuthorized(true);
      console.log(`유즈 이펙트 안 트루냐? ${isAuthorized}`);
    } else {
      setIsAuthorized(false);
    }
  }, [adData, userNickname]);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중...</div>;
  if (!adData) return null;

  const startedAt = adData.startedAt;
  const endedAt = adData.endedAt;

  const imageUrl = `${BASE_URL}${adData.image}`;

  console.log("애드데이터?", adData);
  console.log(`유즈 이펙트 외부 트루냐? ${isAuthorized}`);

  return (
    <>
      <div>
        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        {/* <Image width={50} height={20} src={imageUrl} alt={"모임 광고글 이미지"} /> */}
        <Image src={imageUrl} alt="모임 광고글 이미지" width={150} height={100} />

        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        <div>🩵 모임이름 : {adData.name}</div>

        <div>방장이름:{adData.organizer.nickname}</div>
        {isAuthorized && <AdNonModal meetupId={meetupId} />}
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
