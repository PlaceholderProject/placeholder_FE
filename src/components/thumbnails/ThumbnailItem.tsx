"use client";

import React, { useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import { ThumbnailItemProps } from "@/types/thumbnailType";
import calculateDays from "@/utils/calculateDays";
import LikeArea from "../likes/LikeArea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHeadhuntingItemApi } from "@/services/thumbnails.service";
const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const ThumbnailItem = ({ thumbnail }: ThumbnailItemProps) => {
  const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;
  const thumbnailId = thumbnail.id;

  // 광고글 하나 데이터 가져오기 api
  // const getHeadhuntingItemApi = async () => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error("해당 id 광고아이템 가져오기 실패");
  //   }

  //   const headhuntingItemData = await response.json();

  //   console.log("아이템 하나 데이터:", headhuntingItemData);

  //   return await headhuntingItemData;
  // };

  // 광고글 하나 탠스택
  // 🟨이게 왜 필요허지???????🟨
  const {
    data: headhuntingAsThumbnailItem,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["headhuntings", "thumbnail", thumbnailId],
    queryFn: t => getHeadhuntingItemApi(thumbnailId),
  });

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러발생</div>;

  return (
    <>
      <div className="border rounded-lg p-4">
        {thumbnail.image && (
          <div className="relative h-48 b-4">
            {/* <Image src={thumbnailImageUrl} alt={`${thumbnail.id}번 광고 이미지 안뜸`} fill className="object-cover rounded" loading="lazy" /> */}
            {/* 🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩Imageㅅ 써야될거같은데!!!!!11🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩 */}
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
