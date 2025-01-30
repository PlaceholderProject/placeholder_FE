"use client";

import React, { useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import { ThumbnailItemProps } from "@/types/thumbnailType";
import calculateDays from "@/utils/calculateDays";
import LikeArea from "../likes/LikeArea";
import { useQuery } from "@tanstack/react-query";
import { getHeadhuntingItemApi } from "@/services/thumbnails.service";

const ThumbnailItem = ({ thumbnailId }: ThumbnailItemProps) => {
  const {
    data: thumbnail,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["headhuntings", thumbnailId],
    queryFn: () => getHeadhuntingItemApi(thumbnailId),
  });

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러발생</div>;

  const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;

  return (
    <>
      <div className="border rounded-lg p-4">
        {thumbnail.image && (
          <div className="relative h-48 b-4">
            {/* <Image src={thumbnailImageUrl} alt={`${thumbnail.id}번 광고 이미지 안뜸`} fill className="object-cover rounded" loading="lazy" /> */}
            {/* 🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩Imageㅅ 써야될거같은데!!!!!🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩 */}
            <img src={thumbnailImageUrl} alt="테스트용 이미지 잘뜨나" className="object-cover rounded" loading="lazy" />
          </div>
        )}
        <div className="space-y-2">
          <p className="font-semibold">작성자: {thumbnail.organizer.nickname}</p>
          <div>
            <LikeArea isLike={thumbnail.isLike} likeCount={thumbnail.likeCount} thumbnailId={thumbnailId} />
          </div>

          <p className="text-gray-600">[{thumbnail.place}]</p>
          <p className="text-lg font-bold">{thumbnail.adTitle}</p>
          <div>
            모임 날짜 : {thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}{" "}
            <p>
              {thumbnail.startedAt && thumbnail.endedAt
                ? calculateDays({
                    startedAt: thumbnail.startedAt,
                    endedAt: thumbnail.endedAt,
                  })
                : ""}
            </p>
          </div>
          <p className="text-sm text-gray-500">{thumbnail.adEndedAt?.substring(0, 10)}까지 모집</p>
          <p className="text-sm">공개여부 : {thumbnail.isPublic.toString()}</p>
        </div>
      </div>
    </>
  );
};

export default ThumbnailItem;
