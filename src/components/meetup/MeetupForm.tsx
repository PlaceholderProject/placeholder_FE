"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { FileType, LabeledInputProps, LabeledSelectProps, Meetup, NewMeetup } from "@/types/meetupType";
import { MAX_AD_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_PLACE_LENGTH } from "@/constants/meetup";
import SubmitLoader from "../common/SubmitLoader";
import { useMeetupForm } from "@/hooks/useMeetupForm";
import { useCreateMeetup, useEditMeetup, useMeetupDetail, useGetPresignedUrl, useS3Upload } from "@/hooks/useMeetupApi";
import { toast } from "sonner";
import { useRenderCount } from "@/hooks/useRenderCount";

// 성능 측정을 위한 커스텀 훅
const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const totalRenderTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  // 렌더링 시작 시점 기록
  renderStartTime.current = performance.now();
  renderCount.current += 1;

  useEffect(() => {
    // 렌더링 완료 시점 기록
    const renderEndTime = performance.now();
    const currentRenderTime = renderEndTime - renderStartTime.current;
    totalRenderTime.current += currentRenderTime;

    console.log(`🔥 ${componentName} 렌더링 #${renderCount.current}: ${currentRenderTime.toFixed(2)}ms`);
    console.log(`📊 ${componentName} 누적 렌더링 시간: ${totalRenderTime.current.toFixed(2)}ms`);
  });

  return {
    renderCount: renderCount.current,
    totalRenderTime: totalRenderTime.current,
  };
};

// Form 데이터 타입
interface FormData {
  name: string;
  placeDescription: string;
  adTitle: string;
  description: string;
  category: string;
  place: string;
  startedAt: string;
  endedAt: string;
  adEndedAt: string;
  isPublic: boolean;
  organizerNickname: string;
  organizerProfileImage: string;
}

