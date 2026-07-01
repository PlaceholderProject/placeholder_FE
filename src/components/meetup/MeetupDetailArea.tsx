"use client";

import CategoryBadge from "@/components/common/CategoryBadge";
import ReplyArea from "@/components/common/reply/ReplyArea";
import KakaoMaps from "@/components/kakao/KakaoMaps";
import { useModal } from "@/hooks/useModal";
import { useAdItem } from "@/hooks/useAdItem";
import { useMeetupMembers, useSchedules } from "@/hooks/useSchedule";
import { RootState } from "@/stores/store";
import { Schedule } from "@/types/scheduleType";
import { getDday } from "@/utils/getDday";
import { getImageURL, getS3ImageURL } from "@/utils/getImageURL";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft, LuCalendarDays, LuChevronRight, LuGlobe, LuHeart, LuLockKeyhole, LuMapPin, LuMaximize2, LuMessageCircle, LuPencil, LuPlus, LuUsersRound, LuX } from "react-icons/lu";
import { useSelector } from "react-redux";

interface MeetupDetailAreaProps {
  meetupId: number;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "미정";
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(new Date(dateString));
};

const formatTime = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(dateString));
};

const formatDateRange = (startedAt: string | null, endedAt: string | null) => {
  if (!startedAt && !endedAt) return "일정 미정";
  if (startedAt && (!endedAt || startedAt === endedAt)) return formatDate(startedAt);
  return `${formatDate(startedAt)} - ${formatDate(endedAt)}`;
};

