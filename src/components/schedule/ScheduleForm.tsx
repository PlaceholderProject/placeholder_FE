"use client";

import SubmitLoader from "@/components/common/SubmitLoader";
import MemberSelector from "@/components/schedule/MemberSelector";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useModal } from "@/hooks/useModal";
import { useCreateSchedule, useScheduleDetail, useUpdateSchedule } from "@/hooks/useSchedule";
import { useScheduleForm } from "@/hooks/useScheduleForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import type { Address } from "react-daum-postcode";
import { IconType } from "react-icons";
import { LuArrowLeft, LuCalendarDays, LuClock3, LuImagePlus, LuMapPin, LuSearch, LuStickyNote, LuUsersRound, LuX } from "react-icons/lu";
import { toast } from "sonner";

interface ScheduleFormProps {
  meetupId: number;
  mode?: "create" | "edit";
  scheduleId?: number;
}

const inputClassName =
  "border-border bg-card text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-primary/15 h-[4.4rem] w-full rounded-[1.3rem] border px-[1.2rem] text-sm outline-none transition focus:ring-[0.3rem] disabled:bg-muted disabled:text-muted-foreground";

const useKakaoMapSDK = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadKakaoSDK = () => {
      if (window.kakao?.maps?.services) {
        setIsLoaded(true);
      } else if (!document.querySelector("script[src*='dapi.kakao.com']")) {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => window.kakao.maps.load(() => setIsLoaded(true));
        document.head.appendChild(script);
      }
    };

    if (typeof window !== "undefined") {
      loadKakaoSDK();
    }
  }, []);

  return isLoaded;
};

