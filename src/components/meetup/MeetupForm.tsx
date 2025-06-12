"use client";

import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LabeledInputProps, LabeledSelectProps, NewMeetup } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { createMeetupApi } from "@/services/meetup.service";
import Image from "next/image";

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ id, name, label, type, placeholder, value, defaultValue, disabled, required, checked, onChange, maxLength, className, labelClassName, containerClassName }, ref) => {
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
          />
        </div>
      </>
    );
  },
);

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, required = true, className, labelClassName, containerClassName }, ref) => {
  return (
    <>
      <div className={containerClassName}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        <select id={id} name={name} required={required} ref={ref} className={className}>
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

  const MAX_NAME_LENGTH = 25;
  const MAX_PLACE_LENGTH = 30;
  const MAX_AD_TITLE_LENGTH = 25;
  const MAX_DESCRIPTION_LENGTH = 70;

  // 체크 박스 상태 관리 위한 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  // 제출 로딩상태 관리 스테이트 추가
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 미리보기 스테이트
  const [previewImage, setPreviewImage] = useState("/meetup_default_image.jpg");

  // 셀렉트 배열
  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // useMutation은 최상단에 위치시키라고 함
  const createMutation = useMutation({
    mutationFn: (meetupFormData: FormData) => createMeetupApi(meetupFormData),
    // onSuccess: data => {
    //   console.log("모임 새성 성공:", data);
    //   console.log("쿼리 무효화 시작");
    //   console.log(
    //     "현재 쿼리 키 목록을 직접 뽑아내 보도록 하겠읍낟",
    //     queryClient
    //       .getQueryCache()
    //       .getAll()
    //       .map(query => query.queryKey),
    //   );
    //   queryClient.invalidateQueries({ queryKey: ["meetups"] });
    //   console.log("meetups 쿼리 무효화 햇어");
    //   queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
    //   console.log("headhuntings 쿼리 무효화함");
    //   // 메인 가기
    //   router.push("/");

    //   //지연 후 새로고침
    //   // setTimeout(() => {
    //   //   window.location.reload();
    //   // }, 200);
    // },

    // onError: error => {
    //   console.error("모임 생성 오류 발생:", error.message);
    // },
  });

  // async 함수로 변경함

  const handleMeetupFormSubmit = async (event: React.FormEvent) => {
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
    // 이거 그러면 null로 들어가는건 알겠는데 광고종료날짜가 ""로들어가기도 한다는 것임?
    // 어떤 시점에 어떤 값이지?
    const startDate = isStartedAtNull ? null : startedAtRef.current?.value || null;
    const endDate = isEndedAtNull ? null : endedAtRef.current?.value || null;
    const adEndDate = adEndedAtRef.current?.value || "";

    // 4. 통과(true)인지 걸리는지(false) 불리언 값 리턴하는 유효성 검사 함수

    const createMeetUpValidateDate = (date: string | null, fieldName: string): boolean => {
      // 사용자 입력값 미정이면 true (통과)
      if (!date) {
        return true;
      }

      // 🐡 사용자 입력 날짜값을 위한 파라미터다. 즉 입력값 그자체가 아니라 ref에 연결된 애들을, 함수 실행할 때 (date) 위치에 넣어 실행하게 되고
      // 이렇게 쓴 이유는 started랑 ended랑 adEnded 세 종류에 대해 재사용 대응 가능하게 하려고!
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);

      // 사용자 입력 날짜값이 오늘보다 이전이면 false(걸림)
      if (inputDate !== null && inputDate < now) {
        alert(`${getDateFieldName(fieldName)}은 이미 지난 날짜로 설정할 수 없습니다.`);
        return false;
      }

      // 모임 시작날짜와 모임 종료 날짜 비교
      // 문자열대신 date 객체로 변환해서 ㅂ교하기로 수정
      if (endDate !== null && startDate !== null) {
        const endDateObject = new Date(endDate);
        const startDateObject = new Date(startDate);
        if (endDateObject < startDateObject) {
          console.log("시작일 타입:", typeof startDate);
          console.log("종료일 타입", typeof endDate);
          console.log("시작일 오브젝트 타입", typeof startDateObject);
          alert("모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.");
          return false;
        }
      }

      return true;
    };

    // 폼 제출전, 유효성 검사 에 함수 실행해보고 통과 못하면 제출 전에 리턴으로 탈출
    // 모임 시작일이 false(걸림)거나, 모임 종료일이 false(걸림)거나 광고 종료일이 false(걸림)이면 멈추고 나와버림
    if (!createMeetUpValidateDate(startDate, "startedAt") || !createMeetUpValidateDate(endDate, "endedAt") || !createMeetUpValidateDate(adEndDate, "adEndedAt")) {
      console.log("유효성 함수 실행은 됨");
      console.log("설정된 모임 시작일, 모임 종료일, 광고 종료일:", startDate, endDate, adEndDate);

      // 제출 상태 다시 초기화 추가
      setIsSubmitting(false);
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
      isPublic: !isPublicRef.current?.checked || true,
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
      isLike: false,
      likeCount: 0,
      createdAt: "",
      commentCount: 0,
    };

    console.log("생성할 새모임 데이터:", newMeetup);

    const meetupFormData = new FormData();
    meetupFormData.append("payload", JSON.stringify(newMeetup));

    if (imageRef.current?.files?.[0]) {
      meetupFormData.append("image", imageRef.current.files[0]);
    }

    // createMutation.mutate(meetupFormData);
    // 그냥 뮤테이션 이었는데 이거를 아래처럼 try catch 블록으로 mutateAsync 사용하게 리팩토링

    try {
      await createMutation.mutateAsync(meetupFormData);
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
      alert("모임 생성에 성공했습니다!");
      router.push("/");
    } catch (error: any) {
      console.error("모임 생성 오류 발생:", error?.message || "알 수 없는 오류");
      alert(`모임 생성 중 오류가 발생했습니다: ${error?.message || "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 미리보기 스테이트
  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
    // console.log("미리보기 이미지:", previewImage);
  };

  return (
    <>
      <div className="mx-auto w-[29.2rem] border-[0.1rem] pb-[4rem]">
        <div className="mb-[8rem] grid min-h-screen place-items-center">
          <h1 className="mb-[4rem] mt-[10rem] text-center text-3xl font-semibold">모임 생성하기</h1>
          <form onSubmit={handleMeetupFormSubmit}>
            <h2 className="text-2xl font-semibold text-primary">모임에 대해 알려주세요.</h2>
            <div>
              <LabeledSelect
                id="category"
                name="category"
                label="모임 성격"
                options={categoryOptions}
                ref={categoryRef}
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
                  onChange={event => {
                    setIsEndedAtNull(event.target.checked);
                  }}
                  containerClassName={"flex items-center"}
                  labelClassName={"text-base pl-[0.5rem] pr-[0.5rem] pt-[1rem]"}
                  className={
                    "mt-[1rem] h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
                  }
                />

                <span className="text-sm text-warning">
                  {isStartedAtNull && isEndedAtNull && (
                    <p className="text-sm text-warning">
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
                  required
                  onChange={handleAdTitleLengthChange}
                  maxLength={MAX_AD_TITLE_LENGTH}
                  containerClassName={"my-[0.5rem] flex flex-col items-start"}
                  labelClassName={"font-semibold text-lg my-[0.5rem]"}
                  className={"h-[4rem] w-[29.2rem] items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
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
                  placeholder="만날 곳의 대략적 위치를 작성해주세요. 예) 강남역"
                  ref={placeDescriptionRef}
                  required
                  onChange={handlePlaceLengthChange}
                  maxLength={MAX_PLACE_LENGTH}
                  containerClassName={"flex flex-col my-[0.5rem]"}
                  labelClassName={"mt-[1rem] my-[0.5rem] text-lg font-semibold"}
                  className={"h-[4rem] w-[29.2rem] items-center rounded-[1rem] border-[0.1rem] border-gray-light px-[0.5rem] text-start text-base"}
                />
                <span className="text-sm text-gray-dark">
                  {placeLength <= MAX_PLACE_LENGTH ? placeLength : MAX_PLACE_LENGTH} / {MAX_PLACE_LENGTH} 자
                </span>
                {placeLength >= MAX_PLACE_LENGTH && <p className="text-sm text-warning">모임 장소 설명은 최대 {MAX_PLACE_LENGTH}자까지 입력할 수 있습니다.</p>}
              </div>
              <LabeledSelect
                id="category"
                name="category"
                label="모임 지역"
                options={placeOptions}
                ref={placeRef}
                required
                containerClassName={"flex my-[1rem] items-center"}
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
                defaultValue=""
                placeholder="멤버 광고글에 보일 설명을 작성해주세요."
                ref={descriptionRef}
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
                accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
                ref={imageRef}
                onChange={handlePreviewImageChange}
                required
                containerClassName="hidden"
                labelClassName="hidden"
                className="hidden"
              />

              {/* 커스텀 버튼 */}
              <div className="flex-cols-2 flex items-center justify-between text-center">
                <label className="my-[0.5rem] text-lg font-semibold">대표 이미지</label>
                <label htmlFor="image" className="h-[2.2rem] w-[8rem] cursor-pointer items-center rounded-[1rem] bg-gray-medium py-[0.2rem] text-sm">
                  파일 선택
                </label>
              </div>

              <div className="relative flex h-[14.5rem] w-[29.2rem] items-center justify-center overflow-hidden rounded-[1rem] border-[0.1rem] border-gray-light">
                <Image src={previewImage} alt="preview image" fill style={{ objectFit: "cover" }} className="rounded-[1rem]" />
              </div>
            </div>

            <LabeledInput
              id="isPublic"
              name="isPublic"
              label="모집글 비공개"
              type="checkbox"
              ref={isPublicRef}
              containerClassName={"flex items-center my-[3rem]"}
              labelClassName={"text-2xl text-primary items-baseline font-semibold pl-[0.5rem] pr-[0.5rem]"}
              className={
                "h-[1.5rem] w-[1.5rem] appearance-none rounded-[0.2rem] border-[0.2rem] border-[#013A4B] checked:border-primary checked:bg-primary checked:after:flex checked:after:h-full checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-['✓']"
              }
            />

            <div className="mt-[3rem] flex justify-center">
              <button type="submit" className="text-bold h-[4rem] w-[14rem] items-center rounded-[1rem] bg-primary text-center text-lg text-white">
                모임 등록
              </button>
            </div>
          </form>
        </div>
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
