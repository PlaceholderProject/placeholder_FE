"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileType, LabeledInputProps, LabeledSelectProps, Meetup, NewMeetup } from "@/types/meetupType";
import { MAX_AD_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_PLACE_LENGTH } from "@/constants/meetup";
import SubmitLoader from "../common/SubmitLoader";
import { useMeetupForm } from "@/hooks/useMeetupForm";
import { useCreateMeetup, useEditMeetup, useMeetupDetail, useGetPresignedUrl, useS3Upload } from "@/hooks/useMeetupApi";
import { toast } from "sonner";
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
}

const MeetupForm = ({ mode, meetupId }: MeetupFormProps) => {
  const router = useRouter();
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
  const { formStates, handlers, validateDates } = useMeetupForm(mode, previousMeetupData);
  const { isSubmitting, setIsSubmitting, nameLength, placeLength, adTitleLength, descriptionLength, isStartedAtNull, setIsStartedAtNull, isEndedAtNull, setIsEndedAtNull, previewImage } = formStates;
  const { handleNameLengthChange, handlePlaceLengthChange, handleAdTitleLengthChange, handleDescriptionLengthChange, handlePreviewImageChange } = handlers;
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
  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  useEffect(() => {
    if (mode === "edit" && previousMeetupData) {

      setIsStartedAtNull(previousMeetupData.startedAt === null);
      setIsEndedAtNull(previousMeetupData.endedAt === null);
    }
  }, [mode, previousMeetupData, setIsStartedAtNull, setIsEndedAtNull]);
  const handleMeetupFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      const startDate = isStartedAtNull ? null : startedAtRef.current?.value || null;
      const endDate = isEndedAtNull ? null : endedAtRef.current?.value || null;
      const adEndDate = adEndedAtRef.current?.value || "";
      if (!validateDates(startDate, endDate, adEndDate)) {
        return;
      }
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
        toast.success("모임 생성에 성공했습니다!");
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
        toast.success("모임 수정에 성공했습니다!");
      }

      router.push("/");
    } catch (error) {
      console.error(`모임 ${mode === "create" ? "생성" : "수정"} 실패:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (mode === "edit" && isPending) return <p>로딩 중...</p>;
  if (mode === "edit" && isError) return <p>모임 데이터 로드 에러 발생</p>;

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}
      <div className="mx-auto my-[5rem] w-[32rem] rounded-[1rem] border-[0.1rem] border-gray-medium p-[3rem] md:w-full md:max-w-[100rem]">
        <div className="place-items-center">
          <h1 className="mb-[4rem] text-center text-3xl font-semibold">{mode === "create" ? "모임 생성하기" : "모임 수정하기"}</h1>
          <form onSubmit={handleMeetupFormSubmit}>
            <div className="grid md:grid-cols-2 md:gap-x-[7rem]">
              <div className="좌측영역">
                <h2 className="text-2xl font-semibold text-primary">모임에 대해 알려주세요.</h2>
                <LabeledSelect
                  id="category"
                  name="category"
                  label="모임 성격"
                  options={categoryOptions}
                  ref={categoryRef}
                  required
                  defaultValue={mode === "edit" ? previousMeetupData?.category : undefined}
                  containerClassName={"my-[0.5rem] flex justify-between items-center"}
                  labelClassName={"font-semibold text-lg "}
                  className={"h-[4rem] w-[21.3rem] rounded-[1rem] border-[0.1rem] border-gray-light text-center text-base"}
                />
                <div>
                  <LabeledInput
                    id="name"
                    name="name"
                    label="모임 이름"
                    type="text"
                    ref={nameRef}
                    defaultValue={mode === "edit" ? previousMeetupData.name : undefined}
                    required
                    onChange={handleNameLengthChange}
                    maxLength={MAX_NAME_LENGTH}
                    containerClassName={"my-[0.5rem] flex flex-col gap-2"}
                    labelClassName={"font-semibold text-lg"}
                    className={"h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
                  />
                  <span className="text-sm text-gray-dark">
                    {nameLength <= MAX_NAME_LENGTH ? nameLength : MAX_NAME_LENGTH} / {MAX_NAME_LENGTH} 자
                  </span>
                  {nameLength >= MAX_NAME_LENGTH && <p className="text-sm text-warning">모임 이름은 최대 {MAX_NAME_LENGTH}자까지 입력할 수 있습니다.</p>}
                </div>

                <h3 className={"mt-4 text-lg font-semibold"}>모임 날짜</h3>

                <div className="flex justify-between">
                  <LabeledInput
                    id="startedAt"
                    name="startedAt"
                    label="시작일"
                    type="date"
                    ref={startedAtRef}
                    defaultValue={mode === "edit" && previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
                    disabled={isStartedAtNull}
                    required
                    containerClassName={"flex justify-between mt-[1rem]"}
                    labelClassName={"text-base pt-[1rem] pr-[1rem]"}
                    className={"h-[4rem] w-[18rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem]"}
                  />
                  <LabeledInput
                    id="startedAtUndecided"
                    name="startedAtUndecided"
                    label="미정"
                    checked={isStartedAtNull}
                    type="checkbox"
                    onChange={event => {
                      setIsStartedAtNull(event.target.checked);
                    }}
                    containerClassName={"flex items-center "}
                    labelClassName={"text-base ml-[0.5rem] mr-[0.5rem] mt-[1rem] "}
                    className={
                      "mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <LabeledInput
                    id="endedAt"
                    name="endedAt"
                    label="종료일"
                    type="date"
                    ref={endedAtRef}
                    defaultValue={mode === "edit" && previousMeetupData?.endedAt ? previousMeetupData.endedAt.substring(0, 10) : undefined}
                    disabled={isEndedAtNull}
                    required
                    containerClassName={"flex justify-between mt-[1rem]"}
                    labelClassName={"text-base pt-[1rem] pr-[1rem]"}
                    className={"h-[4rem] w-[18rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem]"}
                  />
                  <LabeledInput
                    id="endedAtUndecided"
                    name="endedAtUndecided"
                    label="미정"
                    checked={isEndedAtNull}
                    type="checkbox"
                    onChange={event => {
                      setIsEndedAtNull(event.target.checked);
                    }}
                    containerClassName={"flex items-center"}
                    labelClassName={"text-base ml-[0.5rem] mr-[0.5rem] mt-[1rem]"}
                    className={
                      "mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                    }
                  />
                </div>
                <span className="text-sm text-warning">
                  {isStartedAtNull && isEndedAtNull && (
                    <p className="mt-[1rem] text-sm text-warning">
                      모임의 시작일과 종료일이 모두 미정이면, <br />
                      <span className="font-semibold">내 공간</span> - <span className="font-semibold">내 광고</span> 에서 광고글만 확인 가능합니다.
                    </p>
                  )}
                </span>
                <h2 className="my-[1rem] items-baseline justify-start pt-[0.5rem] text-2xl font-semibold text-primary md:pt-[1rem]">
                  멤버 모집 광고글의 내용을
                  <br /> 작성해주세요.
                </h2>
                <div>
                  <LabeledInput
                    id="adTitle"
                    name="adTitle"
                    label="광고글 제목"
                    type="text"
                    ref={adTitleRef}
                    defaultValue={mode === "edit" ? previousMeetupData?.adTitle : undefined}
                    required
                    onChange={handleAdTitleLengthChange}
                    maxLength={MAX_AD_TITLE_LENGTH}
                    containerClassName={"my-[0.5rem] flex flex-col items-start"}
                    labelClassName={"font-semibold text-lg my-[0.5rem]"}
                    className={"h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
                  />
                  <span className="text-sm text-gray-dark">
                    {adTitleLength <= MAX_AD_TITLE_LENGTH ? adTitleLength : MAX_AD_TITLE_LENGTH} / {MAX_AD_TITLE_LENGTH} 자
                  </span>
                  {adTitleLength >= MAX_AD_TITLE_LENGTH && <p className="text-sm text-warning">광고글 제목은 최대 {MAX_AD_TITLE_LENGTH}자 까지 입력할 수 있습니다.</p>}
                </div>
                <div>
                  <h2 className={"mt-4 text-lg font-semibold"}>멤버 모집 기간</h2>
                  <LabeledInput
                    id="adEndedAt"
                    name="adEndedAt"
                    label="광고 종료일"
                    type="date"
                    ref={adEndedAtRef}
                    defaultValue={mode === "edit" && previousMeetupData?.adEndedAt ? previousMeetupData.adEndedAt.substring(0, 10) : undefined}
                    required
                    containerClassName={"flex justify-between"}
                    labelClassName={"text-base pt-[1rem] w-[8rem]"}
                    className={"h-[4rem] w-[21rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem]"}
                  />
                </div>
                <div>
                  <h2 className={"mt-4 text-lg font-semibold"}>모임 장소</h2>
                  <div className="">
                    <LabeledSelect
                      id="category"
                      name="category"
                      label="모임 지역"
                      options={placeOptions}
                      ref={placeRef}
                      defaultValue={mode === "edit" ? previousMeetupData?.place : undefined}
                      required
                      containerClassName={"flex my-[1rem] justify-between items-center "}
                      labelClassName={"text-base "}
                      className={"h-[4rem] w-[80%] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem] text-center"}
                    />
                  </div>
                  <LabeledInput
                    id="placeDescription"
                    name="placeDescription"
                    label="모임 장소"
                    type="text"
                    placeholder="만날 곳의 대략적 위치를 작성해주세요. 예) 강남역"
                    ref={placeDescriptionRef}
                    defaultValue={mode === "edit" ? previousMeetupData.placeDescription : undefined}
                    required
                    onChange={handlePlaceLengthChange}
                    maxLength={MAX_PLACE_LENGTH}
                    containerClassName={"flex flex-col my-[0.5rem]"}
                    labelClassName={"hidden"}
                    className={"h-[4rem] w-full items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-[1.36rem]"}
                  />
                  <span className="text-sm text-gray-dark md:pb-[2rem]">
                    {placeLength <= MAX_PLACE_LENGTH ? placeLength : MAX_PLACE_LENGTH} / {MAX_PLACE_LENGTH} 자
                  </span>
                  {placeLength >= MAX_PLACE_LENGTH && <p className="text-sm text-warning">모임 장소 설명은 최대 {MAX_PLACE_LENGTH}자까지 입력할 수 있습니다.</p>}
                </div>
              </div>
              <div className="우측이동">
                <div className="my-[0.5rem] flex flex-col py-[0.5rem]">
                  <label className="my-[0.5rem] text-lg font-semibold" htmlFor="description">
                    광고글 설명
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    defaultValue={mode === "edit" ? previousMeetupData.description : ""}
                    placeholder="멤버 모집 광고글에 보일 설명을 작성해주세요."
                    ref={descriptionRef}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={handleDescriptionLengthChange}
                    className="h-[17rem] w-full rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"
                  />
                  <span className="pt-[1rem] text-sm text-gray-dark">
                    {descriptionLength <= MAX_DESCRIPTION_LENGTH ? descriptionLength : MAX_DESCRIPTION_LENGTH} / {MAX_DESCRIPTION_LENGTH} 자
                  </span>
                  {descriptionLength >= MAX_DESCRIPTION_LENGTH && <p className="text-sm text-warning">광고글 설명은 최대 {MAX_DESCRIPTION_LENGTH}자 까지 입력할 수 있습니다.</p>}
                </div>{" "}
                <div className="my-[0.5rem]">
                  <LabeledInput
                    id="image"
                    name="image"
                    label="대표 이미지"
                    type="file"
                    accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
                    ref={imageRef}
                    onChange={handlePreviewImageChange}
                    required={mode === "create"}
                    containerClassName="sr-only"
                    labelClassName="sr-only"
                    className="sr-only"
                  />

                  { }
                  <div className="flex-cols-2 flex items-center justify-between text-center">
                    <label className="my-[0.5rem] text-lg font-semibold">대표 이미지</label>
                    <label htmlFor="image" className="h-[2.2rem] w-[8rem] cursor-pointer items-center rounded-[1rem] bg-gray-medium py-[0.2rem] text-sm">
                      파일 선택
                    </label>
                  </div>

                  <div className="relative flex h-[14.5rem] w-full items-center justify-center overflow-hidden rounded-[1rem] border-[0.1rem] border-gray-light">
                    <Image
                      src={previewImage}
                      alt="preview image"
                      fill={previewImage !== "/meetup_default_image.png"}
                      width={previewImage === "/meetup_default_image.png" ? 50 : undefined}
                      height={previewImage === "/meetup_default_image.png" ? 50 : undefined}
                      style={{
                        objectFit: previewImage === "/meetup_default_image.png" ? "contain" : "cover",
                      }}
                      className="rounded-[1rem]"
                    />{" "}
                  </div>
                </div>
                <LabeledInput
                  id="isPublic"
                  name="isPublic"
                  label="모집글 비공개"
                  type="checkbox"
                  ref={isPublicRef}
                  defaultChecked={mode === "edit" ? previousMeetupData?.isPublic === false : false}
                  containerClassName={"flex md:justify-center items-center my-[3rem]"}
                  labelClassName={"text-2xl text-primary items-baseline font-semibold ml-[0.5rem] mr-[0.5rem]"}
                  className={
                    "h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                  }
                />
                <div className="mt-[3rem] flex justify-center">
                  <button
                    type="submit"
                    className="text-bold h-[4rem] w-[14rem] items-center rounded-[1rem] bg-primary text-center text-lg text-white disabled:bg-gray-medium md:w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "처리 중..." : mode === "create" ? "모임 등록" : "모임 수정"}
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
