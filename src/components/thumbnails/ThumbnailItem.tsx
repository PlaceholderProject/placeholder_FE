"use client";

import React from "react";
import { BASE_URL } from "@/constants/baseURL";
import calculateDays from "@/utils/calculateDays";
import { useQuery } from "@tanstack/react-query";
import { getHeadhuntingItemApi } from "@/services/thumbnails.service";
import LikeContainer from "../likes/LikeContainer";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";

const ThumbnailItem = ({ id }: { id: Meetup["id"] }) => {
  const {
    data: thumbnail,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["headhuntings", id],
    queryFn: () => getHeadhuntingItemApi(id),
  });

  // console.log(thumbnail?.image); // 옵셔널 체이닝 사용

  // console.log(thumbnail.image);
  // thumbnail?.image && console.log(thumbnail.image);

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러발생</div>;

  const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;

  return (
    <>
      <div className={`border rounded-lg p-4 ${!thumbnail.isPublic ? " pointer-events-none text-[#D9D9D9]" : ""}`}>
        <div className={thumbnail.isPublic ? "bg-red-200" : "bg-gray-100"}>
          {thumbnail.image && (
            <Link href={`http://localhost:3000/ad/${thumbnail.id}`} className="relative h-48 b-4">
              {/* <Image src={thumbnailImageUrl} alt={`${thumbnail.id}번 광고 이미지 안뜸`} fill className="object-cover rounded" loading="lazy" /> */}
              {/* 🐩🐩🐩 넥스트 Imageㅅ 써야될거같은데!!!!!🐩🐩🐩🐩 */}
              <img src={thumbnailImageUrl} alt="테스트용 이미지 잘뜨나" className={`object-cover rounded ${!thumbnail.isPublic ? "opacity-60" : ""}`} loading="lazy" />
            </Link>
          )}
          <div className="space-y-2">
            <p className=" text-[12px] text-#[484848]">작성자: {thumbnail.organizer.nickname}</p>

            {!thumbnail.isPublic && <span className="bg-[#D9D9D9] text-[#FFF] text-[10px] p-1 rounded-md">비공개</span>}
            <div className="pointer-events-auto">
              <LikeContainer id={id} />{" "}
            </div>

            <p>[{thumbnail.place}]</p>
            <p className="text-lg font-bold">{thumbnail.adTitle}</p>
            <div>
              모임 날짜 :{thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}{" "}
              <p>
                {thumbnail.startedAt && thumbnail.endedAt
                  ? calculateDays({
                      startedAt: thumbnail.startedAt,
                      endedAt: thumbnail.endedAt,
                    })
                  : ""}
              </p>
            </div>
            <p className="text-sm">{thumbnail.adEndedAt?.substring(0, 10)}까지 모집</p>
            {/* <p className="text-sm">공개여부 : {thumbnail.isPublic.toString()}</p> */}
            {/* <p className="text-sm text-red-300">생성일: {thumbnail.createdAt?.substring(0, 10)}</p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThumbnailItem;
