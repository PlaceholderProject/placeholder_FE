"use client";

import ReplyArea from "@/components/common/reply/ReplyArea";
import ResourceState from "@/components/common/ResourceState";
import ScheduleDetailSkeleton from "@/components/schedule/ScheduleDetailSkeleton";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useScheduleDetail, useSchedules, useUpdateSchedule } from "@/hooks/useSchedule";
import { Schedule, SchedulePayload } from "@/types/scheduleType";
import { getS3ImageURL } from "@/utils/getImageURL";
import { isNotFoundError } from "@/utils/httpError";
import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { CustomOverlayMap, Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { SkeletonTheme } from "react-loading-skeleton";
import { LuArrowLeft, LuCalendarClock, LuCamera, LuImage, LuImageUp, LuLoaderCircle, LuMapPin, LuPencil, LuSave, LuTrash2, LuUsersRound, LuX } from "react-icons/lu";
import { toast } from "sonner";

interface LatLng {
  lat: number;
  lng: number;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "미정";
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(new Date(dateString));
};

const formatTime = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(dateString));
};

const toLatLng = (schedule: Schedule): LatLng | null => {
  const lat = Number(schedule.latitude);
  const lng = Number(schedule.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
};

const MapStatus = ({ title, description }: { title: string; description?: string }) => (
  <div className="bg-muted/70 flex h-full min-h-[18rem] w-full items-center justify-center p-[1.6rem] text-center">
    <div>
      <span className="bg-primary-soft text-primary mx-auto mb-[1rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full">
        <LuMapPin className="h-[2rem] w-[2rem] stroke-[1.9]" />
      </span>
      <p className="text-foreground text-sm font-bold">{title}</p>
      {description && <p className="text-muted-foreground mt-[0.4rem] text-xs leading-relaxed break-keep">{description}</p>}
    </div>
  </div>
);

const ScheduleMapLoader = ({ appKey, position, place }: { appKey: string; position: LatLng; place: string }) => {
  const [loading, error] = useKakaoLoader({ appkey: appKey, libraries: ["services"] });

  if (loading) return <MapStatus title="지도를 불러오는 중" />;
  if (error) return <MapStatus title="지도를 불러오지 못했어요" description="잠시 후 다시 확인해주세요." />;

  return (
    <Map center={position} style={{ width: "100%", height: "100%" }} level={3}>
      <CustomOverlayMap position={position} xAnchor={0.5} yAnchor={1}>
        <div className="flex flex-col items-center">
          <span className="bg-background/95 text-foreground mb-[0.6rem] max-w-[18rem] truncate rounded-full px-[1rem] py-[0.45rem] text-xs font-bold shadow-[0_0.8rem_2rem_rgba(22,21,15,0.14)] backdrop-blur">
            {place}
          </span>
          <span className="bg-primary text-primary-foreground grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full shadow-[0_1rem_2.4rem_rgba(110,59,255,0.32)]">
            <LuMapPin className="fill-primary-foreground/15 h-[2.2rem] w-[2.2rem] stroke-[2]" />
          </span>
        </div>
      </CustomOverlayMap>
    </Map>
  );
};

const ScheduleLocationMap = ({ schedule }: { schedule: Schedule }) => {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY;
  const position = toLatLng(schedule);

  if (!position) return <MapStatus title="위치 좌표를 찾지 못했어요" />;
  if (!appKey) return <MapStatus title="지도를 표시할 수 없어요" />;
  return <ScheduleMapLoader appKey={appKey} position={position} place={schedule.place} />;
};

const ScheduleDetail = ({ scheduleId, meetupId }: { scheduleId: number; meetupId: number }) => {
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);
  const { data: schedules } = useSchedules(meetupId);
  const imageUploadMutation = useImageUpload();
  const updateMutation = useUpdateSchedule(scheduleId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  useEffect(() => {
    setImagePreview(schedule?.image ? getS3ImageURL(schedule.image) : null);
    setIsImageRemoved(false);
  }, [schedule]);

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

  const scheduleNumber = useMemo(() => {
    if (!schedules || !schedule) return 1;
    const index = schedules.findIndex(item => item.id === schedule.id);
    return index >= 0 ? index + 1 : 1;
  }, [schedules, schedule]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNewImageFile(file);
    setIsImageRemoved(false);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveImages = async () => {
    if (!schedule) return;

    if (!newImageFile && !isImageRemoved) {
      setIsEditingImage(false);
      return;
    }

    try {
      const nextImage = newImageFile
        ? (
            await imageUploadMutation.mutateAsync({
              files: [newImageFile],
              target: "schedule",
            })
          )[0] || schedule.image
        : null;

      const payload: SchedulePayload = {
        scheduledAt: schedule.scheduledAt,
        place: schedule.place,
        address: schedule.address,
        latitude: schedule.latitude,
        longitude: schedule.longitude,
        memo: schedule.memo,
        participant: schedule.participant.map(participant => participant.id),
        image: nextImage,
      };

      await updateMutation.mutateAsync({ scheduleId, payload });
      setIsEditingImage(false);
      setNewImageFile(null);
      setIsImageRemoved(false);
    } catch (err) {
      console.error("이미지 수정 실패:", err);
      toast.error("이미지 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingImage(false);
    setNewImageFile(null);
    setIsImageRemoved(false);
    setImagePreview(schedule?.image ? getS3ImageURL(schedule.image) : null);
  };

  const handleRemoveImage = () => {
    setNewImageFile(null);
    setIsImageRemoved(true);
    setImagePreview(null);
  };

  if (isPending) {
    return (
      <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
        <ScheduleDetailSkeleton />
      </SkeletonTheme>
    );
  }

  const isMismatchedMeetup = !!schedule && schedule.meetupId !== meetupId;

  if (error || !schedule || isMismatchedMeetup) {
    const isNotFound = isMismatchedMeetup || isNotFoundError(error) || (!schedule && !error);
    return (
      <ResourceState
        kind={isNotFound ? "not-found" : "error"}
        title={isNotFound ? "일정을 찾을 수 없어요" : "일정 정보를 불러오지 못했어요"}
        description={isNotFound ? "삭제되었거나 이 모임에 속하지 않은 일정이에요." : "잠시 후 다시 시도해주세요."}
        actionHref={`/meetup/${meetupId}`}
        actionLabel="모임으로 돌아가기"
      />
    );
  }

  const isSubmitting = updateMutation.isPending || imageUploadMutation.isPending;
  const visibleParticipants = schedule.participant.slice(0, 4);
  const extraParticipantCount = Math.max(schedule.participant.length - visibleParticipants.length, 0);

  return (
    <div className="py-[2rem] pb-[8rem] md:py-[2.6rem] md:pb-[5rem]">
      <div className="mx-auto w-[calc(100%-3.2rem)] max-w-[64rem]">
        <Link href={`/meetup/${meetupId}`} className="text-muted-foreground hover:text-foreground mb-[1.3rem] inline-flex items-center gap-[0.5rem] text-sm font-bold transition-colors">
          <LuArrowLeft className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
          모임으로
        </Link>

        <article className="border-border bg-card overflow-hidden rounded-[2.2rem] border">
          <div className={`bg-muted relative overflow-hidden ${imagePreview ? "aspect-square" : "h-[28rem]"}`}>
            {imagePreview ? (
              <Image unoptimized src={imagePreview} alt={`${schedule.place} 일정 사진`} fill priority sizes="(min-width: 768px) 64rem, 95vw" className="object-cover" />
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-sm">
                <span className="bg-card text-primary mb-[0.8rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-[1.4rem]">
                  <LuImage className="h-[2rem] w-[2rem] stroke-[1.8]" />
                </span>
                등록된 사진이 없어요.
              </div>
            )}

            {!isEditingImage && (
              <button
                type="button"
                onClick={() => setIsEditingImage(true)}
                className="bg-card/92 text-muted-foreground hover:text-foreground absolute top-[1.2rem] right-[1.2rem] inline-flex h-[3.8rem] items-center gap-[0.45rem] rounded-full px-[1.1rem] text-xs font-bold shadow-sm backdrop-blur transition-colors"
              >
                <LuCamera className="h-[1.5rem] w-[1.5rem]" />
                사진 수정
              </button>
            )}
          </div>

          {isEditingImage && (
            <div className="grid grid-cols-2 gap-[0.8rem] p-[1.2rem] sm:grid-cols-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-border text-foreground hover:bg-muted inline-flex h-[4rem] items-center justify-center gap-[0.5rem] rounded-[1.2rem] border px-[1rem] text-sm font-bold transition-colors sm:col-span-2"
              >
                <LuImageUp className="h-[1.6rem] w-[1.6rem]" />
                사진 선택
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="border-border text-destructive hover:bg-destructive/5 inline-flex h-[4rem] items-center justify-center gap-[0.45rem] rounded-[1.2rem] border text-sm font-bold transition-colors"
                >
                  <LuTrash2 className="h-[1.5rem] w-[1.5rem]" />
                  삭제
                </button>
              )}
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`border-border text-muted-foreground hover:bg-muted inline-flex h-[4rem] items-center justify-center rounded-[1.2rem] border text-sm font-bold transition-colors ${imagePreview ? "" : "sm:col-span-2"}`}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveImages}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground inline-flex h-[4rem] items-center justify-center gap-[0.45rem] rounded-[1.2rem] text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55 sm:col-span-4"
              >
                {isSubmitting ? <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" /> : <LuSave className="h-[1.6rem] w-[1.6rem]" />}
                사진 저장
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

          <div className="border-border border-t px-[1.8rem] py-[1.8rem] md:px-[2.2rem] md:py-[2rem]">
            <div className="flex items-start justify-between gap-[1.2rem]">
              <div className="min-w-0">
                <div className="mb-[0.7rem] flex flex-wrap items-center gap-[0.6rem]">
                  <span className="bg-primary text-primary-foreground rounded-full px-[0.8rem] py-[0.25rem] text-xs font-black">일정 {scheduleNumber}</span>
                  <span className="text-primary inline-flex items-center gap-[0.4rem] text-sm font-bold">
                    <LuCalendarClock className="h-[1.5rem] w-[1.5rem]" />
                    {formatDate(schedule.scheduledAt)} · {formatTime(schedule.scheduledAt)}
                  </span>
                </div>
                <h1 className="text-foreground text-[2.4rem] leading-tight font-black tracking-[-0.035em] break-keep md:text-[2.8rem]">{schedule.place}</h1>
                <button
                  type="button"
                  onClick={() => setIsMapExpanded(true)}
                  className="text-muted-foreground hover:text-primary mt-[0.45rem] flex max-w-full items-start gap-[0.45rem] text-left text-sm leading-relaxed break-keep transition-colors"
                >
                  <LuMapPin className="mt-[0.15rem] h-[1.5rem] w-[1.5rem] shrink-0" />
                  <span>{schedule.address}</span>
                  <span className="text-primary shrink-0 text-xs font-bold">지도 보기</span>
                </button>

                <div className="mt-[1rem] flex items-center gap-[0.7rem]">
                  <div className="flex -space-x-[0.7rem]">
                    {visibleParticipants.map(participant => (
                      <div key={participant.id} className="border-card bg-muted relative h-[3.2rem] w-[3.2rem] overflow-hidden rounded-full border-[0.2rem]">
                        {participant.image ? (
                          <Image unoptimized src={getS3ImageURL(participant.image)} alt={participant.nickname} fill sizes="3.2rem" className="object-cover" />
                        ) : (
                          <span className="bg-primary-soft text-primary grid h-full w-full place-items-center text-xs font-black">{participant.nickname.slice(0, 1)}</span>
                        )}
                      </div>
                    ))}
                    {extraParticipantCount > 0 && (
                      <span className="border-card bg-muted text-muted-foreground grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full border-[0.2rem] text-xs font-bold">
                        +{extraParticipantCount}
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground inline-flex items-center gap-[0.35rem] text-xs font-semibold">
                    <LuUsersRound className="h-[1.4rem] w-[1.4rem]" />
                    {schedule.participant.length > 0 ? `${schedule.participant.length}명 참석` : "참석자 없음"}
                  </span>
                </div>
              </div>
              <Link
                href={`/meetup/${meetupId}/schedule/${scheduleId}/edit`}
                className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex h-[3.8rem] shrink-0 items-center gap-[0.45rem] rounded-full border px-[1rem] text-xs font-bold transition-colors"
              >
                <LuPencil className="h-[1.4rem] w-[1.4rem]" />
                일정 수정
              </Link>
            </div>

            <p className={`mt-[1.6rem] text-[1.6rem] leading-[1.8] font-medium break-keep whitespace-pre-line md:text-[1.7rem] ${schedule.memo ? "text-foreground" : "text-muted-foreground"}`}>
              {schedule.memo || "아직 남겨진 이야기가 없어요."}
            </p>
          </div>
        </article>

        <section className="border-border bg-card mt-[2rem] overflow-hidden rounded-[2.2rem] border">
          <ReplyArea variant="card" />
        </section>
      </div>

      {isMapExpanded && (
        <div className="bg-background/80 fixed inset-0 z-[60] flex items-center justify-center p-[1.2rem] backdrop-blur-md" onClick={() => setIsMapExpanded(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="일정 위치 지도"
            className="border-border bg-card flex h-[72vh] w-full max-w-[86rem] flex-col overflow-hidden rounded-[2.4rem] border shadow-[0_2rem_5rem_rgba(22,21,15,0.16)]"
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
              <ScheduleLocationMap schedule={schedule} />
            </div>
            <div className="border-border bg-card/95 flex items-center gap-[0.9rem] border-t p-[1rem]">
              <span className="bg-primary text-primary-foreground grid h-[3.4rem] w-[3.4rem] shrink-0 place-items-center rounded-full">
                <LuMapPin className="h-[1.7rem] w-[1.7rem] stroke-[2]" />
              </span>
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-bold">{schedule.place}</p>
                <p className="text-muted-foreground truncate text-xs">{schedule.address}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ScheduleDetail;