// displayName 추가
const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ defaultChecked, id, name, label, type, placeholder, value, defaultValue, disabled, required, checked, onChange, maxLength, className, labelClassName, containerClassName }, ref) => {
    return (
      <>
        <div className={containerClassName}>
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            required={required}
            checked={checked}
            onChange={onChange}
            ref={ref}
            maxLength={maxLength}
            className={className}
            defaultChecked={defaultChecked}
          />
        </div>
      </>
    );
  },
);
LabeledInput.displayName = "LabeledInput";

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, required = true, className, labelClassName, containerClassName, defaultValue }, ref) => {
  return (
    <>
      <div className={containerClassName}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        <select id={id} name={name} required={required} ref={ref} defaultValue={defaultValue} className={className}>
          {options.map(option => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
});
LabeledSelect.displayName = "LabeledSelect";

interface MeetupFormProps {
  mode: "create" | "edit";
  meetupId?: number;
  useRHF?: boolean; // RHF 사용 여부를 결정하는 prop
}

const MeetupForm = ({ mode, meetupId, useRHF = true }: MeetupFormProps) => {
  // 성능 측정
  const performanceData = usePerformanceMonitor(`MeetupForm-${useRHF ? "RHF" : "Original"}`);
  useRenderCount(`MeetupForm-${useRHF ? "RHF" : "Original"}`);

  const router = useRouter();

  // api 훅
  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useMeetupDetail(meetupId, {
    enabled: mode == "edit" && !!meetupId,
  });

  const createMutation = useCreateMeetup();
  const editMutation = useEditMeetup();
  const getPresignedUrl = useGetPresignedUrl();
  const s3Upload = useS3Upload();

  // ===========================================
  // RHF 방식 (조건부 사용)
  // ===========================================
  const rhfMethods = useForm<FormData>({
    defaultValues: {
      name: mode === "edit" ? previousMeetupData.name || "" : "",
      placeDescription: "",
      adTitle: "",
      description: "",
      category: "운동",
      place: "서울",
      startedAt: "",
      endedAt: "",
      adEndedAt: "",
      isPublic: true,
      organizerNickname: "",
      organizerProfileImage: "",
    },
  });

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { isSubmitting: rhfIsSubmitting },
    control,
  } = rhfMethods;

  // watch로 글자수 계산(선택적 리렌더링)
  // 무조건 Hook 호출
  const watchedName = useWatch({ control, name: "name" });
  const watchedPlace = useWatch({ control, name: "placeDescription" });
  const watchedAdTitle = useWatch({ control, name: "adTitle" });
  const watchedDescription = useWatch({ control, name: "description" });

  // RHF 모드일 때만 값 사용, 아니면 빈 문자열로 무시
  const rhfNameLength = useRHF ? watchedName?.length || 0 : 0;
  const rhfPlaceLength = useRHF ? watchedPlace?.length || 0 : 0;
  const rhfAdTitleLength = useRHF ? watchedAdTitle?.length || 0 : 0;
  const rhfDescriptionLength = useRHF ? watchedDescription?.length || 0 : 0;

  // ===========================================
  // 기존 방식 (조건부 사용)
  // ===========================================
  const originalFormData = useMeetupForm(mode, previousMeetupData);
  const { formStates, handlers, validateDates } = originalFormData;
  const {
    isSubmitting: originalIsSubmitting,
    setIsSubmitting: setOriginalIsSubmitting,
    nameLength: originalNameLength,
    placeLength: originalPlaceLength,
    adTitleLength: originalAdTitleLength,
    descriptionLength: originalDescriptionLength,
    isStartedAtNull,
    setIsStartedAtNull,
    isEndedAtNull,
    setIsEndedAtNull,
    previewImage,
  } = formStates;

  const { handleNameLengthChange, handlePlaceLengthChange, handleAdTitleLengthChange, handleDescriptionLengthChange, handlePreviewImageChange } = handlers;

  // 기존 방식의 refs
  const organizerNicknameRef = useRef<HTMLInputElement>(null);
  const organizerProfileImageRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLSelectElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // 공통 상태
  const [previewImageUrl, setPreviewImageUrl] = React.useState("/meetup_default_image.png");

  // 셀렉트 옵션 배열
  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // 이미지 미리보기 처리
  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImageUrl(previewFileUrl);
    }

    // 기존 방식도 함께 호출
    if (!useRHF) {
      handlePreviewImageChange(event);
    }
  };

  useEffect(() => {
    if (mode === "edit" && previousMeetupData && !useRHF) {
      setIsStartedAtNull(previousMeetupData.startedAt === null);
      setIsEndedAtNull(previousMeetupData.endedAt === null);
    }
  }, [mode, previousMeetupData, setIsStartedAtNull, setIsEndedAtNull, useRHF]);

  // RHF 제출 함수
  const onRHFSubmit = async (data: FormData) => {
    console.log("🚀 RHF 제출:", data);
    // 실제 제출 로직은 기존과 동일하게 구현
    toast.success("RHF 모임 제출 완료!");
  };

  // 기존 제출 함수
  const handleOriginalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (originalIsSubmitting) {
      return;
    }
    setOriginalIsSubmitting(true);

    try {
      // 인풋 필드에서 날짜값 가져옴
      const startDate = isStartedAtNull ? null : startedAtRef.current?.value || null;
      const endDate = isEndedAtNull ? null : endedAtRef.current?.value || null;
      const adEndDate = adEndedAtRef.current?.value || "";

      //날짜 유효성 검사
      if (!validateDates(startDate, endDate, adEndDate)) {
        return;
      }

      // 이미지 업로드 처리
      let imageUrl = mode === "edit" ? previousMeetupData?.image || "" : "";

      if (imageRef?.current?.files?.[0]) {
        const imageFile = imageRef.current.files[0];
        const fileType = imageFile.type as FileType;
        const presignedResponse = await getPresignedUrl.mutateAsync(fileType);
        const presignedData = presignedResponse.result[0];
        imageUrl = await s3Upload.mutateAsync({ file: imageFile, presignedData });
      }

      if (mode === "create") {
        const newMeetup: NewMeetup = {
          organizer: {
            nickname: organizerNicknameRef.current?.value || "",
            image: organizerProfileImageRef.current?.value || "",
          },
          name: nameRef.current?.value || "",
          description: descriptionRef.current?.value || "",
          place: placeRef.current?.value || "",
          placeDescription: placeDescriptionRef.current?.value || "",
          startedAt: startDate,
          endedAt: endDate,
          adTitle: adTitleRef.current?.value || "",
          adEndedAt: adEndDate,
          isPublic: !isPublicRef.current?.checked,
          category: categoryRef.current?.value || "",
          isLike: false,
          likeCount: 0,
          createdAt: "",
          commentCount: 0,
        };

        await createMutation.mutateAsync({ data: newMeetup, imageUrl });
        toast.success("기존 방식 모임 생성 성공!");
      } else {
        if (!previousMeetupData) return;
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
          isPublic: !isPublicRef.current?.checked,
          category: categoryRef.current?.value || "",
        };
        await editMutation.mutateAsync({ data: editedMeetup, imageUrl, meetupId: meetupId! });
        toast.success("기존 방식 모임 수정 성공!");
      }

      router.push("/");
    } catch (error) {
      console.error(`모임 ${mode === "create" ? "생성" : "수정"} 실패:`, error);
    } finally {
      setOriginalIsSubmitting(false);
    }
  };

  // 로딩 상태 처리
  if (mode === "edit" && isPending) return <p>로딩 중...</p>;
  if (mode === "edit" && isError) return <p>모임 데이터 로드 에러 발생</p>;

  // 현재 사용 중인 방식에 따른 값들
  const currentNameLength = useRHF ? rhfNameLength : originalNameLength;
  const currentPlaceLength = useRHF ? rhfPlaceLength : originalPlaceLength;
  const currentAdTitleLength = useRHF ? rhfAdTitleLength : originalAdTitleLength;
  const currentDescriptionLength = useRHF ? rhfDescriptionLength : originalDescriptionLength;
  const currentIsSubmitting = useRHF ? rhfIsSubmitting : originalIsSubmitting;

  return (
    <>
      {currentIsSubmitting && <SubmitLoader isLoading={currentIsSubmitting} />}

      {/* 성능 모니터링 정보 표시 */}
      <div className="fixed right-4 top-4 z-50 rounded bg-black p-4 text-sm text-white">
        <div>방식: {useRHF ? "React Hook Form" : "기존 방식"}</div>
        <div>렌더링 횟수: {performanceData.renderCount}</div>
        <div>누적 시간: {performanceData.totalRenderTime.toFixed(2)}ms</div>
      </div>

      <div className="mx-auto my-[5rem] w-[32rem] rounded-[1rem] border-[0.1rem] border-gray-medium p-[3rem] md:w-full md:max-w-[100rem]">
        <div className="place-items-center">
          <h1 className="text-center text-3xl font-semibold">
            {mode === "create" ? "모임 생성하기" : "모임 수정하기"}
            <span className="ml-2 text-sm text-blue-500">({useRHF ? "RHF 방식" : "기존 방식"})</span>
          </h1>
          <p className="font-sm mb-[4rem] text-warning">모든 폼은 필수 입력 사항입니다.</p>

          <form onSubmit={useRHF ? rhfHandleSubmit(onRHFSubmit) : handleOriginalSubmit}>
            <div className="grid md:grid-cols-2 md:gap-x-[7rem]">
              <div className="좌측영역">
                <h2 className="text-2xl font-semibold text-primary">모임에 대해 알려주세요.</h2>

                {/* 카테고리 선택 */}
                <div className="my-[0.5rem] flex items-center justify-between">
                  <label className="text-lg font-semibold">모임 성격</label>
                  <select
                    {...(useRHF ? register("category") : {})}
                    ref={!useRHF ? categoryRef : undefined}
                    defaultValue={mode === "edit" ? previousMeetupData?.category : undefined}
                    className="h-[4rem] w-[21.3rem] rounded-[1rem] border-[0.1rem] border-gray-light text-center text-base"
                  >
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 모임 이름 */}
                {/* <div>
                  <div className="my-[0.5rem] flex flex-col gap-2">
                    <label className="text-lg font-semibold">모임 이름</label>
                    <input
                      {...(useRHF ? register("name") : {})}
                      ref={!useRHF ? nameRef : undefined}
                      defaultValue={mode === "edit" ? previousMeetupData?.name : undefined}
                      onChange={!useRHF ? handleNameLengthChange : undefined}
                      maxLength={MAX_NAME_LENGTH}
                      className="h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"
                    />
                  </div>
                  <span className="text-sm text-gray-dark">
                    {currentNameLength <= MAX_NAME_LENGTH ? currentNameLength : MAX_NAME_LENGTH} / {MAX_NAME_LENGTH} 자
                  </span>
                  {currentNameLength >= MAX_NAME_LENGTH && <p className="text-sm text-warning">모임 이름은 최대 {MAX_NAME_LENGTH}자까지 입력할 수 있습니다.</p>}
                </div> */}

                {/* 모임 이름 */}
                <div>
                  <div className="my-[0.5rem] flex flex-col gap-2">
                    <label className="text-lg font-semibold">모임 이름</label>
                    <input
                      {...(useRHF ? register("name") : {})}
                      ref={!useRHF ? nameRef : undefined}
                      defaultValue={mode === "edit" ? previousMeetupData?.name : undefined}
                      onChange={!useRHF ? handleNameLengthChange : undefined}
                      maxLength={MAX_NAME_LENGTH}
                      className="h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"
                    />
                  </div>

                  {/* 글자 수 표시 */}
                  <span className="text-sm text-gray-dark">
                    {currentNameLength <= MAX_NAME_LENGTH ? currentNameLength : MAX_NAME_LENGTH} / {MAX_NAME_LENGTH} 자
                  </span>

                  {currentNameLength >= MAX_NAME_LENGTH && <p className="text-sm text-warning">모임 이름은 최대 {MAX_NAME_LENGTH}자까지 입력할 수 있습니다.</p>}
                </div>

                {/* 모임 날짜 */}
                <h3 className="mt-4 text-lg font-semibold">모임 날짜</h3>
                <div className="flex justify-between">
                  <div className="mt-[1rem] flex justify-between">
                    <label className="pr-[1rem] pt-[1rem] text-base">시작일</label>
                    <input
                      {...(useRHF ? register("startedAt") : {})}
                      ref={!useRHF ? startedAtRef : undefined}
                      type="date"
                      defaultValue={mode === "edit" && previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
                      disabled={!useRHF ? isStartedAtNull : false}
                      className="h-[4rem] w-[18rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem]"
                    />
                  </div>
                  {!useRHF && (
                    <div className="flex items-center">
                      <label className="ml-[0.5rem] mr-[0.5rem] mt-[1rem] text-base">미정</label>
                      <input
                        type="checkbox"
                        checked={isStartedAtNull}
                        onChange={event => setIsStartedAtNull(event.target.checked)}
                        className="mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                      />
                    </div>
                  )}
                </div>

                {/* 종료일도 비슷하게 구현 */}
                <div className="flex justify-between">
                  <div className="mt-[1rem] flex justify-between">
                    <label className="pr-[1rem] pt-[1rem] text-base">종료일</label>
                    <input
                      {...(useRHF ? register("endedAt") : {})}
                      ref={!useRHF ? endedAtRef : undefined}
                      type="date"
                      defaultValue={mode === "edit" && previousMeetupData?.endedAt ? previousMeetupData.endedAt.substring(0, 10) : undefined}
                      disabled={!useRHF ? isEndedAtNull : false}
                      className="h-[4rem] w-[18rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem]"
                    />
                  </div>
                  {!useRHF && (
                    <div className="flex items-center">
                      <label className="ml-[0.5rem] mr-[0.5rem] mt-[1rem] text-base">미정</label>
                      <input
                        type="checkbox"
                        checked={isEndedAtNull}
                        onChange={event => setIsEndedAtNull(event.target.checked)}
                        className="mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                      />
                    </div>
                  )}
                </div>

                {/* 광고글 제목 */}
                <h2 className="my-[1rem] items-baseline justify-start pt-[0.5rem] text-2xl font-semibold text-primary md:pt-[1rem]">
                  멤버 모집 광고글의 내용을
                  <br /> 작성해주세요.
                </h2>
                <div>
                  <div className="my-[0.5rem] flex flex-col items-start">
                    <label className="my-[0.5rem] text-lg font-semibold">광고글 제목</label>
                    <input
                      {...(useRHF ? register("adTitle") : {})}
                      ref={!useRHF ? adTitleRef : undefined}
                      defaultValue={mode === "edit" ? previousMeetupData?.adTitle : undefined}
                      onChange={!useRHF ? handleAdTitleLengthChange : undefined}
                      maxLength={MAX_AD_TITLE_LENGTH}
                      className="h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"
                    />
                  </div>
                  <span className="text-sm text-gray-dark">
                    {currentAdTitleLength <= MAX_AD_TITLE_LENGTH ? currentAdTitleLength : MAX_AD_TITLE_LENGTH} / {MAX_AD_TITLE_LENGTH} 자
                  </span>
                  {currentAdTitleLength >= MAX_AD_TITLE_LENGTH && <p className="text-sm text-warning">광고글 제목은 최대 {MAX_AD_TITLE_LENGTH}자 까지 입력할 수 있습니다.</p>}
                </div>

                {/* 광고 종료일 */}
                <div>
                  <h2 className="mt-4 text-lg font-semibold">멤버 모집 기간</h2>
                  <div className="flex justify-between">
                    <label className="w-[8rem] pt-[1rem] text-base">광고 종료일</label>
                    <input
                      {...(useRHF ? register("adEndedAt") : {})}
                      ref={!useRHF ? adEndedAtRef : undefined}
                      type="date"
                      defaultValue={mode === "edit" && previousMeetupData?.adEndedAt ? previousMeetupData.adEndedAt.substring(0, 10) : undefined}
                      className="h-[4rem] w-[21rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem]"
                    />
                  </div>
                </div>

                {/* 모임 장소 */}
                <div>
                  <h2 className="mt-4 text-lg font-semibold">모임 장소</h2>
                  <div className="my-[1rem] flex items-center justify-between">
                    <label className="text-base">모임 지역</label>
                    <select
                      {...(useRHF ? register("place") : {})}
                      ref={!useRHF ? placeRef : undefined}
                      defaultValue={mode === "edit" ? previousMeetupData?.place : undefined}
                      className="h-[4rem] w-[80%] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem] text-center"
                    >
                      {placeOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    {...(useRHF ? register("placeDescription") : {})}
                    ref={!useRHF ? placeDescriptionRef : undefined}
                    placeholder="만날 곳의 대략적 위치를 작성해주세요. 예) 강남역"
                    defaultValue={mode === "edit" ? previousMeetupData?.placeDescription : undefined}
                    onChange={!useRHF ? handlePlaceLengthChange : undefined}
                    maxLength={MAX_PLACE_LENGTH}
                    className="h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-[1.36rem]"
                  />
                  <span className="text-sm text-gray-dark md:pb-[2rem]">
                    {currentPlaceLength <= MAX_PLACE_LENGTH ? currentPlaceLength : MAX_PLACE_LENGTH} / {MAX_PLACE_LENGTH} 자
                  </span>
                  {currentPlaceLength >= MAX_PLACE_LENGTH && <p className="text-sm text-warning">모임 장소 설명은 최대 {MAX_PLACE_LENGTH}자까지 입력할 수 있습니다.</p>}
                </div>
              </div>

              <div className="우측이동">
                {/* 광고글 설명 */}
                <div className="my-[0.5rem] flex flex-col py-[0.5rem]">
                  <label className="my-[0.5rem] text-lg font-semibold">광고글 설명</label>
                  <textarea
                    {...(useRHF ? register("description") : {})}
                    ref={!useRHF ? descriptionRef : undefined}
                    defaultValue={mode === "edit" ? previousMeetupData?.description : ""}
                    placeholder="멤버 모집 광고글에 보일 설명을 작성해주세요."
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={!useRHF ? handleDescriptionLengthChange : undefined}
                    className="h-[17rem] w-full rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"
                  />
                  <span className="pt-[1rem] text-sm text-gray-dark">
                    {currentDescriptionLength <= MAX_DESCRIPTION_LENGTH ? currentDescriptionLength : MAX_DESCRIPTION_LENGTH} / {MAX_DESCRIPTION_LENGTH} 자
                  </span>
                  {currentDescriptionLength >= MAX_DESCRIPTION_LENGTH && <p className="text-sm text-warning">광고글 설명은 최대 {MAX_DESCRIPTION_LENGTH}자 까지 입력할 수 있습니다.</p>}
                </div>

                {/* 대표 이미지 */}
                <div className="my-[0.5rem]">
                  <input
                    id="image"
                    type="file"
                    accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
                    ref={imageRef}
                    onChange={handleImagePreview}
                    required={mode === "create"}
                    className="sr-only"
                  />
                  <div className="flex-cols-2 flex items-center justify-between text-center">
                    <label className="my-[0.5rem] text-lg font-semibold">대표 이미지</label>
                    <label htmlFor="image" className="h-[2.2rem] w-[8rem] cursor-pointer items-center rounded-[1rem] bg-gray-medium py-[0.2rem] text-sm">
                      파일 선택
                    </label>
                  </div>

                  <div className="relative flex h-[14.5rem] w-full items-center justify-center overflow-hidden rounded-[1rem] border-[0.1rem] border-gray-light">
                    <Image
                      src={useRHF ? previewImageUrl : previewImage || "/meetup_default_image.png"}
                      alt="preview image"
                      fill={previewImageUrl !== "/meetup_default_image.png"}
                      width={previewImageUrl === "/meetup_default_image.png" ? 50 : undefined}
                      height={previewImageUrl === "/meetup_default_image.png" ? 50 : undefined}
                      style={{
                        objectFit: previewImageUrl === "/meetup_default_image.png" ? "contain" : "cover",
                      }}
                      className="rounded-[1rem]"
                    />
                  </div>
                </div>

                {/* 모집글 비공개 */}
                <div className="my-[3rem] flex items-center md:justify-center">
                  <input
                    {...(useRHF ? register("isPublic") : {})}
                    ref={!useRHF ? isPublicRef : undefined}
                    type="checkbox"
                    defaultChecked={mode === "edit" ? previousMeetupData?.isPublic === false : false}
                    className="h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                  />
                  <label className="ml-[0.5rem] mr-[0.5rem] items-baseline text-2xl font-semibold text-primary">모집글 비공개</label>
                </div>

                {/* 제출 버튼 */}
                <div className="mt-[3rem] flex justify-center">
                  <button
                    type="submit"
                    className="text-bold h-[4rem] w-[14rem] items-center rounded-[1rem] bg-primary text-center text-lg text-white disabled:bg-gray-medium md:w-full"
                    disabled={currentIsSubmitting}
                  >
                    {currentIsSubmitting ? "처리 중..." : mode === "create" ? "모임 등록" : "모임 수정"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MeetupForm;
