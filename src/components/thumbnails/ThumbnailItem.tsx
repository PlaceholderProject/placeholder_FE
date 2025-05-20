"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import calculateDays from "@/utils/calculateDays";
import { useQuery } from "@tanstack/react-query";
import LikeContainer from "../likes/LikeContainer";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";
import Image from "next/image";

// id 였는데 썸네일 객체를 직접 전달하도록 수정
// 구조분해할당, 타입지정
const ThumbnailItem = ({ thumbnail }: { thumbnail: Meetup }) => {
  // const {
  //   data: thumbnail,
  //   isPending,
  //   isError,
  // } = useQuery({
  //   queryKey: ["headhuntings", id],
  //   queryFn: () => getHeadhuntingItemApi(id),
  // });

  // console.log(thumbnail?.image); // 옵셔널 체이닝 사용

  // console.log(thumbnail.image);
  // thumbnail?.image && console.log(thumbnail.image);

  const [profileImageSource, setProfileImageSource] = useState("/profile.png");
  const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;
  // if (isPending) return <div>로딩중</div>;
  // if (isError) return <div>에러발생</div>;
  if (!thumbnail) return null;

  useEffect(() => {
    if (thumbnail && thumbnail.organizer && thumbnail.organizer.profileImage) {
      const profileImageUrl = thumbnail?.organizer.profileImage.startsWith("http") ? thumbnail.organizer.profileImage : `${BASE_URL}${thumbnail.organizer.profileImage}`;
      console.log("작성자 프사 URL", profileImageUrl);
      // HTMLImageElement를 사용하여 이미지 존재 여부 확인
      const imgElement = document.createElement("img");
      imgElement.onload = () => setProfileImageSource(profileImageUrl);
      imgElement.onerror = () => {
        console.error("이미지로딩 실패", profileImageUrl);
        setProfileImageSource("/profile.png");
      };
    } else {
      console.log("작성자 프사 이미지 없음:", thumbnail?.organizer);
    }
  }, [thumbnail]);

  return (
    <>
      <div className={`border rounded-lg p-4 ${!thumbnail.isPublic ? " pointer-events-none text-[#D9D9D9]" : ""}`}>
        <div className={thumbnail.isPublic ? "bg-red-200" : "bg-gray-100"}>
          {thumbnail.image && (
            <Link href={`http://localhost:3000/ad/${thumbnail.id}`} className="relative h-48 b-4">
              {/* <Image src={thumbnailImageUrl} alt={`${thumbnail.id}번 광고 이미지 안뜸`} fill className="object-cover rounded" loading="lazy" /> */}
              {/* 🐩🐩🐩 넥스트 Imageㅅ 써야될거같은데!!!!!🐩🐩🐩🐩 */}
              <Image
                src={thumbnailImageUrl}
                alt="thumbnailImage"
                width={100}
                height={70}
                style={{ height: "auto" }}
                className={`object-cover rounded ${!thumbnail.isPublic ? "opacity-60" : ""}`}
                loading="lazy"
              />
            </Link>
          )}
          <div className="space-y-2">
            <Image src={profileImageSource} width="20" height="20" alt="작성자 프로필 이미지" style={{ width: "auto", height: "auto" }} />
            <p className=" text-[12px] text-#[484848]">작성자: {thumbnail.organizer.nickname}</p>

            {!thumbnail.isPublic && <span className="bg-[#D9D9D9] text-[#FFF] text-[10px] p-1 rounded-md">비공개</span>}
            <div className="pointer-events-auto">
              <LikeContainer id={thumbnail.id} />{" "}
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
