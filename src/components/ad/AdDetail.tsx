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
    const isMatch = organizerNickname === userNickname;
    setIsAuthorized(isMatch);
    console.log(`유즈 이펙트 안 : 방장 닉넴=${organizerNickname}. 유저 닉넴=${userNickname}, 같니?: ${isMatch}`);
  }, [adData, userNickname, organizerNickname]);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중...</div>;
  if (!adData) return null;

  const startedAt = adData.startedAt;
  const endedAt = adData.endedAt;

  const imageUrl = adData.image?.startsWith("http") ? adData.image : `${BASE_URL}/${adData.image}`;

  return (
    <>
      <div>
        <Image src={imageUrl} alt="모임 광고글 이미지" width={150} height={100} />
        <div className="text-lg">모임이름</div>
        <div className="text-base">{adData.name}</div>
        <div className="text-lg">모임장소</div>{" "}
        <div className="text-base">
          [{adData.place}] {adData.placeDescription}
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
        {isAuthorized && <AdNonModal meetupId={meetupId} />}
        {/* <div>🗝️ 공개니???? : {`${adData.isPublic}`}</div> */}
        <div className="text-base font-light">{adData.description}</div>
      </div>
    </>
  );
};

export default AdDetail;
