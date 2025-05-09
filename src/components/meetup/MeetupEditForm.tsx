"use client";

import { BASE_URL } from "@/constants/baseURL";
import { editMeetupApi, getMeetupByIdApi } from "@/services/meetup.service";
import { LabeledInputProps, LabeledSelectProps, Meetup } from "@/types/meetupType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

// const token = process.env.NEXT_PUBLIC_MY_TOKEN;
const token = Cookies.get("accessToken");

// 뭔지도 모르고 그냥 써놧네
const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ id, name, label, type, placeholder, value, defaultValue, defaultChecked, disabled, required, checked, onChange }, ref) => (
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
      />
    </div>
  ),
);

// 잘 모르겠고 태그랑 타입 다 공부해야돼

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, defaultValue, multiple = true, required = true }, ref) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} defaultValue={defaultValue} required={required} ref={ref}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
));

const MeetupEditForm = ({ meetupId }: { meetupId: number }) => {
  const queryClient = useQueryClient();

  // 왜 ref 초기값이 null인지도 모르고 있죠?
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      alert("onSucess invalidate 모임 정보 수정 성공");
      router.push("/");
    },
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
  const handleEditFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // 유효성 검사 빌드업 시작
    if (!previousMeetupData) return;

    // 오늘 날짜 겟
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    //set Hours 왜 하더라

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

    // 실질적 유효성 함수 시작
    const editMeetupValidateDate = (date: string | null, fieldName: string): boolean => {
      let previousStartDate: Date | null = null;
      let previousEndDate: Date | null = null;
      // 문법 null = null; 모지

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

      // 오늘 기준으로 본 모임 시작일
      // 이미 시작 => 시작일 수정 X, 아직 시작 안함 => 오늘 이후 O
      if (previousStartDate && previousStartDate < now && inputDate !== previousStartDate) {
        alert("이미 시작된 모임의 모임 시작일은 수정할 수 없습니다.");
        return false;
      } else if (previousStartDate && inputDate < now) {
        alert("모임 시작일은 오늘보다 이전으로 설정할 수 없습니다.");
        return false;
      }
      // --TO DO--
      // 이미 종료된 모임 : 그냥 영원히 매장
      // 오늘 기준으로 본 모임 종료일
      // 이미 종료 => 기존보다 더 빠르게 수정X, 오늘 이후O
      if (previousEndDate && previousEndDate < now && previousEndDate === inputDate && inputDate < now) {
        alert("이미 종료된 모임의 모임 종료일은 지난 날짜로 설정할 수 없습니다.");
        return false;
      }

      //-------------------------------------

      // 아직 종료 안 함 => 기존보다 이르게 O 오늘보다 이르게 X 오늘 이후 O
      if (previousEndDate && previousEndDate >= now && inputDate < now) {
        alert("모임 종료일은 지난 날짜로 설정할 수 없습니다.");
        return false;
      }

      // 모임 시작일 기준으로 종료일을 검사하기
      // 이미 시작함, 이미 시작 안함 => 기존보다 더 이르게 수정 O, 오늘 이후 O
      // 근데 여기서 inputDate가 종료일인지 어케 알아❓❓❓❓❓❓❓❓❓
      if (previousStartDate && inputDate < now) {
        alert("모임 종료일은 지난 날짜로 설정할 수 없습니다.");
        return false;
      }

      // 모임 시작일과 모임 종료일 비교
      if (endDate !== null && startDate !== null && endDate < startDate) {
        const beforeAfter = endDate < startDate;
        console.log("앞뒤틀리니?", beforeAfter);
        alert("모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.");
        return false;
      }

      if (fieldName === "adEndedAt" && inputDate < now) {
        // adEndDate < now 였는데 오류나서 위처럼 고친거야
        console.log("광고종료 검사 실행됐니");
        alert("광고 종료일은 지난 날짜로 설정할 수 없습니다.");
        return false;
      }

      // 사용자 입력 날짜값이 오늘보다 이전이면 false(걸림)
      // 근데 이걸 통합으로 바로 못 쓰는게, 오늘보다 이전이어도 되는 경우가 있어서
      // if (inputDate !== null && inputDate < now) {
      //   alert(`${getDateFieldName(fieldName)}이 이미 지난 날짜로 설정되었습니다.`);
      //   return false;
      // }

      return true;
    };

    if (!editMeetupValidateDate(startDate, "startedAt") || !editMeetupValidateDate(endDate, "endedAt") || !editMeetupValidateDate(adEndDate, "adEndedAt")) {
      console.log("제출 전 유효성 검사 실행됐음");
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

      isPublic: isPublicRef.current?.checked || false, //이래도 안됨
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const formData = new FormData();

    formData.append("payload", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      formData.append("image", file);
    }

    // 이게 뭐야
    const payload = formData.get("payload");
    console.log("서버로 전송되는 수정된 모임데이터래:", JSON.stringify(payload as string));
    editMutation.mutate(formData);

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
        <LabeledInput id="name" name="name" label="모임 이름" type="text" ref={nameRef} defaultValue={previousMeetupData?.name} required />
        <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} defaultValue={previousMeetupData?.category} required />
        <LabeledInput
          id="startedAt"
          name="startedAt"
          label="모임 시작 날짜"
          type="date"
          ref={startedAtRef}
          defaultValue={previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
          disabled={isStartedAtNull}
          required
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
        />

        <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} defaultValue={previousMeetupData?.endedAt?.substring(0, 10)} disabled={isEndedAtNull} required />
        <LabeledInput
          id="endedAtUndecided"
          name="endedAtUndecided"
          label="미정"
          type="checkbox"
          checked={isEndedAtNull}
          onChange={event => {
            setIsEndedAtNull(event?.target.checked);
          }}
        />
        <LabeledSelect id="place" name="place" label="모임 지역" options={placeOptions} ref={placeRef} defaultValue={previousMeetupData?.place} required />
        <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소 설명" type="text" ref={placeDescriptionRef} defaultValue={previousMeetupData?.placeDescription} required />
        <LabeledInput id="adTitle" name="adTitle" label="광고 제목" type="text" ref={adTitleRef} defaultValue={previousMeetupData?.adTitle} required />
        <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} defaultValue={previousMeetupData?.adEndedAt?.substring(0, 10)} required />
        <label htmlFor="description">광고글 설명</label>
        <textarea id="description" name="description" ref={descriptionRef} defaultValue={previousMeetupData?.description || ""} placeholder="설명을 작성하세요" />
        <LabeledInput id="isPublic" name="isPublic" label="공개 여부" type="checkbox" ref={isPublicRef} defaultChecked={previousMeetupData?.isPublic} />

        <div>
          {previewImage ? <Image src={previewImage} alt="미리보기 이미지" width={100} height={80} /> : <p>미리보기 이미지가 없습니다.</p>}
          <LabeledInput id="image" name="image" label="광고글 대표 이미지" type="file" accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp" onChange={handlePreviewImageChange} />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </>
  );
};

export default MeetupEditForm;
