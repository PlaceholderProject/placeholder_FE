"use client";

import { BASE_URL } from "@/constants/baseURL";
import { editMeetupApi, getMeetupByIdApi } from "@/services/meetup.service";
import { LabeledInputProps, LabeledSelectProps, Meetup } from "@/types/meetupType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

const token = Cookies.get("accessToken");

// 뭔지도 모르고 그냥 써놧네
// 이젠 앎..?
const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ id, name, label, type, placeholder, value, defaultValue, defaultChecked, disabled, required, checked, onChange, maxLength, className, labelClassName, containerClassName }, ref) => (
    <div>
      <label htmlFor={id}>{label}</label>
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
  ),
);

// 잘 모르겠고 태그랑 타입 다 공부해야돼

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(
  ({ id, name, label, options, defaultValue, multiple = true, required = true, className, labelClassName, containerClassName }, ref) => (
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
  ),
);

const MeetupEditForm = ({ meetupId }: { meetupId: number }) => {
  const queryClient = useQueryClient();

  // 왜 ref 초기값이 null인지도 모르고 있죠?
  //이젠 알죠!
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

  // 🍰 useEffect를 시작, 종료 날짜 미정 체크에 또 써야 하는데
  // 🍰 이거 나중에 커스텀훅으로 묶을까?

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

  const MAX_NAME_LENGTH = 15;
  const MAX_PLACE_LENGTH = 20;
  const MAX_AD_TITLE_LENGTH = 15;
  const MAX_DESCRIPTION_LENGTH = 60;

  // 체크박스 상태 관리 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  // 제출 로딩상태 관리 스테이트 추가
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("미리보기 설저오디는 이미지 URL: ", imageUrl);
      setPreviewImage(imageUrl);
    }
  }, [previousMeetupData]);

  useEffect(() => {
    previousMeetupData?.startedAt === null ? setIsStartedAtNull(true) : setIsStartedAtNull(false);
    previousMeetupData?.endedAt === null ? setIsEndedAtNull(true) : setIsEndedAtNull(false);
  }, [previousMeetupData]);

  const editMutation = useMutation<void, Error, FormData>({
    mutationFn: formData => editMeetupApi(meetupId, formData),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
    //   queryClient.invalidateQueries({ queryKey: ["meetups"] });
    //   alert("onSucess invalidate 모임 정보 수정 성공");
    //   router.push("/");
    // },
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

  // 모임 수정 후 제출 함수
  // async함수로 수정함
  const handleEditFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 유효성 검사 빌드업 시작
    if (!previousMeetupData) return;

    // 오늘 날짜 겟
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // ref를 통해 사용자 입력값을 DOM에서? 가져오고 이걸 필드네임을 파라미터로 받는 editMeetupValidateDate에 넘기는거여
    // 실행될 때마다 조건에 맞는 함수속 if문에 들어간다

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
      // 오늘 기준으로 본 모임 시작일
      if (fieldName === "startedAt") {
        // 이미 시작 => 시작일 수정 X,
        if (previousStartDate && previousStartDate < now && +inputDate !== +previousStartDate) {
          alert(`이미 시작된 모임의 ${getDateFieldName(fieldName)}은 수정할 수 없습니다.`);
          // console.log("이전 시작일:", previousStartDate);
          // console.log("인풋데이트:", inputDate);
          // console.log("이전 시작일과 인풋 일치 여부", previousStartDate === inputDate);
          // console.log(typeof previousStartDate);
          // console.log(typeof inputDate);
          return false;
        }
        // 아직 시작 안함 => 오늘 이후 O
        if (previousStartDate && +inputDate !== +previousStartDate && inputDate < now) {
          alert(`${getDateFieldName(fieldName)}은 오늘보다 이전으로 설정할 수 없습니다.`);
          return false;
        }
      }

      // 2. 종료일만 검증
      // --TO DO--
      // 이미 종료된 모임 : 그냥 영원히 매장

      if (fieldName === "endedAt") {
        // 오늘 기준으로 본 모임 종료일
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

        // 모임 시작일 기준으로 종료일을 검사하기
        // 이미 시작함, 이미 시작 안함 => 기존보다 더 이르게 수정 O, 오늘 이후 O
        // 근데 여기서 inputDate가 종료일인지 어케 알아❓❓❓❓❓❓❓❓❓
        // ❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️이 조건문이 그냥 모든 날짜검증에서 실해오디고잇었다❗️
        if (previousStartDate && inputDate < now) {
          alert(`${getDateFieldName(fieldName)}은 지난 날짜로 설정할 수 없습니다.`);
          console.log("261번째줄");
          console.log("인풋뭔데? 여기서 인풋이 엔드데이트여야돼", inputDate);
          return false;
        }

        // 모임 시작일과 모임 종료일 비교
        if (endDate !== null && startDate !== null && endDate < startDate) {
          alert(`${getDateFieldName}은 시작일보다 빠르게 설정할 수 없습니다.`);
          return false;
        }
      }

      // 3. 광고종료일
      if (fieldName === "adEndedAt") {
        const previousAdEndDate = previousMeetupData.adEndedAt;
        if (+inputDate !== +previousAdEndDate && inputDate < now) {
          // adEndDate < now 였는데 오류나서 위처럼 고친거야
          console.log("광고종료 검사 실행");
          alert(`${getDateFieldName(fieldName)}은 지난 날짜로 설정할 수 없습니다.`);
          return false;
        }
      }

      // 사용자 입력 날짜값이 오늘보다 이전이면 false(걸림)
      // 근데 이걸 통합으로 바로 못 쓰는게, 오늘보다 이전이어도 되는 경우가 있어서
      // if (inputDate !== null && inputDate < now) {
      //   alert(`${getDateFieldName(fieldName)}이 이미 지난 날짜로 설정되었습니다.`);
      //   return false;
      // }

      return true;
    };
    // 유효성 검사 함수 실제 실행
    // inputDate가 어떻게 필드 네임의 그 데이터인지 연결시키는가? 바로 여기서 if 절에 들어가서, 그게 일치를 해야 그 값을 갖고 적용시키려고 한다고!!!!
    // 여기였다 연결점
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
      // 수정전: isPublic: isPublicRef.current?.checked || false,
      //       isPublic: isPublicRef.current?.checked || false,

      isPublic: !isPublicRef.current?.checked || true, //이래도 안됨
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const editedFormData = new FormData();

    editedFormData.append("payload", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      editedFormData.append("image", file);
    }

    // 이게 뭐야

    const payload = editedFormData.get("payload");
    console.log("서버로 전송되는 수정된 모임데이터래:", JSON.stringify(payload as string));

    // editMutation.mutate(formData);
    // 위처럼 뮤테이션이던 것을 아래 트라이캐치 블록에서 mutateAsync()

    try {
      await editMutation.mutateAsync(editedFormData);
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });

      router.push("/");
    } catch (error: any) {
      console.error("모임 수정 오류:", error?.message || "알 수 없는 오류 발생");
      alert(`모임 수정중 오류 발생: ${error?.message || "알수없는 오류"}`);
    }
    // const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   if (event.target.files && event.target.files[0]) {
    //     const previewFile = event.target.files[0];
    //     const previewFileUrl = URL.createObjectURL(previewFile);
    //     setPreviewImage(previewFileUrl);
    //   }
    // };

    if (isPending) return <p>로딩 중...</p>;
    if (isError) return <p>모임 데이터 로드 에러 발생</p>;
  };

  // -- 여기까지 수정 제출 함수 선언 --

  return (
    <>
      <form onSubmit={handleEditFormSubmit}>
        <div>
          <LabeledSelect
            id="category"
            name="category"
            label="모임 성격"
            options={categoryOptions}
            ref={categoryRef}
            defaultValue={previousMeetupData?.category}
            required
            className={""}
            labelClassName={""}
            containerClassName={""}
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
              className={""}
              labelClassName={""}
              containerClassName={""}
            />
            <span className="text-sm text-gray-400">
              {nameLength <= MAX_NAME_LENGTH ? nameLength : MAX_NAME_LENGTH} / {MAX_NAME_LENGTH} 자
            </span>
            {nameLength >= MAX_NAME_LENGTH && <p className="text-sm text-red-500">모임 이름은 최대 {MAX_NAME_LENGTH}자까지 입력할 수 있습니다.</p>}
          </div>
          <div>
            <LabeledInput
              id="startedAt"
              name="startedAt"
              label="모임 시작일"
              type="date"
              ref={startedAtRef}
              defaultValue={previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
              disabled={isStartedAtNull}
              required
              className={""}
              labelClassName={""}
              containerClassName={""}
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
              className={""}
              labelClassName={""}
              containerClassName={""}
            />

            <LabeledInput
              id="endedAt"
              name="endedAt"
              label="모임 종료일"
              type="date"
              ref={endedAtRef}
              defaultValue={previousMeetupData?.endedAt?.substring(0, 10)}
              disabled={isEndedAtNull}
              required
              className={""}
              labelClassName={""}
              containerClassName={""}
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
              className={""}
              labelClassName={""}
              containerClassName={""}
            />
            <span className="text-sm text-gray-400">
              {isStartedAtNull && isEndedAtNull && <p className="text-sm text-red-500">모임 시작일과 모임 종료일이 모두 미정일 경우, 내 공간 - 내 광고에서 광고글만 확인 가능합니다.</p>}
            </span>
          </div>
          <LabeledSelect
            id="place"
            name="place"
            label="모임 지역"
            options={placeOptions}
            ref={placeRef}
            defaultValue={previousMeetupData?.place}
            required
            className={""}
            labelClassName={""}
            containerClassName={""}
          />

          <div>
            {" "}
            <LabeledInput
              id="placeDescription"
              name="placeDescription"
              label="모임 장소 설명"
              type="text"
              ref={placeDescriptionRef}
              defaultValue={previousMeetupData?.placeDescription}
              required
              maxLength={MAX_PLACE_LENGTH}
              onChange={handlePlaceLengthChange}
              className={""}
              labelClassName={""}
              containerClassName={""}
            />
            <span className="text-sm text-gray-400">
              {placeLength <= MAX_PLACE_LENGTH ? placeLength : MAX_PLACE_LENGTH} / {MAX_PLACE_LENGTH} 자
            </span>
            {placeLength >= MAX_PLACE_LENGTH && <p className="text-sm text-red-500">모임 장소 설명은 최대 {MAX_PLACE_LENGTH}자까지 입력할 수 있습니다.</p>}
          </div>

          <div>
            <LabeledInput
              id="adTitle"
              name="adTitle"
              label="광고 제목"
              type="text"
              ref={adTitleRef}
              defaultValue={previousMeetupData?.adTitle}
              required
              onChange={handleAdTitleLengthChange}
              maxLength={MAX_AD_TITLE_LENGTH}
              className={""}
              labelClassName={""}
              containerClassName={""}
            />
            <span className="text-sm text-gray-400">
              {adTitleLength <= MAX_AD_TITLE_LENGTH ? adTitleLength : MAX_AD_TITLE_LENGTH} / {MAX_AD_TITLE_LENGTH} 자
            </span>
            {adTitleLength >= MAX_AD_TITLE_LENGTH && <p className="tet-sm text-red-500">광고글 제목은 최대 {MAX_AD_TITLE_LENGTH}자 까지 입력할 수 있습니다.</p>}
          </div>

          <LabeledInput
            id="adEndedAt"
            name="adEndedAt"
            label="광고 종료 날짜"
            type="date"
            ref={adEndedAtRef}
            defaultValue={previousMeetupData?.adEndedAt?.substring(0, 10)}
            required
            className={""}
            labelClassName={""}
            containerClassName={""}
          />
          <div>
            <label htmlFor="description">광고글 설명</label>
            <textarea
              id="description"
              name="description"
              ref={descriptionRef}
              defaultValue={previousMeetupData?.description || ""}
              placeholder="멤버 광고글에 보일 설명을 적어주세요"
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={handleDescriptionLengthChange}
            />
            <span className="text-sm text-gray-400">
              {" "}
              {descriptionLength <= MAX_DESCRIPTION_LENGTH ? descriptionLength : MAX_DESCRIPTION_LENGTH} / {MAX_DESCRIPTION_LENGTH} 자
            </span>
            {descriptionLength >= MAX_DESCRIPTION_LENGTH && <p className="text-sm text-red-500">광고글 설명은 최대 {MAX_DESCRIPTION_LENGTH}자 까지 입력할 수 있습니다.</p>}
          </div>
          <LabeledInput
            id="isPublic"
            name="isPublic"
            label="공개 여부"
            type="checkbox"
            ref={isPublicRef}
            defaultChecked={previousMeetupData?.isPublic}
            className={""}
            labelClassName={""}
            containerClassName={""}
          />

          <div>
            {previewImage ? <Image src={previewImage} alt="미리보기 이미지" width={100} height={80} /> : <p>미리보기 이미지가 없습니다.</p>}
            <LabeledInput
              id="image"
              name="image"
              label="광고글 대표 이미지"
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
              onChange={handlePreviewImageChange}
              className={""}
              labelClassName={""}
              containerClassName={""}
            />
          </div>
          <button type="submit">수정 완료</button>
        </div>
      </form>
    </>
  );
};

export default MeetupEditForm;
