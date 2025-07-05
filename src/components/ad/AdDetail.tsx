"use client";

import React, { useEffect, useState } from "react";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import { BASE_URL } from "@/constants/baseURL";
import Image from "next/image";
import { Meetup } from "@/types/meetupType";

interface AdDetailProps {
  adData: Meetup;
  userNickname: string;
}

const AdDetail = ({ adData, userNickname }: AdDetailProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const organizerNickname = adData?.organizer.nickname;

  useEffect(() => {
    const isMatch = organizerNickname === userNickname;
    setIsAuthorized(isMatch);
    console.log(`유즈 이펙트 안 : 방장 닉넴=${organizerNickname}. 유저 닉넴=${userNickname}, 같니?: ${isMatch}`);
  }, [adData, userNickname, organizerNickname]);

  const startedAt = adData.startedAt;
  const endedAt = adData.endedAt;

  const imageUrl = adData.image?.startsWith("http") ? adData.image : `${BASE_URL}/${adData.image}`;

  return (
    <>
      <div className="mt-[1em] w-[95%] space-y-[0.2rem] md:max-w-[90rem]">
        <div className="flex justify-center">
          <Image src={imageUrl} alt="모임 광고글 이미지" width={321} height={209} className="w-full object-cover md:max-w-[80rem]" />
        </div>
        <div className="relative mx-auto w-[95%] px-[1.5rem] py-[2rem] md:max-w-[90rem]">
          <div className="grid grid-cols-[25%_75%] items-center text-left">
            <div className="text-lg">모임이름</div>
            <div className="flex items-center justify-between text-base">
              <span>{adData.name}</span>
              {isAuthorized && <AdNonModal meetupId={adData.id} />}
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