const MeetupDetailArea = ({ meetupId }: MeetupDetailAreaProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const { adData: meetupData, isPending: isMeetupPending, error: meetupError } = useAdItem(meetupId);
  const { data: schedules, isPending: isSchedulesPending, error: schedulesError } = useSchedules(meetupId);
  const { data: members, isPending: isMembersPending } = useMeetupMembers(meetupId);

  const isOrganizer = useMemo(() => {
    if (!meetupData || !currentUser.nickname) return false;
    return meetupData.organizer.nickname === currentUser.nickname;
  }, [currentUser.nickname, meetupData]);

  const handleMembersOpen = () => {
    if (!meetupData) return;
    openModal("MEETUP_MEMBERS", {
      meetupId,
      meetupName: meetupData.name,
    });
  };

  const handleCreateSchedule = () => {
    router.push(`/meetup/${meetupId}/schedule/create`);
  };

  useEffect(() => {
    if (!isMapExpanded) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMapExpanded(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMapExpanded]);

  if (isMeetupPending) {
    return (
      <div className="mx-auto w-[95%] max-w-[120rem] space-y-[1.6rem] py-[2.4rem] md:py-[3.2rem]">
        <div className="bg-muted h-[2.4rem] w-[10rem] animate-pulse rounded-full" />
        <div className="bg-muted h-[28rem] animate-pulse rounded-[2rem] md:h-[34rem]" />
        <div className="grid gap-[1.6rem] lg:grid-cols-[1fr_32rem]">
          <div className="bg-muted h-[22rem] animate-pulse rounded-[2rem]" />
          <div className="bg-muted h-[22rem] animate-pulse rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (meetupError) {
    return (
      <div className="mx-auto flex min-h-[40rem] w-[95%] max-w-[72rem] items-center justify-center py-[4rem]">
        <div className="border-border bg-card rounded-[2rem] border p-[2.4rem] text-center">
          <p className="text-foreground font-semibold">모임 정보를 불러오지 못했어요.</p>
          <p className="text-muted-foreground mt-[0.5rem] text-sm">{meetupError.message}</p>
        </div>
      </div>
    );
  }

  if (!meetupData) return null;

  const upcomingSchedules = schedules ?? [];
  const visibleMembers = members?.slice(0, 8) ?? [];

  return (
    <main className="mx-auto w-[95%] max-w-[120rem] space-y-[2rem] py-[2.4rem] pb-[8rem] md:space-y-[2.4rem] md:py-[3.2rem] md:pb-[4rem]">
      <button type="button" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
        <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
        뒤로
      </button>

      <section className="bg-muted relative h-[28rem] overflow-hidden rounded-[2rem] md:h-[34rem]">
        <Image unoptimized src={getImageURL(meetupData.image || null)} alt={meetupData.name} fill priority sizes="(min-width: 1024px) 120rem, 95vw" className="object-cover" />
        <div className="from-foreground/75 via-foreground/20 absolute inset-0 bg-gradient-to-t to-transparent" />

        <div className="absolute top-[1.6rem] left-[1.6rem] flex flex-wrap gap-[0.7rem]">
          <CategoryBadge category={meetupData.category} size="md" variant="solid" />
          <span className="bg-background/85 text-foreground inline-flex items-center gap-[0.5rem] rounded-full px-[1rem] py-[0.4rem] text-sm font-semibold backdrop-blur-md">
            {meetupData.isPublic ? <LuGlobe className="h-[1.4rem] w-[1.4rem]" /> : <LuLockKeyhole className="h-[1.4rem] w-[1.4rem]" />}
            {meetupData.isPublic ? "공개 모임" : "비공개 모임"}
          </span>
        </div>

        <div className="text-background absolute right-[1.6rem] bottom-[1.6rem] left-[1.6rem] md:right-[2rem] md:bottom-[2rem] md:left-[2rem]">
          <p className="text-background/85 mb-[0.7rem] inline-flex items-center gap-[0.5rem] text-sm font-semibold">
            <LuMapPin className="h-[1.5rem] w-[1.5rem]" />
            {meetupData.place} · {meetupData.placeDescription}
          </p>
          <h1 className="max-w-[78rem] text-3xl leading-tight font-bold break-keep md:text-4xl">{meetupData.name}</h1>
        </div>
      </section>

      <div className="grid gap-[2rem] lg:grid-cols-[minmax(0,1fr)_34rem] lg:items-start">
        <div className="space-y-[2rem]">
          <section className="border-border bg-card flex items-center justify-between gap-[1.4rem] rounded-[2rem] border p-[1.6rem]">
            <div className="flex min-w-0 items-center gap-[1rem]">
              <div className="relative h-[4.8rem] w-[4.8rem] shrink-0 overflow-hidden rounded-full">
                <Image unoptimized src={getImageURL(meetupData.organizer.image)} alt={meetupData.organizer.nickname} fill sizes="4.8rem" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-semibold">모임장</p>
                <p className="text-foreground truncate text-sm font-bold">{meetupData.organizer.nickname}</p>
              </div>
            </div>

            <div className="text-muted-foreground flex shrink-0 items-center gap-[1.4rem] text-sm">
              <span className="inline-flex items-center gap-[0.45rem]">
                <LuMessageCircle className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />
                {meetupData.commentCount}
              </span>
              <span className="inline-flex items-center gap-[0.45rem]">
                <LuHeart className={`h-[1.9rem] w-[1.9rem] stroke-[1.8] ${meetupData.isLike ? "fill-destructive text-destructive" : ""}`} />
                {meetupData.likeCount}
              </span>
            </div>
          </section>

          <section className="border-border bg-card rounded-[2rem] border p-[1.8rem] md:p-[2rem]">
            <h2 className="text-foreground text-lg font-bold">모임 소개</h2>
            <p className="text-muted-foreground mt-[0.8rem] text-sm leading-relaxed break-keep whitespace-pre-line">{meetupData.description}</p>

            <div className="mt-[1.6rem] grid gap-[1rem] md:grid-cols-2">
              <InfoRow icon={LuMapPin} label="장소" value={`${meetupData.place} · ${meetupData.placeDescription}`} />
              <InfoRow icon={LuCalendarDays} label="모임 기간" value={formatDateRange(meetupData.startedAt, meetupData.endedAt)} />
            </div>
          </section>

          <section className="space-y-[1rem]">
            <div className="flex items-center justify-between gap-[1rem]">
              <div>
                <h2 className="text-foreground text-xl font-bold">다가오는 일정</h2>
                <p className="text-muted-foreground mt-[0.3rem] text-sm">확정된 만남과 장소를 확인해요.</p>
              </div>
              <span className="text-muted-foreground shrink-0 text-sm font-semibold">{upcomingSchedules.length}개</span>
            </div>

            {isSchedulesPending ? (
              <div className="space-y-[0.8rem]">
                {[0, 1, 2].map(item => (
                  <div key={item} className="border-border bg-card flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem]">
                    <div className="bg-muted h-[6.4rem] w-[6.4rem] animate-pulse rounded-[1.2rem]" />
                    <div className="flex-1 space-y-[0.6rem]">
                      <div className="bg-muted h-[1.2rem] w-[12rem] animate-pulse rounded-full" />
                      <div className="bg-muted h-[1.2rem] w-[18rem] animate-pulse rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : schedulesError ? (
              <div className="border-border bg-card text-muted-foreground rounded-[1.6rem] border p-[2rem] text-center text-sm">{schedulesError.message}</div>
            ) : upcomingSchedules.length > 0 ? (
              <div className="space-y-[0.8rem]">
                {upcomingSchedules.map((schedule, index) => (
                  <SchedulePreviewCard key={schedule.id} schedule={schedule} number={index + 1} />
                ))}
              </div>
            ) : (
              <div className="border-border bg-card rounded-[2rem] border border-dashed p-[3rem] text-center">
                <p className="text-foreground text-sm font-semibold">아직 등록된 일정이 없어요.</p>
                <p className="text-muted-foreground mt-[0.4rem] text-sm">첫 일정을 만들면 지도와 목록에 표시됩니다.</p>
                <button
                  type="button"
                  onClick={handleCreateSchedule}
                  className="bg-primary text-primary-foreground mt-[1.4rem] inline-flex h-[4rem] items-center gap-[0.6rem] rounded-full px-[1.5rem] text-sm font-semibold transition hover:opacity-90"
                >
                  <LuPlus className="h-[1.6rem] w-[1.6rem]" />
                  일정 만들기
                </button>
              </div>
            )}
          </section>

          <section className="border-border bg-card overflow-hidden rounded-[2rem] border">
            <ReplyArea variant="card" />
          </section>
        </div>

        <aside className="space-y-[1.2rem] lg:sticky lg:top-[8.4rem]">
          <section className="border-border bg-card relative h-[28rem] overflow-hidden rounded-[2rem] border lg:h-[32rem]">
            <button
              type="button"
              onClick={() => setIsMapExpanded(true)}
              className="bg-primary-soft/95 text-primary hover:bg-primary-soft absolute top-[1rem] right-[1rem] z-10 grid h-[4rem] w-[4rem] place-items-center rounded-[1.2rem] shadow-[0_0.8rem_2rem_rgba(110,59,255,0.18)] backdrop-blur transition-colors"
              aria-label="지도 크게 보기"
              title="지도 크게 보기"
            >
              <LuMaximize2 className="h-[1.9rem] w-[1.9rem] stroke-[2]" />
            </button>
            <div className="bg-muted h-full overflow-hidden">
              <KakaoMaps meetupId={meetupId} />
            </div>
          </section>

          <section className="border-border bg-card rounded-[2rem] border p-[1.5rem]">
            <div className="mb-[1.2rem] flex items-center justify-between gap-[1rem]">
              <h2 className="text-foreground inline-flex items-center gap-[0.6rem] text-sm font-bold">
                <LuUsersRound className="h-[1.7rem] w-[1.7rem] stroke-[1.9]" />
                멤버 {members?.length ?? 0}
              </h2>
              <button type="button" onClick={handleMembersOpen} className="text-primary text-xs font-bold transition hover:opacity-70">
                전체 보기
              </button>
            </div>

            {isMembersPending ? (
              <div className="flex gap-[0.7rem]">
                {[0, 1, 2, 3].map(item => (
                  <div key={item} className="bg-muted h-[4.4rem] w-[4.4rem] animate-pulse rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-[1rem]">
                {visibleMembers.map(member => (
                  <div key={member.id} className="flex w-[5.4rem] flex-col items-center gap-[0.5rem]">
                    <div className="relative h-[4.4rem] w-[4.4rem] overflow-hidden rounded-full">
                      <Image unoptimized src={getImageURL(member.user.image)} alt={member.user.nickname} fill sizes="4.4rem" className="object-cover" />
                    </div>
                    <span className="text-muted-foreground max-w-full truncate text-xs">{member.user.nickname}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border-border bg-card rounded-[2rem] border p-[1.5rem]">
            <div className="mb-[1.2rem] flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-semibold">모집 마감</span>
              <span className="bg-accent text-accent-foreground rounded-full px-[0.8rem] py-[0.25rem] font-mono text-sm font-semibold">{getDday(meetupData.adEndedAt)}</span>
            </div>
            <p className="text-foreground text-sm leading-snug font-bold break-keep">{meetupData.adTitle}</p>

            <div className="mt-[1.4rem] grid gap-[0.8rem]">
              <button
                type="button"
                onClick={handleCreateSchedule}
                className="bg-primary text-primary-foreground flex h-[4.4rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] text-sm font-semibold transition hover:opacity-90"
              >
                <LuPlus className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
                일정 만들기
              </button>
              {isOrganizer && (
                <Link
                  href={`/meetup/edit/${meetupId}`}
                  className="border-border text-muted-foreground hover:bg-muted flex h-[4.4rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] border text-sm font-semibold transition-colors"
                >
                  <LuPencil className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
                  모임 수정
                </Link>
              )}
            </div>
          </section>
        </aside>
      </div>

      {isMapExpanded && (
        <div className="bg-background/80 fixed inset-0 z-[60] flex items-center justify-center p-[1.2rem] backdrop-blur-md" onClick={() => setIsMapExpanded(false)}>
          <section
            className="border-border bg-card flex h-[86vh] w-full max-w-[112rem] flex-col overflow-hidden rounded-[2rem] border shadow-[0_2rem_5rem_rgba(22,21,15,0.16)]"
            onClick={event => event.stopPropagation()}
          >
            <div className="bg-muted relative min-h-0 flex-1">
              <button
                type="button"
                onClick={() => setIsMapExpanded(false)}
                className="bg-card/95 text-muted-foreground hover:bg-card hover:text-foreground absolute top-[1.2rem] right-[1.2rem] z-10 grid h-[4rem] w-[4rem] shrink-0 place-items-center rounded-full shadow-[0_0.8rem_2rem_rgba(22,21,15,0.14)] backdrop-blur transition-colors"
                aria-label="큰 지도 닫기"
                title="큰 지도 닫기"
              >
                <LuX className="h-[2rem] w-[2rem] stroke-[1.9]" />
              </button>
              <KakaoMaps meetupId={meetupId} />
            </div>

            {upcomingSchedules.length > 0 && (
              <div className="border-border bg-card/95 flex gap-[0.8rem] overflow-x-auto border-t p-[1rem]">
                {upcomingSchedules.map((schedule, index) => (
                  <Link
                    key={schedule.id}
                    href={`/meetup/${schedule.meetupId}/schedule/${schedule.id}`}
                    className="border-border bg-background hover:border-primary/35 flex min-w-[18rem] items-center gap-[0.8rem] rounded-[1.3rem] border px-[1rem] py-[0.8rem] transition-colors"
                  >
                    <span className="bg-primary text-primary-foreground grid h-[2.8rem] w-[2.8rem] shrink-0 place-items-center rounded-full font-mono text-xs font-bold">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-bold">{schedule.place}</p>
                      <p className="text-muted-foreground truncate text-xs">{formatDate(schedule.scheduledAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof LuMapPin; label: string; value: string }) => (
  <div className="bg-muted/70 flex items-start gap-[0.8rem] rounded-[1.4rem] px-[1.2rem] py-[1rem]">
    <Icon className="text-primary mt-[0.2rem] h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.9]" />
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs font-semibold">{label}</p>
      <p className="text-foreground mt-[0.2rem] text-sm break-keep">{value}</p>
    </div>
  </div>
);

const SchedulePreviewCard = ({ schedule, number }: { schedule: Schedule; number: number }) => (
  <Link
    href={`/meetup/${schedule.meetupId}/schedule/${schedule.id}`}
    className="border-border bg-card hover:border-primary/35 flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem] transition-colors"
  >
    <div className="bg-muted relative h-[6.8rem] w-[6.8rem] shrink-0 overflow-hidden rounded-[1.2rem]">
      <Image unoptimized src={getS3ImageURL(schedule.image)} alt={schedule.place} fill sizes="6.8rem" className="object-cover" />
      <span className="bg-foreground/80 text-background absolute top-[0.5rem] left-[0.5rem] grid h-[2.2rem] min-w-[2.2rem] place-items-center rounded-full px-[0.5rem] font-mono text-xs font-bold backdrop-blur">
        {number}
      </span>
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-primary font-mono text-xs font-semibold">
        {formatDate(schedule.scheduledAt)} · {formatTime(schedule.scheduledAt)}
      </p>
      <p className="text-foreground mt-[0.3rem] truncate text-sm font-bold">{schedule.place}</p>
      <p className="text-muted-foreground mt-[0.2rem] truncate text-xs">{schedule.address}</p>
      <p className="text-muted-foreground mt-[0.5rem] inline-flex items-center gap-[0.35rem] text-xs">
        <LuUsersRound className="h-[1.3rem] w-[1.3rem] stroke-[1.8]" />
        {schedule.participant.length}명 참여
      </p>
    </div>

    <LuChevronRight className="text-muted-foreground h-[1.8rem] w-[1.8rem] shrink-0" />
  </Link>
);

export default MeetupDetailArea;
