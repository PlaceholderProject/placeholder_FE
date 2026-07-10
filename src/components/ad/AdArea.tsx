"use client";

import { useAdItem } from "@/hooks/useAdItem";
import { useModal } from "@/hooks/useModal";
import { RootState } from "@/stores/store";
import { Meetup } from "@/types/meetupType";
import { getDday } from "@/utils/getDday";
import { getImageURL } from "@/utils/getImageURL";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { LuArrowLeft, LuCalendarDays, LuClock3, LuCrown, LuImage, LuLockKeyhole, LuLogIn, LuMapPin, LuMessageCircle, LuPencil, LuShieldCheck, LuTrash2, LuUsersRound } from "react-icons/lu";
import CategoryBadge from "../common/CategoryBadge";
import Spinner from "../common/Spinner";
import AdButton from "./AdButton";
import AdLikeContainer from "./AdLikeContainer";

const formatDate = (date: string | null | undefined) => {
  if (!date) return "미정";
  return date.substring(0, 10).replaceAll("-", ". ");
};

const DetailItem = ({ icon: Icon, label, value }: { icon: typeof LuMapPin; label: string; value: string }) => (
  <div className="flex min-w-0 items-start gap-[0.9rem]">
    <span className="bg-primary-soft text-primary grid h-[3.6rem] w-[3.6rem] shrink-0 place-items-center rounded-[1.1rem]">
      <Icon className="h-[1.7rem] w-[1.7rem] stroke-[1.9]" />
    </span>
    <div className="min-w-0 pt-[0.1rem]">
      <p className="text-muted-foreground text-xs font-semibold">{label}</p>
      <p className="text-foreground mt-[0.25rem] text-sm leading-snug font-bold break-keep">{value}</p>
    </div>
  </div>
);

