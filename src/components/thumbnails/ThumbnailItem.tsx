"use client";

import React, { useEffect, useState } from "react";
import LikeContainer from "../likes/LikeContainer";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import CategoryBadge from "../common/CategoryBadge";
import { getDday } from "@/utils/getDday";
import { getImageURL } from "@/utils/getImageURL";

type ThumbnailHighlight = {
  range: string;
  keyword: string;
};

// id 였는데 썸네일 객체를 직접 전달하도록 수정
// 구조분해할당, 타입지정
const ThumbnailItem = ({ thumbnail, userNickname, priority, highlight }: { thumbnail: Meetup; userNickname: string | null; priority: boolean; highlight?: ThumbnailHighlight }) => {
  const [profileImageSource, setProfileImageSource] = useState(getImageURL(thumbnail.organizer.image ?? null));

  useEffect(() => {
    setProfileImageSource(getImageURL(thumbnail.organizer.image ?? null));
  }, [thumbnail?.organizer.image]);

  if (!thumbnail) return null;

  const isOwner = userNickname === thumbnail.organizer.nickname;
  const canOpen = thumbnail.isPublic || isOwner;
  const adDday = thumbnail.adEndedAt ? getDday(thumbnail.adEndedAt) : null;
  const isUrgent = adDday === "D-DAY" || /^D-[0-3]$/.test(adDday ?? "");
  const highlightKeyword = highlight?.keyword.trim() ?? "";
  const shouldHighlightTitle = highlight?.range === "ad_title" && highlightKeyword.length > 0;
  const shouldHighlightOrganizer = highlight?.range === "organizer" && highlightKeyword.length > 0;
  const shouldHighlightDescription = highlight?.range === "description" && highlightKeyword.length > 0;

  const highlightText = (text: string) => {
    if (!highlightKeyword) return text;

    const escapedKeyword = highlightKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escapedKeyword})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLocaleLowerCase() === highlightKeyword.toLocaleLowerCase() ? (
        <mark key={`${part}-${index}`} className="bg-accent/70 rounded-[0.2rem] px-[0.1rem] font-bold text-inherit">
          {part}
        </mark>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      ),
    );
  };

  const renderTitle = () => (shouldHighlightTitle ? highlightText(thumbnail.adTitle) : <>{thumbnail.adTitle}</>);
  const renderDescription = () => (shouldHighlightDescription ? highlightText(thumbnail.description) : <>{thumbnail.description}</>);
  const renderOrganizer = () => (shouldHighlightOrganizer ? highlightText(thumbnail.organizer.nickname) : <>{thumbnail.organizer.nickname}</>);
  const startDate = thumbnail.startedAt ? new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(new Date(thumbnail.startedAt)) : "일정 미정";

  // 카드 이미지 영역 (공개/비공개 분기)
  const renderImageArea = () => {
    if (thumbnail.isPublic === true && thumbnail.image) {
      return (
        <Link href={`/ad/${thumbnail.id}`} className="group/img relative block h-full w-full">
          <Image
            loading={priority ? undefined : "lazy"}
            unoptimized={false}
            src={getImageURL(thumbnail.image)}
            alt={thumbnail.adTitle}
            fill
            sizes="(max-width: 519px) calc(100vw - 3.2rem), (max-width: 1023px) 50vw, 36rem"
            className="object-cover transition-transform duration-700 group-hover/img:scale-[1.045]"
          />
        </Link>
      );
    }

    // 비공개: 방장이면 링크 유지, 아니면 잠금 박스만
    const lockBox = (
      <div className="bg-muted flex h-full w-full flex-col items-center justify-center gap-[0.7rem]">
        <span className="bg-card text-muted-foreground grid h-[4.2rem] w-[4.2rem] place-items-center rounded-full shadow-sm">
          <FaLock className="h-[1.8rem] w-[1.8rem]" />
        </span>
        <span className="text-muted-foreground text-xs font-medium">{thumbnail.isPublic ? "이미지 준비 중" : "비공개 모임"}</span>
      </div>
    );

    if (isOwner) {
      return (
        <Link href={`/ad/${thumbnail.id}`} className="relative block h-full w-full">
          {lockBox}
        </Link>
      );
    }

    return lockBox;
  };

  return (
    <article className="group bg-card border-border hover:border-primary/25 flex h-full flex-col overflow-hidden rounded-[2.2rem] border transition-all duration-300 hover:-translate-y-[0.3rem] hover:shadow-[0_2rem_4.5rem_-2.6rem_rgba(24,23,29,0.34)]">
      {/* 이미지 영역 */}
      <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden">
        {renderImageArea()}

        <div className="from-foreground/45 pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t to-transparent" />

        <div className="pointer-events-none absolute top-3 left-3 z-10 flex max-w-[calc(100%-7rem)] flex-wrap items-center gap-[0.4rem]">
          {thumbnail.category && <CategoryBadge category={thumbnail.category} variant="solid" className="shadow-sm" />}
          {isOwner && (
            <span className="bg-card/85 text-primary inline-flex h-[2.2rem] w-[2.2rem] place-content-center items-center rounded-full shadow-sm backdrop-blur">
              <LuCrown className="fill-primary/20 h-[1.4rem] w-[1.4rem] stroke-[2]" />
            </span>
          )}
          {!thumbnail.isPublic && (
            <span className="bg-foreground/80 text-background inline-flex items-center gap-[0.3rem] rounded-full px-[0.7rem] py-[0.2rem] text-xs font-semibold backdrop-blur">
              <FaLock className="shrink-0" />
              비공개
            </span>
          )}
        </div>

        {adDday && (
          <span
            className={`absolute top-3 right-3 z-10 rounded-full px-[0.8rem] py-[0.3rem] text-xs font-semibold backdrop-blur ${isUrgent ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}
          >
            {adDday}
          </span>
        )}

        {thumbnail.place && (
          <span className="text-background absolute bottom-3 left-3 z-10 inline-flex items-center gap-[0.4rem] text-xs font-bold drop-shadow-sm">
            <FaMapMarkerAlt className="shrink-0" />
            {thumbnail.place}
          </span>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col gap-[0.9rem] p-[1.6rem] md:p-[1.8rem]">
        <h3 className="text-foreground line-clamp-2 min-h-[4rem] text-[1.7rem] leading-[1.25] font-black tracking-[-0.025em] break-keep">
          {canOpen ? (
            <Link href={`/ad/${thumbnail.id}`} className="hover:text-primary transition-colors">
              {renderTitle()}
            </Link>
          ) : (
            renderTitle()
          )}
        </h3>

        {thumbnail.description && <p className="text-muted-foreground line-clamp-2 text-sm leading-[1.55] break-keep">{renderDescription()}</p>}

        <div className="text-foreground/70 flex items-center gap-[0.5rem] text-xs font-bold">
          <span className="bg-primary-soft text-primary grid h-[2.4rem] w-[2.4rem] place-items-center rounded-[0.8rem]">
            <FaRegCalendarAlt className="shrink-0" />
          </span>
          <span className="truncate">{startDate}</span>
        </div>

        {/* 작성자 & 좋아요 */}
        <div className="border-border mt-[0.2rem] flex items-center justify-between gap-[1rem] border-t pt-[1.1rem]">
          <div className="flex min-w-0 items-center gap-[0.4rem]">
            <div className="ring-muted relative h-[2.4rem] w-[2.4rem] flex-shrink-0 overflow-hidden rounded-full ring-2">
              <Image unoptimized={false} src={profileImageSource} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" onError={() => setProfileImageSource("/profile.png")} />
            </div>
            <div className="text-muted-foreground truncate text-xs font-bold">{renderOrganizer()}</div>
          </div>

          <div className="pointer-events-auto flex flex-shrink-0 items-center gap-[0.7rem]">
            <span className="text-muted-foreground inline-flex items-center gap-[0.3rem] text-[1.3rem]">
              <FaRegCommentDots className="h-[1.4rem] w-[1.4rem]" />
              {thumbnail.commentCount}
            </span>
            <LikeContainer id={thumbnail.id} initialIsLike={thumbnail.isLike} initialLikeCount={thumbnail.likeCount} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThumbnailItem;
