"use client";

import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewMeetup } from "@/types/meetupType";
import { LabeledInputProps } from "@/types/meetupType";
import { LabeledSelectProps } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { createMeetupApi } from "@/services/meetup.service";

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(({ id, name, label, type, placeholder, value, defaultValue, disabled, required, checked, onChange }, ref) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
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
        />
      </div>
    </>
  );
});

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, required = true }, ref) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
        <select id={id} name={name} required={required} ref={ref}>
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

const MeetupForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Ref
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
  const isPublicRef = useRef<HTMLInputElement>(null); //초기값 왜 null
  const categoryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // 체크 박스 상태 관리 위한 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  // 미리보기 스테이트
  const [previewImage, setPreviewImage] = useState("/meetup_default_image.jpg");

  // 셀렉트 배열
  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // useMutation은 최상단에 위치시키라고 함
  const createMutation = useMutation({
    mutationFn: (meetupFormData: FormData) => createMeetupApi(meetupFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      router.push("/");
    },

    onError: error => {
      console.error("모임 생성 오류 발생:", error);
    },
  });

  const handleMeetupFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // ❗️❗️❗️ 이 모든 과정을 제출 전에 실행하고 있고, 하나로 묶어야겠는데?
    // 1. 모든 날짜가 오늘보다 과거인지 유효성 검사
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 2. 필드 이름 케이스별로 가져오기
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

    // 3. 인풋 필드에서 날짜값 가져옴
    // 근데 이거 155번째줄 (현재인지 실행해보고 판단 위)에 있었음
    const startDate = isStartedAtNull ? null : startedAtRef.current?.value || null;
    const endDate = isEndedAtNull ? null : endedAtRef.current?.value || null;
    const adEndDate = adEndedAtRef.current?.value || null;

    // 4. 통과(true)인지 걸리는지(false) 불리언 값 리턴하는 유효성 검사 함수

    const validateDate = (date: string | null, fieldName: string): boolean => {
      // 사용자 입력값 미정이면 true (통과)
      if (!date) {
        console.log("!date일 경우의 date: ", date);
        return true;
      }

      // 사용자 입력 날짜값
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);

      // 사용자 입력 날짜값이 오늘보다 이전이면 false(걸림)
      if (inputDate !== null && inputDate < now) {
        console.log("now값:", now);
        console.log("inputDate값:", inputDate);

        alert(`${getDateFieldName(fieldName)}이 이미 지난 날짜로 설정되었습니다.`);
        return false;
      }

      // 모임 시작날짜와 모임 종료 날짜 비교
      if (endDate !== null && startDate !== null && endDate < startDate) {
        const beforeAfter = endDate < startDate;
        console.log("앞뒤틀리니?", beforeAfter);
        alert("모임 종료일이 시작일보다 빠를 수 없습니다.");
        return false;
      }

      return true;
    };

    // 폼 제출전, 유효성 검사 에함수 실행해보고 통과 못하면 제출 전에 리턴으로 탈출
    // 모임 시작일이 false(걸림)거나, 모임 종료일이 false(걸림)거나 광고 종료일이 false(걸림)이면 멈추고 나와버림
    if (!validateDate(startDate, "startedAt") || !validateDate(endDate, "endedAt") || !validateDate(adEndDate, "adEndedAt")) {
      console.log("유효성 함수 실행은 됨");
      console.log("설정된 모임 시작일, 모임 종료일, 광고 종료일:", startDate, endDate, adEndDate);

      return;
    }

    const newMeetup: NewMeetup = {
      organizer: {
        nickname: organizerNicknameRef.current?.value || "",
        profileImage: organizerProfileImageRef.current?.value || "",
      },
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      place: placeRef.current?.value || "",
      placeDescription: placeDescriptionRef.current?.value || "",
      startedAt: startDate,
      endedAt: endDate,
      adTitle: adTitleRef.current?.value || "",
      adEndedAt: adEndDate,
      isPublic: isPublicRef.current?.checked || false,
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const meetupFormData = new FormData();
    meetupFormData.append("payload", JSON.stringify(newMeetup));

    if (imageRef.current?.files?.[0]) {
      meetupFormData.append("image", imageRef.current.files[0]);
    }

    createMutation.mutate(meetupFormData);
  };

  // 이미지 미리보기 스테이트
  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
    console.log("미리보기 이미지:", previewImage);
  };

  return (
    <>
      <div>
        <form onSubmit={handleMeetupFormSubmit}>
          <div>
            <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} required />

            <LabeledInput id="name" name="name" label="모임 이름(랜덤 생성 버튼 필요)" type="text" ref={nameRef} required />

            <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} disabled={isStartedAtNull} required />
            <LabeledInput
              id="startedAtUndecided"
              name="startedAtUndecided"
              label="미정"
              type="checkbox"
              // １. ref={isStartedAtNullRef}
              //checked={isStartedAtNullRef.current}를 위처럼 수정하고
              //onChage 지우니까 토글만 됨

              // 2.　useRef를 통해 상태를 저장, 리액트의 chekced와 disabled 속성을
              // useRef.current 기준으로 렌더링에 반영

              // checked={isStartedAtNullRef.current}
              // onChange={event => {
              //   isStartedAtNullRef.current = event?.target.checked;
              //   if (startedAtRef.current) {
              //     startedAtRef.current.disabled = event.target.checked;
              //   }
              // }}

              onChange={event => {
                setIsStartedAtNull(event.target.checked);
              }}
            />

            <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} disabled={isEndedAtNull} required />
            <LabeledInput
              id="endedAtUndecided"
              name="endedAtUndecided"
              label="미정"
              type="checkbox"
              onChange={event => {
                setIsEndedAtNull(event.target.checked);
              }}
            />

            <LabeledSelect id="category" name="category" label="모임 지역" options={placeOptions} ref={placeRef} required />
            <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" ref={placeDescriptionRef} required />

            <LabeledInput id="adTitle" name="adTitle" label="광고글 제목" type="text" ref={adTitleRef} required />

            <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} required />
          </div>
          <div>
            <label htmlFor="description">광고글 설명</label>
            <textarea id="description" name="description" defaultValue="" placeholder="멤버 광고글에 보일 설명을 적어주세요." ref={descriptionRef}></textarea>
          </div>

          <div>
            <h4>선택된 이미지</h4>
            <img src={previewImage} alt="previewImage" />
            <LabeledInput
              id="image"
              name="image"
              label="광고글 대표 이미지"
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
              ref={imageRef}
              onChange={handlePreviewImageChange}
              required
            />
          </div>
          <LabeledInput id="isPublic" name="isPublic" label="광고글 공개하기" type="checkbox" ref={isPublicRef} />

          <div>
            <button type="submit">모임 생성하기</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MeetupForm;

// 1. const newMeetup: Meetup 안에 image가 필요해?
// 필요 여부:

// 필요한 경우:
// 만약 서버가 image 필드(이미지의 파일 경로 또는 URL 등)를 기대하고 있다면, newMeetup 객체에 포함되어야 합니다. 예를 들어, 서버가 JSON 데이터를 처리하고 이미지를 별도로 저장하는 경우입니다. 이때 image는 파일의 경로(또는 이름)를 나타낼 수 있습니다.
// 필요하지 않은 경우:
// 서버가 이미지 파일을 multipart/form-data로 처리하고 JSON 데이터에는 이미지 관련 정보가 없거나 필요 없는 경우입니다. 이 경우 image는 newMeetup에 포함될 필요가 없습니다.
// 결론:

// 이미지 파일 자체를 FormData로 전송하고 JSON 데이터에 이미지 관련 정보가 필요 없다면, newMeetup에 image 필드는 필요 없습니다.
// 서버가 이미지를 JSON 데이터로도 받기를 기대한다면 포함해야 합니다.
