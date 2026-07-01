"use client";

import React from "react";
import AdButton from "./AdButton";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useAdItem } from "@/hooks/useAdItem";
import AdLikeContainer from "./AdLikeContainer";
import { Meetup } from "@/types/meetupType";
import Spinner from "../common/Spinner";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaCommentDots, FaLock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IconType } from "react-icons";
import CategoryBadge from "../common/CategoryBadge";
import { getImageURL } from "@/utils/getImageURL";
import { getDday } from "@/utils/getDday";
import { useModal } from "@/hooks/useModal";
import { LuCrown } from "react-icons/lu";

const formatDate = (date: string | null) => {
  if (!date) return "미정";
  return date.substring(0, 10);
};

const InfoRow = ({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) => {
  return (
    <div className="bg-muted/60 flex items-start gap-[0.8rem] rounded-[1.4rem] px-[1.2rem] py-[1rem]">
      <Icon className="text-primary mt-[0.2rem] h-[1.5rem] w-[1.5rem] shrink-0" />
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-foreground mt-[0.2rem] text-sm leading-relaxed break-keep">{value}</p>
      </div>
    </div>
  );
};

const AdArea = ({ initialData, meetupId, children }: { initialData: Meetup; meetupId: number; children?: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user?.nickname || "";
  const { openModal } = useModal();

  // 통합해서 adData가져오기
  const { adData, error, isPending } = useAdItem(meetupId, initialData);
  if (error) {
    return (
      <div className="mx-auto flex min-h-[30rem] w-[95%] items-center justify-center md:max-w-[100rem]">
        <div className="border-border bg-card rounded-[1.6rem] border px-[2rem] py-[1.6rem] text-center text-sm">에러 발생: {error.message}</div>
      </div>
    );
  }
  if (isPending) {
    return <Spinner isLoading={isPending} />;
  }
  if (!adData) return <div>데이터를 찾을 수 없습니다.</div>;

  const isOwner = userNickname === adData.organizer.nickname;
  const adDday = getDday(adData.adEndedAt);
  // D-day는 마감 카운트다운이므로 색으로 긴박함의 단계를 표현한다 (여유/임박/마감)
  const isClosed = adDday === "마감";
  const ddayNum = adDday === "D-DAY" ? 0 : Number(adDday.match(/\d+/)?.[0] ?? NaN);
  const isUrgent = !isClosed && ddayNum <= 3;
  const ddayChipClass = isClosed ? "bg-muted text-muted-foreground" : isUrgent ? "bg-destructive text-destructive-foreground" : "bg-primary-soft text-primary-soft-foreground";

  return (
    <div className="mx-auto w-[95%] space-y-[2.4rem] pt-[1.6rem] pb-[4rem] md:max-w-[100rem] md:pt-[2rem]">
      <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-medium transition-colors">
        <FaArrowLeft className="h-[1.3rem] w-[1.3rem]" />
        둘러보기로
      </Link>

      <section className="bg-muted relative h-[24rem] overflow-hidden rounded-[2rem] md:h-[32rem]">
        {adData.image ? (
          <Image src={getImageURL(adData.image ?? null)} alt={adData.name} fill priority sizes="(max-width: 768px) 95vw, 100rem" className="object-cover" />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <FaLock className="text-muted-foreground h-[3.2rem] w-[3.2rem]" />
          </div>
        )}
        <div className="from-foreground/75 via-foreground/20 absolute inset-0 bg-gradient-to-t to-transparent" />

        <div className="absolute top-[1.5rem] left-[1.5rem] flex flex-wrap gap-[0.7rem] md:top-[2rem] md:left-[2rem]">
          {adData.category && <CategoryBadge category={adData.category} size="md" variant="solid" />}
          {!adData.isPublic && (
            <span className="bg-background/90 text-foreground inline-flex items-center gap-[0.5rem] rounded-full px-[1rem] py-[0.4rem] text-sm font-medium backdrop-blur">
              <FaLock className="h-[1.2rem] w-[1.2rem]" />
              비공개 모임
            </span>
          )}
        </div>

        {isOwner && (
          <div className="absolute top-[1.5rem] right-[1.5rem] hidden items-center gap-[0.7rem] md:flex">
            <Link
              href={`/meetup/edit/${adData.id}`}
              className="bg-background/90 text-foreground hover:text-primary rounded-full px-[1rem] py-[0.5rem] text-sm font-semibold backdrop-blur transition-colors"
            >
              수정
            </Link>
            <button
              type="button"
              onClick={() => openModal("AD_DELETE", { meetupId: adData.id })}
              className="bg-background/90 text-foreground hover:text-destructive rounded-full px-[1rem] py-[0.5rem] text-sm font-semibold backdrop-blur transition-colors"
            >
              삭제
            </button>
          </div>
        )}

        <div className="text-background absolute right-[1.5rem] bottom-[1.5rem] left-[1.5rem] md:right-[2rem] md:bottom-[2rem] md:left-[2rem]">
          <p className="text-background/80 mb-[0.7rem] text-sm font-medium">{adData.place}</p>
          <h1 className="max-w-[72rem] text-2xl leading-tight font-bold break-keep md:text-3xl">{adData.name}</h1>
        </div>
      </section>

      <div className="grid gap-[2.4rem] lg:grid-cols-[1fr_32rem]">
        <div className="space-y-[2.4rem]">
          <section className="border-border bg-card flex items-center justify-between gap-[1.2rem] rounded-[2rem] border p-[1.4rem]">
            <div className="flex min-w-0 items-center gap-[1rem]">
              <div className="relative h-[4.4rem] w-[4.4rem] shrink-0 overflow-hidden rounded-full">
                <Image src={getImageURL(adData.organizer.image ?? null)} alt={adData.organizer.nickname} fill sizes="4.4rem" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground inline-flex items-center gap-[0.35rem] text-sm">
                  모임장
                  <LuCrown className="text-primary fill-primary/20 h-[1.3rem] w-[1.3rem] stroke-[2]" />
                </p>
                <p className="text-foreground truncate text-base font-semibold">{adData.organizer.nickname}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-[1rem] text-sm">
              <span className="text-muted-foreground inline-flex min-w-[3.2rem] flex-col items-center gap-[0.3rem]">
                <FaCommentDots className="h-[1.8rem] w-[1.8rem]" />
                <span className="text-sm leading-none">{adData.commentCount}</span>
              </span>
              <AdLikeContainer id={adData.id} initialIsLike={adData.isLike} initialLikeCount={adData.likeCount} />
            </div>
          </section>

          <section className="border-border bg-card rounded-[2rem] border p-[1.8rem] md:p-[2rem]">
            <h2 className="text-foreground mb-[1rem] text-lg font-semibold">모임 소개</h2>
            <p className="text-muted-foreground leading-relaxed break-keep whitespace-pre-line">{adData.description}</p>
            <div className="mt-[1.6rem] grid gap-[1rem] sm:grid-cols-2">
              <InfoRow icon={FaMapMarkerAlt} label="장소" value={`${adData.place} · ${adData.placeDescription || "상세 장소 미정"}`} />
              <InfoRow icon={FaCalendarAlt} label="모임 기간" value={`${formatDate(adData.startedAt)} ~ ${formatDate(adData.endedAt)}`} />
            </div>
          </section>
        </div>

        <aside className="space-y-[1.6rem] lg:sticky lg:top-[8.4rem] lg:self-start">
          <section className="border-border bg-card rounded-[2rem] border p-[1.8rem]">
            {adDday && (
              <div className="mb-[1.2rem] flex items-center justify-between gap-[1rem]">
                <span className="text-muted-foreground inline-flex items-center gap-[0.4rem] text-xs font-medium">
                  <FaClock className="h-[1.1rem] w-[1.1rem]" />
                  신청 마감
                </span>
                <span className={`${ddayChipClass} inline-flex items-center rounded-full px-[0.9rem] py-[0.3rem] text-sm font-semibold`}>{adDday}</span>
              </div>
            )}
            <h2 className="text-foreground mb-[1.5rem] text-lg leading-snug font-semibold break-keep">{adData.adTitle}</h2>
            <AdButton meetupId={meetupId} />
          </section>

          <section className="border-border bg-card rounded-[2rem] border p-[1.8rem]">
            <h3 className="text-foreground mb-[1.2rem] flex items-center gap-[0.6rem] text-base font-semibold">
              <FaUsers className="text-primary h-[1.5rem] w-[1.5rem]" />
              모임 정보
            </h3>
            <dl className="space-y-[1rem] text-sm">
              <div className="flex items-center justify-between gap-[1rem]">
                <dt className="text-muted-foreground">공개 여부</dt>
                <dd className="text-foreground font-medium">{adData.isPublic ? "공개" : "비공개"}</dd>
              </div>
              <div className="flex items-center justify-between gap-[1rem]">
                <dt className="text-muted-foreground">지역</dt>
                <dd className="text-foreground font-medium">{adData.place}</dd>
              </div>
              <div className="flex items-center justify-between gap-[1rem]">
                <dt className="text-muted-foreground">카테고리</dt>
                <dd className="text-foreground font-medium">{adData.category}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      {children && <section className="border-border bg-card overflow-hidden rounded-[2rem] border">{children}</section>}
    </div>
  );
};

export default AdArea;