const ScheduleForm = ({ meetupId, mode = "create", scheduleId }: ScheduleFormProps) => {
  const router = useRouter();
  const isKakaoMapLoaded = useKakaoMapSDK();
  const { openModal } = useModal();

  const { data: scheduleData, isPending: isLoadingSchedule } = useScheduleDetail(mode === "edit" ? scheduleId : undefined, { enabled: mode === "edit" && !!scheduleId });
  const { formData, imagePreview, handleChange, handleMemberSelect, handleImageSelect, handleImageRemove, setAddress } = useScheduleForm(mode, scheduleData);

  const imageUploadMutation = useImageUpload();
  const createMutation = useCreateSchedule(meetupId);
  const updateMutation = useUpdateSchedule(scheduleId || 0);

  const handleCompletePostcode = useCallback(
    (data: Address) => {
      if (!isKakaoMapLoaded || !window.kakao?.maps?.services) {
        toast.message("지도 서비스가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(data.address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
          setAddress(data.address, result[0].y, result[0].x);
        } else {
          setAddress(data.address, "0", "0");
        }
      });
    },
    [isKakaoMapLoaded, setAddress],
  );

  const handleAddressSearch = useCallback(() => {
    openModal("POSTCODE", { onCompletePostcode: handleCompletePostcode });
  }, [handleCompletePostcode, openModal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.place.trim() || !formData.address.trim() || !formData.date || !formData.time) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    let imageKey: string | null = mode === "edit" ? (scheduleData?.image ?? null) : null;

    if (formData.image) {
      try {
        const [uploadedKey] = await imageUploadMutation.mutateAsync({
          files: [formData.image],
          target: "schedule",
        });
        imageKey = uploadedKey ?? null;
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }

    const payload = {
      ...formData,
      scheduledAt: `${formData.date}T${formData.time}:00`,
      image: imageKey || "",
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (scheduleId) {
        await updateMutation.mutateAsync({ scheduleId, payload });
      }
      router.push(`/meetup/${meetupId}`);
    } catch (error) {
      console.error(`스케줄 ${mode === "create" ? "생성" : "수정"} 실패:`, error);
      toast.error(`스케줄 처리 중 오류가 발생했습니다.`);
    }
  };

  if (mode === "edit" && isLoadingSchedule) {
    return (
      <div className="mx-auto w-[95%] max-w-[72rem] py-[4rem]">
        <div className="bg-muted h-[24rem] animate-pulse rounded-[2rem]" />
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending || imageUploadMutation.isPending;

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}
      <div className="mx-auto w-[95%] max-w-[100rem] space-y-[2rem] py-[2.4rem] pb-[8rem] md:py-[3.2rem] md:pb-[5rem]">
        <button type="button" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
          <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
          뒤로
        </button>

        <div>
          <h1 className="text-foreground text-2xl font-bold md:text-3xl">{mode === "create" ? "새 일정 만들기" : "일정 수정하기"}</h1>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">멤버들이 모일 장소와 시간을 등록해요.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-[2rem] lg:grid-cols-[minmax(0,1fr)_34rem] lg:items-start">
          <div className="space-y-[1.4rem]">
            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem] md:p-[2rem]">
              <SectionTitle icon={LuMapPin} title="장소" description="주소 검색으로 지도 좌표까지 함께 저장해요." />

              <div className="space-y-[1.4rem]">
                <FieldLabel label="장소명">
                  <input type="text" id="place" name="place" value={formData.place} onChange={handleChange} required placeholder="예) 뚝섬한강공원" className={inputClassName} />
                </FieldLabel>

                <FieldLabel label="주소">
                  <div className="flex gap-[0.8rem]">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      readOnly
                      placeholder="주소를 검색해주세요"
                      onClick={handleAddressSearch}
                      className={`${inputClassName} cursor-pointer`}
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      className="bg-foreground text-background grid h-[4.4rem] w-[4.8rem] shrink-0 place-items-center rounded-[1.3rem] transition hover:opacity-90"
                    >
                      <LuSearch className="h-[1.8rem] w-[1.8rem] stroke-[2]" />
                    </button>
                  </div>
                </FieldLabel>
              </div>
            </section>

            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem] md:p-[2rem]">
              <SectionTitle icon={LuCalendarDays} title="일시와 메모" description="언제 만나는지, 무엇을 준비하면 좋은지 알려주세요." />

              <div className="grid gap-[1.4rem] md:grid-cols-2">
                <FieldLabel label="날짜">
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className={inputClassName} />
                </FieldLabel>
                <FieldLabel label="시간">
                  <div className="relative">
                    <LuClock3 className="text-muted-foreground pointer-events-none absolute top-1/2 right-[1.2rem] h-[1.7rem] w-[1.7rem] -translate-y-1/2 stroke-[1.9]" />
                    <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className={`${inputClassName} pr-[3.8rem]`} />
                  </div>
                </FieldLabel>
              </div>

              <FieldLabel label="메모">
                <div className="relative">
                  <LuStickyNote className="text-muted-foreground pointer-events-none absolute top-[1.2rem] right-[1.2rem] h-[1.8rem] w-[1.8rem] stroke-[1.9]" />
                  <textarea
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleChange}
                    rows={6}
                    placeholder="준비물, 만나는 위치, 진행 방식 등을 적어주세요."
                    className={`${inputClassName} mt-[1.4rem] h-[15rem] resize-none py-[1rem] pr-[4rem]`}
                  />
                </div>
              </FieldLabel>
            </section>

            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem] md:p-[2rem]">
              <SectionTitle icon={LuImagePlus} title="사진" description="장소나 분위기를 보여줄 사진을 추가할 수 있어요." />

              <input type="file" id="image-upload" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <label
                htmlFor="image-upload"
                className="border-border bg-muted/60 group hover:border-primary/45 relative flex h-[21rem] cursor-pointer items-center justify-center overflow-hidden rounded-[1.6rem] border border-dashed transition-colors"
              >
                {imagePreview ? (
                  <Image
                    unoptimized
                    src={imagePreview}
                    alt="일정 이미지 미리보기"
                    fill
                    sizes="(min-width: 1024px) 66rem, 95vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-[0.7rem] text-sm font-semibold">
                    <span className="bg-card text-primary grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full shadow-sm">
                      <LuImagePlus className="h-[2.2rem] w-[2.2rem] stroke-[1.9]" />
                    </span>
                    일정 사진 추가하기
                  </div>
                )}
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="text-destructive hover:bg-destructive/5 mt-[0.9rem] inline-flex h-[3.4rem] items-center gap-[0.5rem] rounded-full px-[1rem] text-xs font-bold transition-colors"
                >
                  <LuX className="h-[1.5rem] w-[1.5rem] stroke-[2]" />
                  사진 제거
                </button>
              )}
            </section>
          </div>

          <aside className="space-y-[1.4rem] lg:sticky lg:top-[8.4rem]">
            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem]">
              <SectionTitle icon={LuUsersRound} title="참석자" description="이 일정에 함께할 멤버를 선택하세요." compact />
              <MemberSelector meetupId={meetupId} selectedMember={formData.participant} onMemberSelect={handleMemberSelect} />
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground flex h-[4.8rem] w-full items-center justify-center rounded-[1.5rem] text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting ? "처리 중..." : mode === "create" ? "일정 만들기" : "일정 수정하기"}
            </button>
          </aside>
        </form>
      </div>
    </>
  );
};

const SectionTitle = ({ icon: Icon, title, description, compact = false }: { icon: IconType; title: string; description: string; compact?: boolean }) => (
  <div className={`${compact ? "mb-[1rem]" : "mb-[1.4rem]"} flex items-center gap-[0.8rem]`}>
    <span className="bg-primary-soft text-primary grid h-[3.8rem] w-[3.8rem] place-items-center rounded-[1.2rem]">
      <Icon className="h-[1.9rem] w-[1.9rem] stroke-[1.9]" />
    </span>
    <div>
      <h2 className="text-foreground text-lg font-bold">{title}</h2>
      <p className="text-muted-foreground mt-[0.2rem] text-xs">{description}</p>
    </div>
  </div>
);

const FieldLabel = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-foreground mb-[0.7rem] block text-sm font-bold">{label}</label>
    {children}
  </div>
);

export default ScheduleForm;
