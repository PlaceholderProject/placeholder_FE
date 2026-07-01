"use client";

import Image from "next/image";
import { useScheduleDetail, useSchedules, useUpdateSchedule } from "@/hooks/useSchedule";
import { useImageUpload } from "@/hooks/useImageUpload";
import { getS3ImageURL } from "@/utils/getImageURL";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Schedule, SchedulePayload } from "@/types/scheduleType";
import { SkeletonTheme } from "react-loading-skeleton";
import ScheduleDetailSkeleton from "@/components/schedule/ScheduleDetailSkeleton";
import { toast } from "sonner";
import { CustomOverlayMap, Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { useRouter } from "next/navigation";
import { LuArrowLeft, LuCalendarClock, LuCamera, LuImage, LuImageUp, LuLoaderCircle, LuMapPin, LuMaximize2, LuSave, LuTrash2, LuUsersRound, LuX } from "react-icons/lu";

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
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ["services"],
  });

  if (loading) return <MapStatus title="지도를 불러오는 중" />;
  if (error) return <MapStatus title="지도를 불러오지 못했어요" description="카카오 JavaScript 키와 등록 도메인을 확인해주세요." />;

  return (
    <Map center={position} style={{ width: "100%", height: "100%" }} level={3}>
      <CustomOverlayMap position={position} xAnchor={0.5} yAnchor={1}>
        <div className="flex flex-col items-center">
          <span className="bg-background/95 text-foreground mb-[0.6rem] max-w-[18rem] truncate rounded-full px-[1rem] py-[0.45rem] text-xs font-bold shadow-[0_0.8rem_2rem_rgba(22,21,15,0.14)] backdrop-blur">
            {place}
          </span>
          <span className="bg-primary text-primary-foreground relative grid h-[4.8rem] w-[4.8rem] place-items-center rounded-full shadow-[0_1rem_2.4rem_rgba(110,59,255,0.32)]">
            <LuMapPin className="fill-primary-foreground/15 h-[2.3rem] w-[2.3rem] stroke-[2]" />
            <span className="border-primary/35 absolute -inset-[0.7rem] animate-ping rounded-full border-[0.2rem]" />
          </span>
        </div>
      </CustomOverlayMap>
    </Map>
  );
};

const ScheduleLocationMap = ({ schedule }: { schedule: Schedule }) => {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY;
  const position = toLatLng(schedule);

  if (!position) return <MapStatus title="위치 좌표를 찾지 못했어요" description="일정의 위도와 경도 값을 확인해주세요." />;
  if (!appKey) return <MapStatus title="카카오 지도 키가 필요해요" description=".env.local에 NEXT_PUBLIC_KAKAO_APP_JS_KEY를 설정해주세요." />;

  return <ScheduleMapLoader appKey={appKey} position={position} place={schedule.place} />;
};

