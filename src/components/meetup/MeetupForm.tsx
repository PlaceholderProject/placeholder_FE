"use client";

import CategoryBadge from "@/components/common/CategoryBadge";
import SubmitLoader from "@/components/common/SubmitLoader";
import { MAX_AD_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_PLACE_LENGTH } from "@/constants/meetup";
import { useMeetupForm } from "@/hooks/useMeetupForm";
import { useCreateMeetup, useEditMeetup, useGetPresignedUrl, useMeetupDetail, useS3Upload } from "@/hooks/useMeetupApi";
import { FileType, Meetup, NewMeetup } from "@/types/meetupType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { LuArrowLeft, LuCalendarDays, LuGlobe, LuImagePlus, LuLockKeyhole, LuMegaphone, LuUsersRound } from "react-icons/lu";
import { toast } from "sonner";

interface MeetupFormProps {
  mode: "create" | "edit";
  meetupId?: number;
}

const CATEGORY_OPTIONS = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
const PLACE_OPTIONS = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];
const inputClassName =
  "border-border bg-card text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-primary/15 h-[4.4rem] w-full rounded-[1.3rem] border px-[1.2rem] text-sm outline-none transition focus:ring-[0.3rem] disabled:bg-muted disabled:text-muted-foreground";

const MeetupForm = ({ mode, meetupId }: MeetupFormProps) => {
  const router = useRouter();

  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useMeetupDetail(meetupId, {
    enabled: mode === "edit" && !!meetupId,
  });
  const createMutation = useCreateMeetup();
  const editMutation = useEditMeetup();
  const getPresignedUrl = useGetPresignedUrl();
  const s3Upload = useS3Upload();

  const { formStates, handlers, validateDates } = useMeetupForm(mode, previousMeetupData);
  const { isSubmitting, setIsSubmitting, nameLength, placeLength, adTitleLength, descriptionLength, isStartedAtNull, setIsStartedAtNull, isEndedAtNull, setIsEndedAtNull, previewImage } = formStates;
  const { handleNameLengthChange, handlePlaceLengthChange, handleAdTitleLengthChange, handleDescriptionLengthChange, handlePreviewImageChange } = handlers;

  const nameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLSelectElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (mode === "edit" && previousMeetupData) {
      setIsStartedAtNull(previousMeetupData.startedAt === null);
      setIsEndedAtNull(previousMeetupData.endedAt === null);
      setSelectedCategory(previousMeetupData.category || CATEGORY_OPTIONS[0]);
      setIsPrivate(previousMeetupData.isPublic === false);
    }
  }, [mode, previousMeetupData, setIsEndedAtNull, setIsStartedAtNull]);

  const handleMeetupFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const startDate = isStartedAtNull ? null : startedAtRef.current?.value || null;
      const endDate = isEndedAtNull ? null : endedAtRef.current?.value || null;
      const adEndDate = adEndedAtRef.current?.value || "";

      if (!validateDates(startDate, endDate, adEndDate)) {
        return;
      }

      let imageUrl = mode === "edit" ? previousMeetupData?.image || "" : "";

      if (imageRef.current?.files?.[0]) {
        const imageFile = imageRef.current.files[0];
        const fileType = imageFile.type as FileType;
        const presignedResponse = await getPresignedUrl.mutateAsync(fileType);
        const presignedData = presignedResponse.result[0];
        imageUrl = await s3Upload.mutateAsync({ file: imageFile, presignedData });
      }

      if (mode === "create") {
        const newMeetup: NewMeetup = {
          organizer: {
            nickname: "",
            image: "",
          },
          name: nameRef.current?.value || "",
          description: descriptionRef.current?.value || "",
          place: placeRef.current?.value || "",
          placeDescription: placeDescriptionRef.current?.value || "",
          startedAt: startDate,
          endedAt: endDate,
          adTitle: adTitleRef.current?.value || "",
          adEndedAt: adEndDate,
          isPublic: !isPrivate,
          category: selectedCategory,
          isLike: false,
          likeCount: 0,
          createdAt: "",
          commentCount: 0,
        };

        await createMutation.mutateAsync({ data: newMeetup, imageUrl });
        toast.success("모임 생성에 성공했습니다!");
      } else {
        if (!previousMeetupData || !meetupId) return;

        const editedMeetup: Meetup = {
          ...previousMeetupData,
          name: nameRef.current?.value || "",
          description: descriptionRef.current?.value || "",
          place: placeRef.current?.value || "",
          placeDescription: placeDescriptionRef.current?.value || "",
          startedAt: startDate,
          endedAt: endDate,
          adTitle: adTitleRef.current?.value || "",
          adEndedAt: adEndDate,
          isPublic: !isPrivate,
          category: selectedCategory,
        };

        await editMutation.mutateAsync({ data: editedMeetup, imageUrl, meetupId });
        toast.success("모임 수정에 성공했습니다!");
      }

      router.push("/");
    } catch (error) {
      console.error(`모임 ${mode === "create" ? "생성" : "수정"} 실패:`, error);
      toast.error(`모임 ${mode === "create" ? "생성" : "수정"}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "edit" && isPending) {
    return (
      <div className="mx-auto w-[95%] max-w-[72rem] py-[4rem]">
        <div className="bg-muted h-[28rem] animate-pulse rounded-[2rem]" />
      </div>
    );
  }

  if (mode === "edit" && isError) {
    return <div className="text-error p-[3rem] text-center text-sm font-semibold">모임 데이터를 불러오지 못했어요.</div>;
  }

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}
      <div className="mx-auto w-[95%] max-w-[100rem] space-y-[2rem] py-[2.4rem] pb-[8rem] md:py-[3.2rem] md:pb-[5rem]">
        <button type="button" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
          <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
          뒤로
        </button>

        <div>
          <h1 className="text-foreground text-2xl font-bold md:text-3xl">{mode === "create" ? "새로운 모임 만들기" : "모임 수정하기"}</h1>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">관심사로 사람들을 모으고 함께할 일정을 준비해요.</p>
        </div>

        <form onSubmit={handleMeetupFormSubmit} className="grid gap-[2rem] lg:grid-cols-[minmax(0,1fr)_34rem] lg:items-start">
          <div className="space-y-[1.4rem]">
            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem] md:p-[2rem]">
              <SectionTitle icon={LuUsersRound} title="모임 기본 정보" description="사람들이 가장 먼저 보는 정보예요." />

              <div className="space-y-[1.4rem]">
                <FieldLabel label="대표 이미지">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
                    ref={imageRef}
                    onChange={handlePreviewImageChange}
                    required={mode === "create"}
                    className="sr-only"
                  />
                  <label
                    htmlFor="image"
                    className="border-border bg-muted/60 group hover:border-primary/45 relative flex aspect-[5/2] cursor-pointer items-center justify-center overflow-hidden rounded-[1.6rem] border border-dashed transition-colors"
                  >
                    {previewImage !== "/meetup_default_image.png" ? (
                      <Image
                        src={previewImage}
                        alt="대표 이미지 미리보기"
                        fill
                        sizes="(min-width: 1024px) 66rem, 95vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="text-muted-foreground flex flex-col items-center gap-[0.7rem] text-sm font-semibold">
                        <span className="bg-card text-primary grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full shadow-sm">
                          <LuImagePlus className="h-[2.2rem] w-[2.2rem] stroke-[1.9]" />
                        </span>
                        대표 이미지를 추가하세요
                      </div>
                    )}
                  </label>
                </FieldLabel>

                <FieldLabel label="모임 이름" count={`${Math.min(nameLength, MAX_NAME_LENGTH)} / ${MAX_NAME_LENGTH}`}>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    ref={nameRef}
                    defaultValue={mode === "edit" ? previousMeetupData?.name : undefined}
                    required
                    onChange={handleNameLengthChange}
                    maxLength={MAX_NAME_LENGTH}
                    placeholder="예) 한강 러닝 크루"
                    className={inputClassName}
                  />
                  {nameLength >= MAX_NAME_LENGTH && <p className="text-warning mt-[0.5rem] text-xs">모임 이름은 최대 {MAX_NAME_LENGTH}자까지 입력할 수 있습니다.</p>}
                </FieldLabel>

                <FieldLabel label="카테고리">
                  <div className="flex flex-wrap gap-[0.7rem]">
                    {CATEGORY_OPTIONS.map(category => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full border px-[1.3rem] py-[0.65rem] text-sm font-semibold transition-colors ${
                          selectedCategory === category ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </FieldLabel>

                <FieldLabel label="모임 소개" count={`${Math.min(descriptionLength, MAX_DESCRIPTION_LENGTH)} / ${MAX_DESCRIPTION_LENGTH}`}>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={mode === "edit" ? previousMeetupData?.description : ""}
                    placeholder="어떤 모임인지, 어떤 사람과 함께하고 싶은지 소개해주세요."
                    ref={descriptionRef}
                    required
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={handleDescriptionLengthChange}
                    rows={6}
                    className={`${inputClassName} h-[15rem] resize-none py-[1rem]`}
                  />
                  {descriptionLength >= MAX_DESCRIPTION_LENGTH && <p className="text-warning mt-[0.5rem] text-xs">광고글 설명은 최대 {MAX_DESCRIPTION_LENGTH}자까지 입력할 수 있습니다.</p>}
                </FieldLabel>
              </div>
            </section>

            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem] md:p-[2rem]">
              <SectionTitle icon={LuCalendarDays} title="기간과 장소" description="아직 정해지지 않았다면 미정으로 둘 수 있어요." />

              <div className="grid gap-[1.4rem] md:grid-cols-2">
                <DateField
                  id="startedAt"
                  label="시작일"
                  inputRef={startedAtRef}
                  disabled={isStartedAtNull}
                  defaultValue={mode === "edit" && previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
                />
                <DateField
                  id="endedAt"
                  label="종료일"
                  inputRef={endedAtRef}
                  disabled={isEndedAtNull}
                  defaultValue={mode === "edit" && previousMeetupData?.endedAt ? previousMeetupData.endedAt.substring(0, 10) : undefined}
                />
              </div>

              <div className="mt-[0.9rem] flex flex-wrap gap-[0.8rem]">
                <ToggleChip checked={isStartedAtNull} onChange={setIsStartedAtNull} label="시작일 미정" />
                <ToggleChip checked={isEndedAtNull} onChange={setIsEndedAtNull} label="종료일 미정" />
              </div>

              {isStartedAtNull && isEndedAtNull && (
                <p className="bg-muted text-muted-foreground mt-[1rem] rounded-[1.2rem] px-[1rem] py-[0.8rem] text-xs leading-relaxed">
                  모임의 시작일과 종료일이 모두 미정이면 내 공간의 내 광고에서 광고글만 확인할 수 있어요.
                </p>
              )}

              <div className="mt-[1.4rem] grid gap-[1.4rem] md:grid-cols-[16rem_1fr]">
                <FieldLabel label="지역">
                  <select id="place" name="place" ref={placeRef} defaultValue={mode === "edit" ? previousMeetupData?.place : undefined} required className={inputClassName}>
                    {PLACE_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldLabel>
                <FieldLabel label="상세 위치" count={`${Math.min(placeLength, MAX_PLACE_LENGTH)} / ${MAX_PLACE_LENGTH}`}>
                  <input
                    id="placeDescription"
                    name="placeDescription"
                    type="text"
                    placeholder="예) 강남역 4번 출구 근처"
                    ref={placeDescriptionRef}
                    defaultValue={mode === "edit" ? previousMeetupData?.placeDescription : undefined}
                    required
                    onChange={handlePlaceLengthChange}
                    maxLength={MAX_PLACE_LENGTH}
                    className={inputClassName}
                  />
                  {placeLength >= MAX_PLACE_LENGTH && <p className="text-warning mt-[0.5rem] text-xs">모임 장소 설명은 최대 {MAX_PLACE_LENGTH}자까지 입력할 수 있습니다.</p>}
                </FieldLabel>
              </div>
            </section>
          </div>

          <aside className="space-y-[1.4rem] lg:sticky lg:top-[8.4rem]">
            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem]">
              <SectionTitle icon={LuMegaphone} title="모집 광고" description="둘러보기 카드에 노출될 내용이에요." />

              <div className="space-y-[1.4rem]">
                <FieldLabel label="광고 제목" count={`${Math.min(adTitleLength, MAX_AD_TITLE_LENGTH)} / ${MAX_AD_TITLE_LENGTH}`}>
                  <input
                    id="adTitle"
                    name="adTitle"
                    type="text"
                    ref={adTitleRef}
                    defaultValue={mode === "edit" ? previousMeetupData?.adTitle : undefined}
                    required
                    onChange={handleAdTitleLengthChange}
                    maxLength={MAX_AD_TITLE_LENGTH}
                    placeholder="예) 주말마다 한강에서 같이 뛰어요"
                    className={inputClassName}
                  />
                  {adTitleLength >= MAX_AD_TITLE_LENGTH && <p className="text-warning mt-[0.5rem] text-xs">광고글 제목은 최대 {MAX_AD_TITLE_LENGTH}자까지 입력할 수 있습니다.</p>}
                </FieldLabel>

                <FieldLabel label="모집 종료일">
                  <input
                    id="adEndedAt"
                    name="adEndedAt"
                    type="date"
                    ref={adEndedAtRef}
                    defaultValue={mode === "edit" && previousMeetupData?.adEndedAt ? previousMeetupData.adEndedAt.substring(0, 10) : undefined}
                    required
                    className={inputClassName}
                  />
                </FieldLabel>

                <FieldLabel label="공개 설정">
                  <div className="grid gap-[0.8rem]">
                    <VisibilityButton active={!isPrivate} icon={LuGlobe} title="공개" description="누구나 광고를 보고 신청할 수 있어요." onClick={() => setIsPrivate(false)} />
                    <VisibilityButton active={isPrivate} icon={LuLockKeyhole} title="비공개" description="광고를 제한적으로 운영할 때 사용해요." onClick={() => setIsPrivate(true)} />
                  </div>
                </FieldLabel>
              </div>
            </section>

            <section className="border-border bg-card rounded-[2rem] border p-[1.6rem]">
              <p className="text-muted-foreground text-xs font-semibold">미리보기 태그</p>
              <div className="mt-[0.8rem] flex flex-wrap items-center gap-[0.8rem]">
                <CategoryBadge category={selectedCategory} size="md" />
                <span className="bg-muted text-muted-foreground rounded-full px-[1rem] py-[0.4rem] text-xs font-semibold">{isPrivate ? "비공개 모집" : "공개 모집"}</span>
              </div>
            </section>

            <button
              type="submit"
              className="bg-primary text-primary-foreground flex h-[4.8rem] w-full items-center justify-center rounded-[1.5rem] text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={isSubmitting}
            >
              {isSubmitting ? "처리 중..." : mode === "create" ? "모임 만들기" : "모임 수정하기"}
            </button>
          </aside>
        </form>
      </div>
    </>
  );
};

const SectionTitle = ({ icon: Icon, title, description }: { icon: IconType; title: string; description: string }) => (
  <div className="mb-[1.4rem] flex items-center gap-[0.8rem]">
    <span className="bg-primary-soft text-primary grid h-[3.8rem] w-[3.8rem] place-items-center rounded-[1.2rem]">
      <Icon className="h-[1.9rem] w-[1.9rem] stroke-[1.9]" />
    </span>
    <div>
      <h2 className="text-foreground text-lg font-bold">{title}</h2>
      <p className="text-muted-foreground mt-[0.2rem] text-xs">{description}</p>
    </div>
  </div>
);

const FieldLabel = ({ label, count, children }: { label: string; count?: string; children: React.ReactNode }) => (
  <div>
    <div className="mb-[0.7rem] flex items-center justify-between gap-[1rem]">
      <label className="text-foreground text-sm font-bold">{label}</label>
      {count && <span className="text-muted-foreground text-xs font-semibold">{count}</span>}
    </div>
    {children}
  </div>
);

const DateField = ({ id, label, inputRef, disabled, defaultValue }: { id: string; label: string; inputRef: React.Ref<HTMLInputElement>; disabled: boolean; defaultValue?: string }) => (
  <FieldLabel label={label}>
    <input id={id} name={id} type="date" ref={inputRef} defaultValue={defaultValue} disabled={disabled} required={!disabled} className={inputClassName} />
  </FieldLabel>
);

const ToggleChip = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`rounded-full border px-[1.1rem] py-[0.55rem] text-xs font-bold transition-colors ${
      checked ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
    }`}
    aria-pressed={checked}
  >
    {label}
  </button>
);

const VisibilityButton = ({ active, icon: Icon, title, description, onClick }: { active: boolean; icon: IconType; title: string; description: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-start gap-[1rem] rounded-[1.4rem] border p-[1.2rem] text-left transition-colors ${
      active ? "border-primary bg-primary-soft/75" : "border-border bg-card hover:border-primary/30"
    }`}
  >
    <Icon className="text-primary mt-[0.1rem] h-[1.9rem] w-[1.9rem] shrink-0 stroke-[1.9]" />
    <span>
      <span className="text-foreground block text-sm font-bold">{title}</span>
      <span className="text-muted-foreground mt-[0.25rem] block text-xs leading-relaxed">{description}</span>
    </span>
  </button>
);

export default MeetupForm;
