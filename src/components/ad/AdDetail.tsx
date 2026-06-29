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
  }, [adData, userNickname, organizerNickname]);

  const startedAt = adData.startedAt;
  const endedAt = adData.endedAt;

  const imageUrl = adData.image?.startsWith("http") ? adData.image : `${BASE_URL}/${adData.image}`;

  return (
    <>
      <div className="mt-[1em] w-full space-y-[0.2rem] md:max-w-[90rem]">
        <div className="mx-auto flex justify-center">
          <Image unoptimized={true} src={imageUrl} alt="모임 광고글 이미지" width={321} height={209} className="mx-auto w-[95%] rounded-[1.6rem] object-cover md:max-w-[80rem]" />
        </div>
        <div className="relative mx-auto w-[95%] md:max-w-[80rem]">
          <div className="border-border bg-card mt-[2rem] rounded-[1.6rem] border p-[1.5rem] md:p-[2rem]">
            <div className="md:grid md:grid-cols-[90%_10%]">
              <div className="grid grid-cols-[25%_75%] items-center gap-y-[0.8rem] text-left md:grid-cols-[15%_45%]">
                <div className="text-muted-foreground text-base">모임이름</div>
                <div className="flex items-center justify-between text-base md:grid-cols-2">
                  <div className="font-medium">{adData.name}</div>
                  <div className="md:hidden">{isAuthorized && <AdNonModal meetupId={adData.id} />}</div>
                </div>
                <div className="text-muted-foreground text-base">모임장소</div>
                <div className="text-base">
                  <span className="text-primary">[{adData.place}]</span> {adData.placeDescription}
                </div>
                <div className="text-muted-foreground text-base">모임날짜</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="bg-muted flex h-[2rem] w-[8rem] items-center justify-center rounded-[0.5rem] text-center">{startedAt === null ? "미정" : startedAt.substring(0, 10)}</div>~
                  <div className="bg-muted flex h-[2rem] w-[8rem] items-center justify-center rounded-[0.5rem] text-center">{endedAt === null ? "미정" : endedAt.substring(0, 10)}</div>
                  <div className="text-muted-foreground">
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
                    <Link className="text-muted-foreground hover:text-primary text-lg transition-colors" href={`/meetup/edit/${adData.id}`}>
                      수정
                    </Link>
                    <span className="text-border text-lg"> | </span>
                    <button className="text-muted-foreground hover:text-destructive text-lg transition-colors" type="button" onClick={() => openModal("AD_DELETE", { meetupId: adData.id })}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="border-border mt-[1.5rem] border-t pt-[1.5rem] text-base leading-relaxed font-light whitespace-pre-line">{adData.description}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdDetail;
