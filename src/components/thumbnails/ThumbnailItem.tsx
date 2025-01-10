"use client";

import React from "react";
import Image from "next/image";
import { Meetup } from "@/types/meetupType";
import { BASE_URL } from "@/constants/baseURL";
import { ThumbnailItemProps } from "@/types/thumbnailType";
import calculateDays from "@/utils/calculateDays";

const ThumbnailItem = ({ thumbnail }: ThumbnailItemProps) => {
  const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;
  return (
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
        <p>좋아요 눌렀니? {thumbnail.isLike.toString()}</p>
        <p>좋아요 숫자 : {thumbnail.likeCount}</p>
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
  );
};

export default ThumbnailItem;

{
  /* <>
  {headhuntingsAsThumbnails.result.map((thumbnail: Meetup) => {
    const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;
    return (
      <ul key={thumbnail.id}>
        <li>참고용 아이디 : {thumbnail.id}</li>
        <img src={thumbnailImageUrl} alt="광고글 이미지입니당 근데 이거 왜안떠" />
        <li>작성자 : {thumbnail.organizer.nickname}</li>
        <li>[{thumbnail.place}]</li>
        <li>제목 : {thumbnail.adTitle}</li>
        <li>공개 여부 : {thumbnail.isPublic.toString()}</li>
        <li>{thumbnail.adEndedAt?.substring(0, 10)}까지 모집</li>
      </ul>
    );
  })}
  ;
</>; */
}
