"use client";

import { BASE_URL } from "@/constants/baseURL";
import { editMeetupApi, getMeetupByIdApi } from "@/services/meetup.service";
import { LabeledInputProps, LabeledSelectProps, Meetup } from "@/types/meetupType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MAX_AD_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_PLACE_LENGTH } from "@/constants/meetup";

// displayName 추가
const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ id, name, label, type, placeholder, value, defaultValue, defaultChecked, disabled, required, checked, onChange, maxLength, className, labelClassName, containerClassName }, ref) => {
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
            value={value}
            defaultValue={defaultValue}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            checked={checked}
            onChange={onChange}
            ref={ref}
            maxLength={maxLength}
            className={className}
          />
        </div>
      </>
    );
  },
);
LabeledInput.displayName = "LabeledInput";

// displayName 추가
const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, defaultValue, required = true, className, labelClassName, containerClassName }, ref) => {
  return (
    <>
      <div className={containerClassName}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        <select id={id} name={name} defaultValue={defaultValue} required={required} ref={ref} className={className}>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
});
LabeledSelect.displayName = "LabeledSelect";

const MeetupEditForm = ({ meetupId }: { meetupId: number }) => {
  const queryClient = useQueryClient();

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

  // 글자수 관리 위한 스테이트
  const [nameLength, setNameLength] = useState(0);
  const [placeLength, setPlaceLength] = useState(0);
  const [adTitleLength, setAdTitleLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const handleNameLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameLength(event.target.value.length);
  };

  const handlePlaceLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceLength(event.target.value.length);
  };

  const handleAdTitleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdTitleLength(event.target.value.length);
  };

  const handleDescriptionLengthChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionLength(event.target.value.length);
  };

  // 체크박스 상태 관리 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useQuery<Meetup, Error>({
    queryKey: ["meetup", meetupId],
    queryFn: () => getMeetupByIdApi(meetupId),
    retry: 0,
  });

  useEffect(() => {
    if (previousMeetupData?.image) {
      const imageUrl = `${BASE_URL}${previousMeetupData.image}`;
      console.log("미리보기 설정되는 이미지 URL: ", imageUrl);
      setPreviewImage(imageUrl);
    }
  }, [previousMeetupData]);

  useEffect(() => {
    if (previousMeetupData) {
      setIsStartedAtNull(previousMeetupData.startedAt === null);
      setIsEndedAtNull(previousMeetupData.endedAt === null);
    }
  }, [previousMeetupData]);

  const editMutation = useMutation<void, Error, FormData>({
    mutationFn: formData => editMeetupApi(meetupId, formData),
  });

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // 미리보기 이미지 변경 핸들 함수
  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
  };

  // ref를 통해 사용자 입력값을 DOM에서? 가져오고 이걸 필드네임을 파라미터로 받는 editMeetupValidateDate에 넘기는거여
  // 실행될 때마다 조건에 맞는 함수속 if문에 들어간다

  // 모임 수정 후 제출 함수
  const handleEditFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 유효성 검사 빌드업 시작
    if (!previousMeetupData) return;

    // 오늘 날짜 겟
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const startDate = isStartedAtNull ? null : startedAtRef?.current?.value || null;
    const endDate = isEndedAtNull ? null : endedAtRef?.current?.value || null;
    const adEndDate = adEndedAtRef.current?.value || null;

    //필드 이름
    const getDateFieldName = (fieldName: string): string => {
      switch (fieldName) {
        case "startedAt":
          return "모임 시작일";
        case "endedAt":
          return "모임 종료일";
        case "adEndedAt":
          return "광고 종료일";
        default:
          return fieldName;
      }
    };

    // 실질적 유효성 검사 함수
    // 불리언값을 리턴
    // 날짜와 필드네임을 받는데
    // 그게 아래에서 282줄에서 실행될 때
    const editMeetupValidateDate = (date: string | null, fieldName: string): boolean => {
      let previousStartDate: Date | null = null;
      let previousEndDate: Date | null = null;

      if (previousMeetupData?.startedAt) {
        previousStartDate = new Date(previousMeetupData.startedAt);
        previousStartDate.setHours(0, 0, 0, 0);
      }

      if (previousMeetupData?.endedAt) {
        previousEndDate = new Date(previousMeetupData.endedAt);
        previousEndDate.setHours(0, 0, 0, 0);
      }

      if (!date) {
        return true;
      }

      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);

      // 1. 시작일만 검증
      if (fieldName === "startedAt") {
        // 이미 시작 => 시작일 수정 X,
        if (previousStartDate && previousStartDate < now && +inputDate !== +previousStartDate) {
          alert(`이미 시작된 모임의 ${getDateFieldName(fieldName)}은 수정할 수 없습니다.`);
          return false;
        }
        // 아직 시작 안함 => 오늘 이후 O
        if (previousStartDate && +inputDate !== +previousStartDate && inputDate < now) {
          alert(`${getDateFieldName(fieldName)}은 오늘보다 이전으로 설정할 수 없습니다.`);
          return false;
        }
      }

      // 2. 종료일만 검증
      if (fieldName === "endedAt") {
        // 이미 종료 => 기존보다 더 이르게 수정X, 오늘 이후O, 즉 연장은 가능
        if (previousEndDate && previousEndDate < now && inputDate < now) {
          alert(`이미 종료된 모임의 ${getDateFieldName(fieldName)}은 지난 날짜로 설정할 수 없습니다.`);
          console.log("지난 종료일", previousEndDate);
          console.log("지금", now);
          return false;
        }
        // 아직 종료 안 함 => 기존보다 이르게 O 오늘보다 이르게 X 오늘 이후 O
        if (previousEndDate && previousEndDate >= now && inputDate < now) {
          alert(`${getDateFieldName(fieldName)}은 지난 날짜로 설정할 수 없습니다.`);
          return false;
        }

        // 모임 시작일과 모임 종료일 비교
        if (endDate !== null && startDate !== null && endDate < startDate) {
          alert(`모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.`);
          return false;
        }
      }

      // 3. 광고종료일
      if (fieldName === "adEndedAt") {
        const previousAdEndDate = new Date(previousMeetupData.adEndedAt);
        if (+inputDate !== +previousAdEndDate && inputDate < now) {
          console.log("광고종료 검사 실행");
          alert(`${getDateFieldName(fieldName)}은 지난 날짜로 설정할 수 없습니다.`);
          return false;
        }
      }

      return true;
    };

    // 유효성 검사 함수 실제 실행
    if (!editMeetupValidateDate(startDate, "startedAt") || !editMeetupValidateDate(endDate, "endedAt") || !editMeetupValidateDate(adEndDate, "adEndedAt")) {
      console.log("제출 전 유효성 검사 실행됐음");
      console.log(getDateFieldName("startedAt"), "모임 시작일", startDate);
      console.log(getDateFieldName("endedAt"), "모임 종료일", endDate);
      console.log(getDateFieldName("adEndedAt"), "광고 종료일", adEndDate);
      return;
    }

    const editedMeetup: Meetup = {
      ...previousMeetupData,
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      place: placeRef.current?.value || "",
      placeDescription: placeDescriptionRef.current?.value || "",
      startedAt: isStartedAtNull ? null : startedAtRef.current?.value || null,
      endedAt: isEndedAtNull ? null : endedAtRef.current?.value || null,
      adTitle: adTitleRef.current?.value || "",
      adEndedAt: adEndedAtRef.current?.value || "",
      isPublic: !isPublicRef.current?.checked || true,
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const editedFormData = new FormData();
    editedFormData.append("payload", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      editedFormData.append("image", file);
    }

    const payload = editedFormData.get("payload");
    console.log("서버로 전송되는 수정된 모임데이터:", JSON.stringify(payload as string));

    try {
      await editMutation.mutateAsync(editedFormData);
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      alert("모임 수정에 성공했습니다!");

      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류 발생";
      console.error("모임 수정 오류:", errorMessage);
      alert(`모임 수정중 오류 발생: ${errorMessage}`);
    }
  };

  if (isPending) return <p>로딩 중...</p>;
  if (isError) return <p>모임 데이터 로드 에러 발생</p>;

  return (
    <>
      <div className="mx-auto w-[29.2rem] border-[0.1rem] pb-[4rem]">
        <div className="mb-[8rem] grid min-h-screen place-items-center">
          <h1 className="mb-[4rem] mt-[10rem] text-center text-3xl font-semibold">모임 수정하기</h1>
          <form onSubmit={handleEditFormSubmit}>
            <h3 className="text-2xl font-semibold text-primary">모임에 대해 알려주세요.</h3>

            <div>
              <LabeledSelect
                id="category"
                name="category"
                label="모임 성격"
                options={categoryOptions}
                ref={categoryRef}
                defaultValue={previousMeetupData?.category}
                required
                containerClassName={"my-[0.5rem] flex items-center"}
                labelClassName={"font-semibold text-lg mr-7"}
                className={"h-[4rem] w-[21.3rem] rounded-[1rem] border-[0.1rem] border-gray-light text-center text-base"}
              />
              <div>
                <LabeledInput
                  id="name"
                  name="name"
                  label="모임 이름"
                  type="text"
                  ref={nameRef}
                  defaultValue={previousMeetupData?.name}
                  required
                  onChange={handleNameLengthChange}
                  maxLength={MAX_NAME_LENGTH}
                  containerClassName={"my-[0.5rem] flex flex-col gap-2"}
                  labelClassName={"font-semibold text-lg"}
                  className={"h-[4rem] w-[29.2rem] items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
                />
                <span className="text-sm text-gray-dark">
                  {nameLength <= MAX_NAME_LENGTH ? nameLength : MAX_NAME_LENGTH} / {MAX_NAME_LENGTH} 자
                </span>
                {nameLength >= MAX_NAME_LENGTH && <p className="text-sm text-warning">모임 이름은 최대 {MAX_NAME_LENGTH}자까지 입력할 수 있습니다.</p>}
              </div>
              <h3 className={"mt-4 text-lg font-semibold"}>모임 날짜</h3>

              <div className="grid grid-cols-[1fr_auto] gap-4">
                <LabeledInput
                  id="startedAt"
                  name="startedAt"
                  label="시작일"
                  type="date"
                  ref={startedAtRef}
                  defaultValue={previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
                  disabled={isStartedAtNull}
                  required
                  containerClassName={"grid grid-cols-4 mt-[1rem]"}
                  labelClassName={"text-base pt-[1rem] pr-[1rem]"}
                  className={"h-[4rem] w-[18rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem]"}
                />
                <LabeledInput
                  id="startedAtUndecided"
                  name="startedAtUndecided"
                  label="미정"
                  type="checkbox"
                  checked={isStartedAtNull}
                  onChange={event => {
                    setIsStartedAtNull(event?.target.checked);
                  }}
                  containerClassName={"flex items-center"}
                  labelClassName={"text-base pl-[0.5rem] pr-[0.5rem] pt-[1rem]"}
                  className={
                    "mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                  }
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <LabeledInput
                  id="endedAt"
                  name="endedAt"
                  label="종료일"
                  type="date"
                  ref={endedAtRef}
                  defaultValue={previousMeetupData?.endedAt?.substring(0, 10)}
                  disabled={isEndedAtNull}
                  required
                  containerClassName={"grid grid-cols-4 mt-[1rem]"}
                  labelClassName={"text-base pt-[1rem] pr-[1rem]"}
                  className={"h-[4rem] w-[18rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem]"}
                />
                <LabeledInput
                  id="endedAtUndecided"
                  name="endedAtUndecided"
                  label="미정"
                  type="checkbox"
                  checked={isEndedAtNull}
                  onChange={event => {
                    setIsEndedAtNull(event?.target.checked);
                  }}
                  containerClassName={"flex items-center"}
                  labelClassName={"text-base pl-[0.5rem] pr-[0.5rem] pt-[1rem]"}
                  className={
                    "mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                  }
                />
                <span className="text-sm text-warning">
                  {isStartedAtNull && isEndedAtNull && (
                    <p className="text-sm text-red-500">
                      모임의 시작일과 종료일이 모두 미정이면, <br />
                      <span className="font-semibold">내 공간</span> - <span className="font-semibold">내 광고</span> 에서 광고글만 확인 가능합니다.
                    </p>
                  )}
                </span>
              </div>
              <h2 className="my-[0.5rem] items-baseline justify-start text-2xl font-semibold text-primary">
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
                  defaultValue={previousMeetupData?.adTitle}
                  required
                  onChange={handleAdTitleLengthChange}
                  maxLength={MAX_AD_TITLE_LENGTH}
                  containerClassName={"my-[0.5rem] flex flex-col items-start"}
                  labelClassName={"font-semibold text-lg my-[0.5rem]"}
                  className={"h-[4rem] w-[29.2rem] items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
                />
                <span className="text-sm text-gray-400">
                  {adTitleLength <= MAX_AD_TITLE_LENGTH ? adTitleLength : MAX_AD_TITLE_LENGTH} / {MAX_AD_TITLE_LENGTH} 자
                </span>
                {adTitleLength >= MAX_AD_TITLE_LENGTH && <p className="text-sm text-red-500">광고글 제목은 최대 {MAX_AD_TITLE_LENGTH}자 까지 입력할 수 있습니다.</p>}
              </div>
              <div>
                <h2 className={"mt-4 text-lg font-semibold"}>멤버 모집 기간</h2>
                <LabeledInput
                  id="adEndedAt"
                  name="adEndedAt"
                  label="광고 종료일"
                  type="date"
                  ref={adEndedAtRef}
                  defaultValue={previousMeetupData?.adEndedAt?.substring(0, 10)}
                  required
                  containerClassName={"flex justify-between"}
                  labelClassName={"text-base pt-[1rem] w-[8rem]"}
                  className={"h-[4rem] w-[21rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem]"}
                />
              </div>
              <div>
                <LabeledInput
                  id="placeDescription"
                  name="placeDescription"
                  label="모임 장소"
                  type="text"
                  ref={placeDescriptionRef}
                  defaultValue={previousMeetupData?.placeDescription}
                  required
                  maxLength={MAX_PLACE_LENGTH}
                  onChange={handlePlaceLengthChange}
                  containerClassName={"flex flex-col my-[0.5rem]"}
                  labelClassName={"mt-[1rem] my-[0.5rem] text-lg font-semibold"}
                  className={"h-[4rem] w-[29.2rem] items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
                />
                <span className="text-sm text-gray-dark">
                  {placeLength <= MAX_PLACE_LENGTH ? placeLength : MAX_PLACE_LENGTH} / {MAX_PLACE_LENGTH} 자
                </span>
                {placeLength >= MAX_PLACE_LENGTH && <p className="text-sm text-warning">모임 장소 설명은 최대 {MAX_PLACE_LENGTH}자까지 입력할 수 있습니다.</p>}
              </div>
              <div>
                <LabeledSelect
                  id="category"
                  name="category"
                  label="모임 지역"
                  options={placeOptions}
                  ref={placeRef}
                  defaultValue={previousMeetupData?.place}
                  required
                  containerClassName={"flex items-center my-[1rem]"}
                  labelClassName={"text-base mr-[0.5rem]"}
                  className={"h-[4rem] w-[23rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[1rem] py-[1rem] text-center"}
                />
              </div>

              <div className="my-[0.5rem] flex flex-col py-[0.5rem]">
                <label className="my-[0.5rem] text-lg font-semibold" htmlFor="description">
                  광고글 설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  ref={descriptionRef}
                  defaultValue={previousMeetupData?.description || ""}
                  placeholder="멤버 광고글에 보일 설명을 작성해주세요"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={handleDescriptionLengthChange}
                  className="h-[17rem] w-[29.2rem] rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"
                />
                <span className="pt-[1rem] text-sm text-gray-dark">
                  {" "}
                  {descriptionLength <= MAX_DESCRIPTION_LENGTH ? descriptionLength : MAX_DESCRIPTION_LENGTH} / {MAX_DESCRIPTION_LENGTH} 자
                </span>
                {descriptionLength >= MAX_DESCRIPTION_LENGTH && <p className="text-sm text-warning">광고글 설명은 최대 {MAX_DESCRIPTION_LENGTH}자 까지 입력할 수 있습니다.</p>}
              </div>

              <div className="my-[0.5rem]">
                <LabeledInput
                  id="image"
                  name="image"
                  label="대표 이미지"
                  type="file"
                  ref={imageRef}
                  accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
                  onChange={handlePreviewImageChange}
                  containerClassName="sr-only"
                  labelClassName="sr-only"
                  className="sr-only"
                />
                {/* 커스텀 버튼 */}
                <div className="flex-cols-2 flex items-center justify-between text-center">
                  <label className="my-[0.5rem] text-lg font-semibold">대표 이미지</label>
                  <label htmlFor="image" className="h-[2.2rem] w-[8rem] cursor-pointer items-center rounded-[1rem] bg-gray-medium py-[0.2rem] text-sm">
                    파일 선택
                  </label>
                </div>
                <div className="relative flex h-[14.5rem] w-[29.2rem] items-center justify-center overflow-hidden rounded-[1rem] border-[0.1rem] border-gray-light">
                  {previewImage ? <Image src={previewImage} alt="미리보기 이미지" fill style={{ objectFit: "cover" }} className="rounded-[1rem]" /> : <p>미리보기 이미지가 없습니다.</p>}
                </div>
              </div>
              <LabeledInput
                id="isPublic"
                name="isPublic"
                label="모집글 비공개"
                type="checkbox"
                ref={isPublicRef}
                defaultChecked={!previousMeetupData?.isPublic}
                containerClassName={"flex items-center my-[3rem]"}
                labelClassName={"text-2xl text-primary items-baseline font-semibold pl-[0.5rem] pr-[0.5rem]"}
                className={
                  "h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                }
              />
              <div className="mt-[3rem] flex justify-center">
                <button type="submit" className="text-bold h-[4rem] w-[14rem] items-center rounded-[1rem] bg-primary text-center text-lg text-white">
                  모임 수정
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MeetupEditForm;