const AdArea = ({ initialData, meetupId, children }: { initialData: Meetup; meetupId: number; children?: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { openModal } = useModal();
  const { adData, error, isPending } = useAdItem(meetupId, initialData);

  if (error) {
    return (
      <div className="mx-auto flex min-h-[30rem] w-[calc(100%-3.2rem)] items-center justify-center md:max-w-[112rem]">
        <div className="border-border bg-card rounded-[1.8rem] border px-[2.4rem] py-[2rem] text-center">
          <p className="text-foreground font-bold">모집글을 불러오지 못했어요.</p>
          <p className="text-muted-foreground mt-[0.5rem] text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  if (isPending) return <Spinner isLoading={isPending} />;
  if (!adData) return null;

  const isOwner = user?.nickname === adData.organizer.nickname;
  const adDday = getDday(adData.adEndedAt);
  const isClosed = adDday === "마감";
  const ddayNumber = adDday === "D-DAY" ? 0 : Number(adDday.match(/\d+/)?.[0] ?? Number.NaN);
  const isUrgent = !isClosed && ddayNumber <= 3;
  const ddayClass = isClosed ? "bg-muted text-muted-foreground" : isUrgent ? "bg-destructive text-destructive-foreground" : "bg-primary-soft text-primary";
  const actionTitle = isClosed ? "모집이 마감되었어요" : "이 모임에 함께할까요?";
  const actionDescription = isClosed ? "현재는 새로운 가입 신청을 받지 않아요." : "짧은 소개를 보내면 방장이 확인한 뒤 알려드려요.";

  return (
    <div className="mx-auto w-[calc(100%-3.2rem)] pt-[1.6rem] pb-[4rem] md:max-w-[112rem] md:pt-[2.2rem] md:pb-[7rem]">
      <Link href="/" className="text-muted-foreground hover:text-foreground mb-[1.2rem] inline-flex items-center gap-[0.55rem] text-sm font-bold transition-colors">
        <LuArrowLeft className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
        둘러보기
      </Link>

      <article className="border-border bg-card surface-shadow overflow-hidden rounded-[2.4rem] border">
        <div className="grid min-[860px]:grid-cols-[minmax(0,1.05fr)_minmax(34rem,0.95fr)]">
          <div className="bg-muted relative h-[25rem] overflow-hidden min-[860px]:h-auto min-[860px]:min-h-[40rem]">
            {adData.image ? (
              <Image
                src={getImageURL(adData.image)}
                alt={`${adData.adTitle} 대표 이미지`}
                fill
                priority
                sizes="(max-width: 859px) calc(100vw - 3.2rem), 55vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.015]"
              />
            ) : (
              <div className="from-primary-soft to-muted flex h-full w-full items-center justify-center bg-gradient-to-br">
                <LuImage className="text-primary/40 h-[4rem] w-[4rem] stroke-[1.5]" />
              </div>
            )}
            <div className="from-foreground/25 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent" />
          </div>

          <div className="flex flex-col px-[1.8rem] py-[2rem] md:px-[2.6rem] md:py-[2.6rem] xl:px-[3rem] xl:py-[3rem]">
            <div className="flex items-start justify-between gap-[1.2rem]">
              <div className="flex flex-wrap items-center gap-[0.6rem]">
                {adData.category && <CategoryBadge category={adData.category} size="md" />}
                <span className={`${ddayClass} inline-flex rounded-full px-[1rem] py-[0.4rem] text-sm font-semibold`}>{adDday || "마감일 미정"}</span>
                {!adData.isPublic && (
                  <span className="border-border text-muted-foreground inline-flex items-center gap-[0.4rem] rounded-full border px-[0.9rem] py-[0.35rem] text-xs font-semibold">
                    <LuLockKeyhole className="h-[1.3rem] w-[1.3rem]" />
                    비공개
                  </span>
                )}
              </div>

              {isOwner && (
                <div className="flex shrink-0 items-center gap-[0.5rem]">
                  <Link
                    href={`/meetup/edit/${adData.id}`}
                    className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex h-[3.2rem] items-center gap-[0.4rem] rounded-full border px-[0.9rem] text-xs font-bold transition-colors"
                  >
                    <LuPencil className="h-[1.3rem] w-[1.3rem]" />
                    수정
                  </Link>
                  <button
                    type="button"
                    onClick={() => openModal("AD_DELETE", { meetupId: adData.id, adTitle: adData.adTitle })}
                    className="border-border text-muted-foreground hover:border-destructive/30 hover:text-destructive inline-flex h-[3.2rem] items-center gap-[0.4rem] rounded-full border px-[0.9rem] text-xs font-bold transition-colors"
                  >
                    <LuTrash2 className="h-[1.3rem] w-[1.3rem]" />
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="mt-[1.6rem]">
              <p className="text-primary mb-[0.6rem] text-xs font-black">모임 · {adData.name}</p>
              <h1 className="text-foreground line-clamp-2 text-[2.7rem] leading-[1.16] font-black tracking-[-0.04em] break-keep md:text-[3rem] xl:text-[3.3rem]">{adData.adTitle}</h1>
              <p className="text-muted-foreground mt-[0.9rem] line-clamp-2 text-sm leading-[1.65] break-keep">{adData.description}</p>
            </div>

            <div className="mt-[1.2rem] flex items-center gap-[0.7rem]">
              <AdLikeContainer id={adData.id} initialIsLike={adData.isLike} initialLikeCount={adData.likeCount} />
              <a
                href="#comments"
                className="text-muted-foreground hover:bg-muted hover:text-primary inline-flex h-[3.8rem] items-center gap-[0.5rem] rounded-full px-[1rem] text-sm font-bold transition-colors"
              >
                <LuMessageCircle className="h-[1.7rem] w-[1.7rem] stroke-[1.9]" />
                댓글 {adData.commentCount}
              </a>
            </div>

            <div className="bg-muted/55 mt-[1.4rem] grid gap-[1.4rem] rounded-[1.6rem] p-[1.3rem] min-[1100px]:grid-cols-2">
              <DetailItem icon={LuMapPin} label="활동 지역" value={`${adData.place} · ${adData.placeDescription || "상세 장소 미정"}`} />
              <DetailItem icon={LuCalendarDays} label="활동 기간" value={`${formatDate(adData.startedAt)} ~ ${formatDate(adData.endedAt)}`} />
            </div>

            <div className="mt-[1.6rem] flex min-w-0 items-center gap-[0.9rem]">
              <div className="relative h-[4.4rem] w-[4.4rem] shrink-0 overflow-hidden rounded-[1.4rem]">
                <Image src={getImageURL(adData.organizer.image ?? null)} alt={adData.organizer.nickname} fill sizes="4.4rem" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground inline-flex items-center gap-[0.35rem] text-xs font-semibold">
                  방장
                  <LuCrown className="text-primary h-[1.3rem] w-[1.3rem] fill-current/10 stroke-[2]" />
                </p>
                <p className="text-foreground truncate text-sm font-black">{adData.organizer.nickname}</p>
              </div>
            </div>

            {isOwner && (
              <Link
                href={`/meetup/${adData.id}`}
                className="bg-primary text-primary-foreground hover:bg-primary-hover mt-[1.6rem] inline-flex h-[4.8rem] w-full items-center justify-center gap-[0.7rem] rounded-[1.4rem] text-base font-black transition-colors"
              >
                <LuLogIn className="h-[1.8rem] w-[1.8rem] stroke-[2.2]" />
                모임 들어가기
              </Link>
            )}
          </div>
        </div>
      </article>

      <div className={`mt-[2.4rem] grid items-start gap-[2rem] lg:gap-[2.4rem] ${isOwner ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_34rem]"}`}>
        <div className="space-y-[2rem]">
          <section className="border-border bg-card rounded-[2.2rem] border px-[1.8rem] py-[2rem] md:px-[2.6rem] md:py-[2.5rem]">
            <div className="mb-[1.6rem] flex items-center gap-[0.8rem]">
              <span className="bg-primary-soft text-primary grid h-[3.6rem] w-[3.6rem] place-items-center rounded-[1.1rem]">
                <LuUsersRound className="h-[1.8rem] w-[1.8rem] stroke-[1.9]" />
              </span>
              <div>
                <p className="text-primary text-xs font-black">모임 소개</p>
                <h2 className="text-foreground text-xl font-black tracking-[-0.025em]">이런 모임이에요</h2>
              </div>
            </div>
            <p className="text-foreground/85 max-w-[82rem] text-sm leading-[1.85] break-keep whitespace-pre-line md:text-base">{adData.description}</p>
          </section>

          {children && (
            <section id="comments" className="border-border bg-card scroll-mt-[9rem] overflow-hidden rounded-[2.2rem] border">
              {children}
            </section>
          )}
        </div>

        {!isOwner && (
          <aside className="order-first space-y-[1.2rem] lg:sticky lg:top-[9.2rem] lg:order-none">
            <section className="border-primary/20 bg-card rounded-[2.2rem] border p-[1.8rem] shadow-[0_1.8rem_4rem_-3rem_rgba(108,77,255,0.55)] md:p-[2rem]">
              <div className="mb-[1.5rem] flex items-center justify-between gap-[1rem]">
                <div>
                  <p className="text-muted-foreground inline-flex items-center gap-[0.4rem] text-xs font-semibold">
                    <LuClock3 className="h-[1.3rem] w-[1.3rem]" />
                    신청 마감
                  </p>
                  <p className="text-foreground mt-[0.3rem] text-sm font-black">{formatDate(adData.adEndedAt)}</p>
                </div>
                <span className={`${ddayClass} rounded-full px-[1rem] py-[0.4rem] text-sm font-semibold`}>{adDday || "미정"}</span>
              </div>
              <h2 className="text-foreground text-xl leading-snug font-black tracking-[-0.025em] break-keep">{actionTitle}</h2>
              <p className="text-muted-foreground mt-[0.55rem] mb-[1.5rem] text-sm leading-relaxed break-keep">{actionDescription}</p>
              <AdButton meetupId={meetupId} />
            </section>

            <div className="text-muted-foreground flex items-start gap-[0.6rem] px-[0.4rem] text-xs leading-relaxed break-keep">
              <LuShieldCheck className="mt-[0.15rem] h-[1.4rem] w-[1.4rem] shrink-0 stroke-[1.8]" />
              가입 신청 전 활동 지역과 기간을 다시 확인해주세요.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default AdArea;
