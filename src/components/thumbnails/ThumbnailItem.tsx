"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import LikeContainer from "../likes/LikeContainer";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";

// id 였는데 썸네일 객체를 직접 전달하도록 수정
// 구조분해할당, 타입지정
const ThumbnailItem = ({ thumbnail }: { thumbnail: Meetup }) => {
  const [profileImageSource, setProfileImageSource] = useState("/profile.png");
  const thumbnailImageUrl = thumbnail.image?.startsWith("http") ? thumbnail.image : `${BASE_URL}/${thumbnail.image}`;

  useEffect(() => {
    // console.log("==베이스유알엘:", BASE_URL);
    // console.log("===thumbnail.image:", thumbnail.image);
    // console.log("====최종 URL:", thumbnailImageUrl);

    // 직접 fetch로 테스트
    fetch(thumbnailImageUrl)
      .then(response => {
        console.log("==페치로 테스트 이미지 응답:", response.status);
      })
      .catch(error => {
        console.error("===이미지 fetch 에러:", error);
      });
  }, [thumbnailImageUrl]);

  useEffect(() => {
    // 프로필 이미지가 없으면 기본 이미지 사용
    if (!thumbnail?.organizer.image) {
      setProfileImageSource("/profile.png");
      console.log("프로필 이미지 없다고 유즈이펙트???:", profileImageSource);
      return;
    }

    // 메인 작성자 프사 이미지
    const profileImageUrl = thumbnail.organizer.image?.startsWith("http") ? thumbnail.organizer.image : `${BASE_URL}/${thumbnail.organizer.image}`;
    // console.log("작성자 프사 URL", profileImageUrl);

    // HTMLImageElement를 사용하여 이미지 존재 여부 확인
    const imgElement = document.createElement("img");

    imgElement.onload = () => {
      setProfileImageSource(profileImageUrl);
    };

    imgElement.onerror = () => {
      console.error("이미지로딩 실패", profileImageUrl);
      setProfileImageSource("/profile.png");
    };

    // 이미지 로드 시작
    imgElement.src = profileImageUrl;

    // 컴포넌트 언마운트 시 정리
    return () => {
      imgElement.onload = null;
      imgElement.onerror = null;
    };
  }, [thumbnail?.organizer.image]);

  // if (isPending) return <div>로딩중</div>;
  // if (isError) return <div>에러발생</div>;
  if (!thumbnail) return null;

  return (
    <>
      <div className="my-[1rem] w-full rounded-lg">
        <div className={thumbnail.isPublic === false ? "text-gray-dark opacity-90" : ""}>
          {thumbnail.image &&
            (thumbnail.isPublic === true ? (
              <Link href={`/ad/${thumbnail.id}`} className="relative mx-auto block h-[14.2rem] w-[14.2rem]">
                <Image src={thumbnailImageUrl} alt="thumbnailImage" fill sizes="width-[14.2rem] height-[14.2rem]" className="rounded-[2rem] object-cover" loading="lazy" />
              </Link>
            ) : (
              <div className="flex h-[14.2rem] w-[14.2rem] items-center justify-center rounded-[2rem] bg-gray-medium">
                <FaLock className="h-[4rem] w-[4rem] text-gray-dark" />
              </div>
            ))}

          {/* 콘텐츠 */}
          <div className="mt-[1rem]">
            {/* 프로필 & 좋아요 */}
            <div className="flex items-center justify-between">
              {/* 작성자 */}
              <div className="flex items-center gap-[0.4rem]">
                <div className="relative flex h-[1.8rem] w-[1.8rem] flex-shrink-0 text-sm">
                  <Image src={profileImageSource} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" />
                </div>
                <div className="truncate text-sm font-medium">{thumbnail.organizer.nickname}</div>
              </div>

              {/* 좋아요 */}
              <div className="pointer-events-auto flex-shrink-0">
                <LikeContainer id={thumbnail.id} initialIsLike={thumbnail.isLike} initialLikeCount={thumbnail.likeCount} />
              </div>
            </div>

            <div className="flex h-[3rem] w-[14.2rem] justify-items-start text-sm font-semibold">
              <div>[{thumbnail.place}]</div>
              <div>{thumbnail.adTitle}</div>
            </div>

            <div className="flex justify-start space-x-1">
              <FaRegCalendarAlt className="mt-[0.2rem] h-[1.05rem] w-[1.2rem]" />
              <div className="text-xs">
                {thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}
              </div>
              {/* <span>
                {thumbnail.startedAt && thumbnail.endedAt
                  ? calculateDays({
                      startedAt: thumbnail.startedAt,
                      endedAt: thumbnail.endedAt,
                    })
                  : ""}
              </span> */}
            </div>
            <span className="text-xs">{thumbnail.adEndedAt?.substring(0, 10)}까지 모집</span>
            {/* <p className="text-sm">공개여부 : {thumbnail.isPublic.toString()}</p> */}
            {/* <p className="text-sm text-red-300">생성일: {thumbnail.createdAt?.substring(0, 10)}</p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThumbnailItem;
