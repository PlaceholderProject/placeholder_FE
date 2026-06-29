"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import LikeContainer from "../likes/LikeContainer";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";

// id 였는데 썸네일 객체를 직접 전달하도록 수정
// 구조분해할당, 타입지정
const ThumbnailItem = ({ thumbnail, userNickname, priority }: { thumbnail: Meetup; userNickname: string | null; priority: boolean }) => {
  const [profileImageSource, setProfileImageSource] = useState("/profile.png");
  const thumbnailImageUrl = thumbnail.image?.startsWith("http") ? thumbnail.image : `${BASE_URL}/${thumbnail.image}`;

  useEffect(() => {
    // 직접 fetch로 테스트
    fetch(thumbnailImageUrl)
      .then(() => {})
      .catch(error => {
        console.error("===이미지 fetch 에러:", error);
      });
  }, [thumbnailImageUrl]);

  useEffect(() => {
    // 프로필 이미지가 없으면 기본 이미지 사용
    if (!thumbnail?.organizer.image) {
      setProfileImageSource("/profile.png");
      return;
    }

    // 메인 작성자 프사 이미지
    const profileImageUrl = thumbnail.organizer.image?.startsWith("http") ? thumbnail.organizer.image : `${BASE_URL}/${thumbnail.organizer.image}`;

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

  if (!thumbnail) return null;

  const isOwner = userNickname === thumbnail.organizer.nickname;

  // 왕관(방장) 뱃지
  const crownBadge = isOwner && (
    <div className="bg-primary text-primary-foreground absolute top-3 left-3 z-10 flex h-[2.2rem] w-[2.2rem] place-content-center items-center rounded-full text-[1.4rem] shadow-sm">
      <FaCrown />
    </div>
  );

  // 카드 이미지 영역 (공개/비공개 분기)
  const renderImageArea = () => {
    if (thumbnail.isPublic === true && thumbnail.image) {
      return (
        <Link href={`/ad/${thumbnail.id}`} className="group/img relative block h-full w-full">
          <Image
            loading={priority ? undefined : "lazy"}
            unoptimized={false}
            src={thumbnailImageUrl}
            alt="thumbnailImage"
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {crownBadge}
        </Link>
      );
    }

    // 비공개: 방장이면 링크 유지, 아니면 잠금 박스만
    const lockBox = (
      <div className="bg-muted flex h-full w-full items-center justify-center">
        <FaLock className="text-muted-foreground h-[4rem] w-[4rem]" />
      </div>
    );

    if (isOwner) {
      return (
        <Link href={`/ad/${thumbnail.id}`} className="relative block h-full w-full">
          {lockBox}
          {crownBadge}
        </Link>
      );
    }

    return lockBox;
  };

  return (
    <article className="group bg-card border-border hover:border-primary/30 flex flex-col overflow-hidden rounded-[1.6rem] border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(22,21,15,0.35)]">
      {/* 이미지 영역 */}
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        {renderImageArea()}
        {/* 모집 마감일 pill */}
        {thumbnail.adEndedAt && (
          <span className="bg-background/90 text-foreground absolute top-3 right-3 z-10 rounded-full px-[0.7rem] py-[0.2rem] text-xs font-medium backdrop-blur">
            ~{thumbnail.adEndedAt.substring(5, 10)}
          </span>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col gap-[0.6rem] p-[1.1rem]">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold break-words">
          <span className="text-primary whitespace-nowrap">[{thumbnail.place}]</span> {thumbnail.adTitle}
        </h3>

        <div className="text-muted-foreground flex items-center gap-[0.4rem] text-xs">
          <FaRegCalendarAlt className="shrink-0" />
          <span className="truncate">
            {thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}
          </span>
        </div>

        {/* 작성자 & 좋아요 */}
        <div className="border-border mt-auto flex items-center justify-between border-t pt-[0.7rem]">
          <div className="flex min-w-0 items-center gap-[0.4rem]">
            <div className="relative h-[2rem] w-[2rem] flex-shrink-0">
              <Image unoptimized={false} src={profileImageSource} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" />
            </div>
            <div className="text-muted-foreground truncate text-sm">{thumbnail.organizer.nickname}</div>
          </div>

          <div className="pointer-events-auto flex-shrink-0">
            <LikeContainer id={thumbnail.id} initialIsLike={thumbnail.isLike} initialLikeCount={thumbnail.likeCount} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThumbnailItem;
