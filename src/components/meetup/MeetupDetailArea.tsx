"use client";

import CategoryBadge from "@/components/common/CategoryBadge";
import ResourceState from "@/components/common/ResourceState";
import ReplyArea from "@/components/common/reply/ReplyArea";
import KakaoMaps from "@/components/kakao/KakaoMaps";
import { useAdItem } from "@/hooks/useAdItem";
import { useModal } from "@/hooks/useModal";
import { useMeetupMembers, useSchedules } from "@/hooks/useSchedule";
import { RootState } from "@/stores/store";
import { Schedule } from "@/types/scheduleType";
import { getImageURL, getS3ImageURL } from "@/utils/getImageURL";
import { isNotFoundError } from "@/utils/httpError";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft, LuCalendarDays, LuChevronRight, LuCrown, LuLockKeyhole, LuMap, LuMapPin, LuMaximize2, LuPencil, LuPlus, LuUsersRound, LuX } from "react-icons/lu";
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
    openModal("MEETUP_MEMBERS", { meetupId, meetupName: meetupData.name });
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
      <div className="mx-auto w-[calc(100%-3.2rem)] max-w-[112rem] space-y-[1.6rem] py-[2.4rem] md:py-[3.2rem]">
        <div className="bg-muted h-[2.4rem] w-[10rem] animate-pulse rounded-full" />
        <div className="bg-muted h-[32rem] animate-pulse rounded-[2.4rem]" />
        <div className="grid gap-[1.6rem] lg:grid-cols-[minmax(0,1fr)_34rem]">
          <div className="bg-muted h-[32rem] animate-pulse rounded-[2rem]" />
          <div className="bg-muted h-[32rem] animate-pulse rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (meetupError) {
    const isNotFound = isNotFoundError(meetupError);
    return (
      <ResourceState
        kind={isNotFound ? "not-found" : "error"}
        title={isNotFound ? "모임을 찾을 수 없어요" : "모임 정보를 불러오지 못했어요"}
        description={isNotFound ? "삭제되었거나 존재하지 않는 모임이에요." : "잠시 후 다시 시도해주세요."}
        actionHref="/my-space/my-meetup"
        actionLabel="모임 공간 목록"
      />
    );
  }

  if (!meetupData) return null;

  const upcomingSchedules = schedules ?? [];
  const visibleMembers = members?.slice(0, 8) ?? [];

  return (
    <main className="mx-auto w-[calc(100%-3.2rem)] max-w-[112rem] py-[2rem] pb-[8rem] md:py-[2.6rem] md:pb-[5rem]">
      <Link href="/my-space/my-meetup" className="text-muted-foreground hover:text-foreground mb-[1.3rem] inline-flex items-center gap-[0.5rem] text-sm font-bold transition-colors">
        <LuArrowLeft className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
        모임 공간 목록
      </Link>

      <article className="border-border bg-card surface-shadow overflow-hidden rounded-[2.4rem] border">
        <div className="grid min-[820px]:grid-cols-[34rem_minmax(0,1fr)]">
          <div className="bg-muted relative h-[22rem] overflow-hidden min-[820px]:h-auto min-[820px]:min-h-[31rem]">
            <Image
              unoptimized
              src={getImageURL(meetupData.image || null)}
              alt={`${meetupData.name} 대표 이미지`}
              fill
              priority
              sizes="(max-width: 819px) calc(100vw - 3.2rem), 34rem"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col px-[1.8rem] py-[2rem] md:px-[2.6rem] md:py-[2.6rem]">
            <div className="flex items-start justify-between gap-[1.2rem]">
              <div className="flex flex-wrap items-center gap-[0.6rem]">
                <CategoryBadge category={meetupData.category} size="md" />
                {!meetupData.isPublic && (
                  <span className="border-border text-muted-foreground inline-flex items-center gap-[0.4rem] rounded-full border px-[0.9rem] py-[0.35rem] text-xs font-semibold">
                    <LuLockKeyhole className="h-[1.3rem] w-[1.3rem]" />
                    멤버 전용
                  </span>
                )}
              </div>

              {isOrganizer && (
                <Link
                  href={`/meetup/edit/${meetupId}`}
                  className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex h-[3.4rem] shrink-0 items-center gap-[0.45rem] rounded-full border px-[1rem] text-xs font-bold transition-colors"
                >
                  <LuPencil className="h-[1.4rem] w-[1.4rem]" />
                  모임 수정
                </Link>
              )}
            </div>

            <div className="mt-[1.4rem]">
              <p className="text-primary mb-[0.5rem] text-xs font-black">우리의 모임 공간</p>
              <h1 className="text-foreground text-[2.8rem] leading-tight font-black tracking-[-0.04em] break-keep md:text-[3.5rem]">{meetupData.name}</h1>
              <p className="text-muted-foreground mt-[0.8rem] line-clamp-2 max-w-[68rem] text-sm leading-[1.7] break-keep">{meetupData.description}</p>
            </div>

            <div className="bg-muted/55 mt-[1.5rem] grid gap-[1.2rem] rounded-[1.6rem] p-[1.3rem] md:grid-cols-2">
              <InfoRow icon={LuMapPin} label="활동 지역" value={`${meetupData.place} · ${meetupData.placeDescription}`} />
              <InfoRow icon={LuCalendarDays} label="활동 기간" value={formatDateRange(meetupData.startedAt, meetupData.endedAt)} />
            </div>

            <div className="mt-[1.6rem] flex flex-wrap items-center justify-between gap-[1.4rem]">
              <div className="flex min-w-0 items-center gap-[0.8rem]">
                <div className="relative h-[4.2rem] w-[4.2rem] shrink-0 overflow-hidden rounded-[1.3rem]">
                  <Image unoptimized src={getImageURL(meetupData.organizer.image)} alt={meetupData.organizer.nickname} fill sizes="4.2rem" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground inline-flex items-center gap-[0.35rem] text-xs font-semibold">
                    방장
                    <LuCrown className="text-primary h-[1.3rem] w-[1.3rem] stroke-[2]" />
                  </p>
                  <p className="text-foreground truncate text-sm font-black">{meetupData.organizer.nickname}</p>
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-[0.7rem] sm:flex sm:w-auto">
                <button
                  type="button"
                  onClick={handleMembersOpen}
                  className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex h-[4.4rem] items-center justify-center gap-[0.55rem] rounded-[1.3rem] border px-[1.3rem] text-sm font-bold transition-colors"
                >
                  <LuUsersRound className="h-[1.7rem] w-[1.7rem]" />
                  멤버 {members?.length ?? 0}명
                </button>
                <Link
                  href={`/meetup/${meetupId}/schedule/create`}
                  className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-[4.4rem] items-center justify-center gap-[0.55rem] rounded-[1.3rem] px-[1.4rem] text-sm font-black transition-colors"
                >
                  <LuPlus className="h-[1.7rem] w-[1.7rem] stroke-[2.2]" />
                  일정 만들기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="mt-[2.4rem] grid items-start gap-[2rem] lg:grid-cols-[minmax(0,1fr)_34rem] lg:gap-[2.4rem]">
        <section className="border-border bg-card overflow-hidden rounded-[2.2rem] border">
          <div className="border-border flex items-end justify-between gap-[1rem] border-b px-[1.8rem] py-[1.6rem] md:px-[2.2rem]">
            <div>
              <p className="text-primary text-xs font-black">UPCOMING</p>
              <h2 className="text-foreground mt-[0.2rem] text-xl font-black tracking-[-0.025em]">다가오는 일정</h2>
              <p className="text-muted-foreground mt-[0.35rem] text-sm">확정된 만남과 장소를 확인해요.</p>
            </div>
            <span className="bg-primary-soft text-primary shrink-0 rounded-full px-[0.9rem] py-[0.3rem] text-sm font-bold">{upcomingSchedules.length}개</span>
          </div>

          <div className="p-[1.2rem] md:p-[1.5rem]">
            {isSchedulesPending ? (
              <div className="space-y-[0.8rem]">
                {[0, 1, 2].map(item => (
                  <div key={item} className="border-border flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem]">
                    <div className="bg-muted h-[6.4rem] w-[6.4rem] animate-pulse rounded-[1.2rem]" />
                    <div className="flex-1 space-y-[0.6rem]">
                      <div className="bg-muted h-[1.2rem] w-[12rem] animate-pulse rounded-full" />
                      <div className="bg-muted h-[1.2rem] w-[18rem] animate-pulse rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : schedulesError ? (
              <div className="bg-muted/50 text-muted-foreground rounded-[1.6rem] p-[2rem] text-center text-sm">일정을 불러오지 못했어요.</div>
            ) : upcomingSchedules.length > 0 ? (
              <div className="space-y-[0.8rem]">
                {upcomingSchedules.map((schedule, index) => (
                  <SchedulePreviewCard key={schedule.id} schedule={schedule} number={index + 1} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/45 rounded-[1.8rem] px-[2rem] py-[3.2rem] text-center">
                <span className="bg-primary-soft text-primary mx-auto grid h-[4.4rem] w-[4.4rem] place-items-center rounded-[1.4rem]">
                  <LuCalendarDays className="h-[2rem] w-[2rem]" />
                </span>
                <p className="text-foreground mt-[1.1rem] text-sm font-bold">아직 등록된 일정이 없어요.</p>
                <p className="text-muted-foreground mt-[0.35rem] text-sm">첫 일정을 만들어 멤버들에게 알려주세요.</p>
                <Link
                  href={`/meetup/${meetupId}/schedule/create`}
                  className="bg-primary text-primary-foreground mt-[1.4rem] inline-flex h-[4rem] items-center gap-[0.55rem] rounded-full px-[1.4rem] text-sm font-bold transition hover:opacity-90"
                >
                  <LuPlus className="h-[1.6rem] w-[1.6rem]" />
                  일정 만들기
                </Link>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-[1.2rem] lg:sticky lg:top-[9.2rem]">
          <section className="border-border bg-card rounded-[2rem] border p-[1.5rem]">
            <div className="mb-[1.3rem] flex items-center justify-between gap-[1rem]">
              <h2 className="text-foreground inline-flex items-center gap-[0.55rem] text-sm font-black">
                <LuUsersRound className="text-primary h-[1.7rem] w-[1.7rem]" />
                함께하는 멤버
                <span className="text-primary">{members?.length ?? 0}</span>
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
            ) : visibleMembers.length > 0 ? (
              <div className="grid grid-cols-4 gap-x-[0.8rem] gap-y-[1.2rem]">
                {visibleMembers.map(member => (
                  <div key={member.id} className="min-w-0 text-center">
                    <div className="relative mx-auto h-[4.4rem] w-[4.4rem] overflow-hidden rounded-full">
                      <Image unoptimized src={getImageURL(member.user.image)} alt={member.user.nickname} fill sizes="4.4rem" className="object-cover" />
                    </div>
                    <span className="text-muted-foreground mt-[0.45rem] block truncate text-xs">{member.user.nickname}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-[1rem] text-center text-sm">표시할 멤버가 없어요.</p>
            )}
          </section>

          <section className="border-border bg-card overflow-hidden rounded-[2rem] border">
            <div className="flex items-center justify-between gap-[1rem] px-[1.5rem] py-[1.2rem]">
              <div>
                <h2 className="text-foreground inline-flex items-center gap-[0.55rem] text-sm font-black">
                  <LuMap className="text-primary h-[1.7rem] w-[1.7rem]" />
                  일정 지도
                </h2>
                <p className="text-muted-foreground mt-[0.25rem] text-xs">일정 장소를 한눈에 확인해요.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapExpanded(true)}
                className="bg-primary-soft text-primary hover:bg-primary-soft/70 grid h-[3.8rem] w-[3.8rem] place-items-center rounded-[1.2rem] transition-colors"
                aria-label="지도 크게 보기"
              >
                <LuMaximize2 className="h-[1.8rem] w-[1.8rem] stroke-[2]" />
              </button>
            </div>
            <div className="bg-muted h-[26rem] overflow-hidden">
              <KakaoMaps meetupId={meetupId} />
            </div>
          </section>
        </aside>

        <section className="border-border bg-card overflow-hidden rounded-[2.2rem] border lg:col-start-1">
          <ReplyArea variant="card" />
        </section>
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
                className="bg-card/95 text-muted-foreground hover:text-foreground absolute top-[1.2rem] right-[1.2rem] z-10 grid h-[4rem] w-[4rem] place-items-center rounded-full shadow-[0_0.8rem_2rem_rgba(22,21,15,0.14)] backdrop-blur transition-colors"
                aria-label="큰 지도 닫기"
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
                    <span className="bg-primary text-primary-foreground grid h-[2.8rem] w-[2.8rem] shrink-0 place-items-center rounded-full text-xs font-bold">{index + 1}</span>
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
  <div className="flex min-w-0 items-start gap-[0.8rem]">
    <span className="bg-primary-soft text-primary grid h-[3.5rem] w-[3.5rem] shrink-0 place-items-center rounded-[1.1rem]">
      <Icon className="h-[1.7rem] w-[1.7rem] stroke-[1.9]" />
    </span>
    <div className="min-w-0 pt-[0.1rem]">
      <p className="text-muted-foreground text-xs font-semibold">{label}</p>
      <p className="text-foreground mt-[0.2rem] text-sm font-bold break-keep">{value}</p>
    </div>
  </div>
);

const SchedulePreviewCard = ({ schedule, number }: { schedule: Schedule; number: number }) => (
  <Link
    href={`/meetup/${schedule.meetupId}/schedule/${schedule.id}`}
    className="border-border bg-background/55 hover:border-primary/35 flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem] transition-colors"
  >
    <div className="bg-muted relative h-[6.8rem] w-[6.8rem] shrink-0 overflow-hidden rounded-[1.2rem]">
      <Image unoptimized src={getS3ImageURL(schedule.image)} alt={schedule.place} fill sizes="6.8rem" className="object-cover" />
      <span className="bg-primary text-primary-foreground absolute top-[0.5rem] left-[0.5rem] grid h-[2.2rem] min-w-[2.2rem] place-items-center rounded-full px-[0.5rem] text-xs font-bold">
        {number}
      </span>
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-primary text-xs font-bold">
        {formatDate(schedule.scheduledAt)} · {formatTime(schedule.scheduledAt)}
      </p>
      <p className="text-foreground mt-[0.3rem] truncate text-sm font-black">{schedule.place}</p>
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
