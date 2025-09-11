"use client";

import React, { useEffect, useState } from "react";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import { BASE_URL } from "@/constants/baseURL";
import Image from "next/image";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";
import { useModal } from "@/hooks/useModal";

interface AdDetailProps {
  adData: Meetup;
  userNickname: string;
}

const AdDetail = ({ adData, userNickname }: AdDetailProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const organizerNickname = adData?.organizer.nickname;
  const { openModal } = useModal();

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
      <div className="mt-[1em] w-full space-y-[0.2rem] md:max-w-[90rem]">
        <div className="mx-auto flex justify-center">
          <Image unoptimized={true} src={imageUrl} alt="모임 광고글 이미지" width={321} height={209} className="mx-auto w-[95%] object-cover md:max-w-[80rem]" />
        </div>
        <div className="relative mx-auto w-[95%] md:max-w-[80rem]">
          <div className="ml-[1.5rem] mr-[1.5rem] mt-[2rem]">
            <div className="md:grid md:grid-cols-[90%_10%]">
              <div className="grid grid-cols-[25%_75%] items-center text-left md:grid-cols-[15%_45%]">
                <div className="text-lg">모임이름</div>
                <div className="flex items-center justify-between text-base md:grid-cols-2">
                  <div>{adData.name}</div>
                  <div className="md:hidden">{isAuthorized && <AdNonModal meetupId={adData.id} />}</div>
                </div>
                <div className="text-lg">모임장소</div>
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
              </div>
              <div className="hidden md:block md:w-[7rem]">
                {isAuthorized && (
                  <div className="flex w-[7rem] justify-between">
                    <Link className="text-lg text-gray-dark" href={`/meetup/edit/${adData.id}`}>
                      수정
                    </Link>
                    <span className="text-lg text-gray-dark"> | </span>
                    <button className="text-lg text-gray-dark" type="button" onClick={() => openModal("AD_DELETE", { meetupId: adData.id })}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="pt-[2rem] text-base font-light">{adData.description}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdDetail;