const ParticipantsOverlay = ({ schedule }: { schedule: Schedule }) => {
  const visibleParticipants = schedule.participant.slice(0, 4);
  const extraCount = Math.max(schedule.participant.length - visibleParticipants.length, 0);

  return (
    <div className="bg-background/92 text-foreground absolute bottom-[1.2rem] left-[1.2rem] flex max-w-[calc(100%-2.4rem)] items-center gap-[0.9rem] rounded-full px-[1rem] py-[0.75rem] shadow-[0_0.8rem_2rem_rgba(22,21,15,0.16)] backdrop-blur-md">
      <div className="flex -space-x-[0.7rem]">
        {visibleParticipants.map(participant => (
          <div key={participant.id} className="border-background bg-muted relative h-[3.2rem] w-[3.2rem] overflow-hidden rounded-full border-[0.2rem]">
            {participant.image ? (
              <Image unoptimized src={getS3ImageURL(participant.image)} alt={participant.nickname} fill sizes="3.2rem" className="object-cover" />
            ) : (
              <span className="bg-primary-soft text-primary grid h-full w-full place-items-center text-xs font-bold">{participant.nickname.slice(0, 1)}</span>
            )}
          </div>
        ))}
        {extraCount > 0 && (
          <span className="border-background bg-muted text-muted-foreground grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full border-[0.2rem] text-xs font-bold">+{extraCount}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs leading-none font-bold">함께한 사람들</p>
        <p className="text-muted-foreground mt-[0.3rem] flex items-center gap-[0.35rem] text-xs font-semibold">
          <LuUsersRound className="h-[1.2rem] w-[1.2rem] stroke-[1.9]" />
          {schedule.participant.length}명
        </p>
      </div>
    </div>
  );
};

const ScheduleDetail = ({ scheduleId, meetupId }: { scheduleId: number; meetupId: number }) => {
  const router = useRouter();
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);
  const { data: schedules } = useSchedules(meetupId);
  const imageUploadMutation = useImageUpload();
  const updateMutation = useUpdateSchedule(scheduleId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (schedule?.image) {
      setImagePreview(getS3ImageURL(schedule.image));
    } else {
      setImagePreview(null);
    }
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImages = async () => {
    if (!schedule) return;

    if (!newImageFile) {
      setIsEditingImage(false);
      return;
    }

    try {
      const uploadedKeys = await imageUploadMutation.mutateAsync({
        files: [newImageFile],
        target: "schedule",
      });

      const payload: SchedulePayload = {
        scheduledAt: schedule.scheduledAt,
        place: schedule.place,
        address: schedule.address,
        latitude: schedule.latitude,
        longitude: schedule.longitude,
        memo: schedule.memo,
        participant: schedule.participant.map(participant => participant.id),
        image: uploadedKeys[0] || schedule.image,
      };

      await updateMutation.mutateAsync({ scheduleId, payload });

      setIsEditingImage(false);
      setNewImageFile(null);
    } catch (err) {
      console.error("이미지 수정 실패:", err);
      toast.error("이미지 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingImage(false);
    setNewImageFile(null);
    setImagePreview(schedule?.image ? getS3ImageURL(schedule.image) : null);
  };

  const handleRemoveImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
  };

  if (isPending) {
    return (
      <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
        <ScheduleDetailSkeleton />
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[30rem] items-center justify-center py-[4rem]">
        <div className="border-border bg-card rounded-[2rem] border px-[2rem] py-[1.6rem] text-center">
          <p className="text-foreground font-semibold">일정 정보를 불러오지 못했어요.</p>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex min-h-[30rem] items-center justify-center py-[4rem]">
        <div className="border-border bg-card rounded-[2rem] border px-[2rem] py-[1.6rem] text-center text-sm">일정을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const isSubmitting = updateMutation.isPending || imageUploadMutation.isPending;

  return (
    <div className="py-[2.4rem] md:py-[3.2rem]">
      <div className="mx-auto max-w-[82rem] space-y-[1.8rem]">
        <button type="button" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
          <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
          모임으로
        </button>

        <article className="border-border bg-card overflow-hidden rounded-[2rem] border">
          <header className="p-[1.8rem] pb-[1.3rem] md:p-[2rem] md:pb-[1.5rem]">
            <div className="mb-[1rem] flex flex-wrap items-center gap-[0.8rem]">
              <span className="bg-primary text-primary-foreground grid h-[3.4rem] min-w-[3.4rem] place-items-center rounded-full px-[0.8rem] font-mono text-sm font-bold">{scheduleNumber}</span>
              <span className="bg-primary-soft text-primary inline-flex items-center gap-[0.5rem] rounded-full px-[1rem] py-[0.45rem] text-xs font-bold">
                <LuCalendarClock className="h-[1.4rem] w-[1.4rem] stroke-[1.9]" />
                {formatDate(schedule.scheduledAt)} · {formatTime(schedule.scheduledAt)}
              </span>
            </div>
            <h1 className="text-foreground text-2xl leading-tight font-bold break-keep md:text-3xl">{schedule.place}</h1>
            <p className="text-muted-foreground mt-[0.8rem] flex items-start gap-[0.5rem] text-sm leading-relaxed break-keep">
              <LuMapPin className="text-primary mt-[0.1rem] h-[1.6rem] w-[1.6rem] shrink-0 stroke-[1.9]" />
              {schedule.address}
            </p>
          </header>

          <div className="px-[1.2rem] md:px-[1.6rem]">
            <div className="bg-muted relative mx-auto aspect-[4/3] max-h-[62rem] overflow-hidden rounded-[1.8rem] md:aspect-[16/10]">
              {imagePreview ? (
                <Image unoptimized src={imagePreview} alt={`${schedule.place} 일정 사진`} fill priority sizes="(min-width: 768px) 82rem, 95vw" className="object-cover" />
              ) : (
                <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-sm">
                  <LuImage className="mb-[0.8rem] h-[2.8rem] w-[2.8rem] stroke-[1.8]" />
                  등록된 사진이 없습니다.
                </div>
              )}
              <div className="from-foreground/55 pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t to-transparent" />
              <ParticipantsOverlay schedule={schedule} />

              {!isEditingImage ? (
                <button
                  type="button"
                  onClick={() => setIsEditingImage(true)}
                  className="bg-card/92 text-muted-foreground hover:bg-card hover:text-foreground absolute top-[1.2rem] right-[1.2rem] inline-flex h-[3.8rem] items-center gap-[0.5rem] rounded-full px-[1.2rem] text-xs font-bold shadow-sm backdrop-blur transition-colors"
                >
                  <LuCamera className="h-[1.4rem] w-[1.4rem] stroke-[1.9]" />
                  사진 수정
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-card/92 text-muted-foreground hover:bg-card hover:text-foreground absolute top-[1.2rem] right-[1.2rem] grid h-[3.8rem] w-[3.8rem] place-items-center rounded-full shadow-sm backdrop-blur transition-colors"
                    aria-label="사진 수정 취소"
                  >
                    <LuX className="h-[1.8rem] w-[1.8rem]" />
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-card/92 text-destructive hover:bg-card absolute top-[1.2rem] right-[5.8rem] grid h-[3.8rem] w-[3.8rem] place-items-center rounded-full shadow-sm backdrop-blur transition-colors"
                      aria-label="사진 삭제"
                    >
                      <LuTrash2 className="h-[1.7rem] w-[1.7rem] stroke-[1.9]" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {isEditingImage && (
            <div className="mx-[1.2rem] mt-[1.2rem] flex flex-wrap gap-[0.8rem] md:mx-[1.6rem]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-border text-foreground hover:bg-muted inline-flex h-[4rem] flex-1 items-center justify-center gap-[0.5rem] rounded-[1.3rem] border px-[1.2rem] text-sm font-semibold transition-colors"
              >
                <LuImageUp className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
                사진 변경
              </button>
              <button
                type="button"
                onClick={handleSaveImages}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground inline-flex h-[4rem] flex-1 items-center justify-center gap-[0.5rem] rounded-[1.3rem] px-[1.2rem] text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-100"
              >
                {isSubmitting ? <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" /> : <LuSave className="h-[1.6rem] w-[1.6rem]" />}
                저장
              </button>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

          <div className="p-[1.8rem] md:p-[2rem]">
            <p className="text-foreground/90 text-sm leading-relaxed break-keep whitespace-pre-line md:text-base">{schedule.memo || "등록된 메모가 없습니다."}</p>
          </div>
        </article>

        <section className="border-border bg-card overflow-hidden rounded-[2rem] border">
          <div className="flex items-center justify-between gap-[1rem] p-[1.5rem] pb-[1rem]">
            <div className="min-w-0">
              <h2 className="text-foreground text-sm font-bold">일정 위치</h2>
              <p className="text-muted-foreground mt-[0.3rem] truncate text-xs">{schedule.address}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMapExpanded(true)}
              className="bg-primary-soft/95 text-primary hover:bg-primary-soft grid h-[4rem] w-[4rem] shrink-0 place-items-center rounded-[1.2rem] shadow-[0_0.8rem_2rem_rgba(110,59,255,0.18)] backdrop-blur transition-colors"
              aria-label="지도 크게 보기"
              title="지도 크게 보기"
            >
              <LuMaximize2 className="h-[1.9rem] w-[1.9rem] stroke-[2]" />
            </button>
          </div>
          <div className="bg-muted h-[22rem] overflow-hidden md:h-[26rem]">
            <ScheduleLocationMap schedule={schedule} />
          </div>
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
                className="bg-card/95 text-muted-foreground hover:bg-card hover:text-foreground absolute top-[1.2rem] right-[1.2rem] z-10 grid h-[4rem] w-[4rem] shrink-0 place-items-center rounded-full shadow-[0_0.8rem_2rem_rgba(22,21,15,0.14)] backdrop-blur transition-colors"
                aria-label="큰 지도 닫기"
                title="큰 지도 닫기"
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
