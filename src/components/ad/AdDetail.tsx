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
      <div className="mt-[1em] w-[34rem] space-y-[0.2rem]">
        <div className="flex justify-center">
          <Image src={imageUrl} alt="모임 광고글 이미지" width={321} height={209} className="w-[32.1rem] object-cover" />
        </div>
        <div className="mx-auto w-[32.1rem] px-[1.5rem] py-[2rem]">
          <div className="grid grid-cols-[25%_75%] items-center text-left">
            <div className="text-lg">모임이름</div>
            <div className="flex items-center justify-between text-base">
              <span>{adData.name}</span>
              {isAuthorized && <AdNonModal meetupId={meetupId} />}
            </div>
            <div className="text-lg">모임장소</div>{" "}
            <div className="text-base">
              [{adData.place}] {adData.placeDescription}
            </div>
            <div className="text-lg">모임날짜</div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex h-[2rem] w-[8rem] items-center justify-center rounded-[0.5rem] bg-gray-medium text-center">{startedAt === null ? "미정" : startedAt.substring(0, 10)}</div>~
              <div className="flex h-[2rem] w-[8rem] items-center justify-center rounded-[0.5rem] bg-gray-medium text-center">{endedAt === null ? "미정" : endedAt.substring(0, 10)}</div>
              <div>
                {startedAt && endedAt
                  ? calculateDays({
                      startedAt: startedAt,
                      endedAt: endedAt,
                    })
                  : ""}
              </div>
            </div>
            {/* <div>🗝️ 공개니???? : {`${adData.isPublic}`}</div> */}
          </div>
          <div className="pt-[2rem] text-base font-light">{adData.description}</div>
        </div>
      </div>
    </>
  );
};

export default AdDetail;
