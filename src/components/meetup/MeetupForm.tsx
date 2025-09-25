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
import { useRenderCount } from "@/hooks/useRenderCount";

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
}

const MeetupForm = ({ mode, meetupId }: MeetupFormProps) => {
  useRenderCount("MeetupForm");
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

  // 폼 로직 훅
  const { formStates, handlers, validateDates } = useMeetupForm(mode, previousMeetupData);
  const { isSubmitting, setIsSubmitting, nameLength, placeLength, adTitleLength, descriptionLength, isStartedAtNull, setIsStartedAtNull, isEndedAtNull, setIsEndedAtNull, previewImage } = formStates;
  const { handleNameLengthChange, handlePlaceLengthChange, handleAdTitleLengthChange, handleDescriptionLengthChange, handlePreviewImageChange } = handlers;

  // Ref (컴포넌트 자체에서 관리)
  const organizerNicknameRef = useRef<HTMLInputElement>(null); // ✨이게 MeetupEditForm에는 없음
  const organizerProfileImageRef = useRef<HTMLInputElement>(null); // ✨이게 MeetupEditForm에는 없음
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

  console.log("108번째줄 nameRef", nameRef);

  // 제출 상태 로컬 관리
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // 2️⃣ s3에 직접 이미지 업로드 함수
  // const meetupUploadToS3 = async (file: File, meetupPresignedData: S3PresignedItem) => {
  //   const formData = new FormData();
  //   Object.keys(meetupPresignedData.fields).forEach(key => {
  //     const typedKey = key as keyof S3PresignedField;
  //     formData.append(key, meetupPresignedData.fields[typedKey]);
  //   });

  //   formData.append("file", file);

  //   try {
  //     const response = await fetch(meetupPresignedData.url, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("S3 오류 내용:", errorText);
  //       throw new Error(`s3 업로드 실패:, ${response.status} ${errorText}`);
  //     }
  //     // 업로드된 파일의 URL 생성
  //     const uploadedFileUrl = `${meetupPresignedData.url}${meetupPresignedData.fields.key}`;
  //     console.log("업로드 성공 URL", uploadedFileUrl);
  //     return uploadedFileUrl;
  //   } catch (error) {
  //     console.error("💥 업로드 중 오류:", error);
  //     throw error;
  //   }
  // };

  // 글자수 관리 위한 스테이트
  // const [nameLength, setNameLength] = useState(0);
  // const [placeLength, setPlaceLength] = useState(0);
  // const [adTitleLength, setAdTitleLength] = useState(0);
  // const [descriptionLength, setDescriptionLength] = useState(0);
  // const handleNameLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNameLength(event.target.value.length);
  // };
  // const handlePlaceLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPlaceLength(event.target.value.length);
  // };
  // const handleAdTitleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAdTitleLength(event.target.value.length);
  // };
  // const handleDescriptionLengthChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setDescriptionLength(event.target.value.length);
  // };

  // 체크 박스 상태 관리 위한 스테이트
  // const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  // const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  // 미리보기 스테이트
  // const [previewImage, setPreviewImage] = useState("/meetup_default_image.png");

  // 셀렉트 옵션 배열
  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // 미리보기 이미지, 미정 여부 설정
  //  ✨이게 MeetupForm에는 없음

  useEffect(() => {
    if (mode === "edit" && previousMeetupData) {
      // if (previousMeetupData?.image) {
      //   const previewImageUrl = `${previousMeetupData.image}`;
      //   console.log("미리보기 설정되는 이미지 URL: ", previewImageUrl);
      // }

      setIsStartedAtNull(previousMeetupData.startedAt === null);
      setIsEndedAtNull(previousMeetupData.endedAt === null);
    }
  }, [mode, previousMeetupData, setIsStartedAtNull, setIsEndedAtNull]);

  // 생성 useMutation은 최상단에 위치시키라고 함
  //  ✨이게 MeetupEditForm에는 없음
  // const createMutation = useMutation({
  //   mutationFn: ({ meetupData, imageUrl }: { meetupData: NewMeetup; imageUrl: string }) => createMeetupApi(meetupData, imageUrl),
  // });

  // 미리보기 이미지 변경 핸들 함수
  // const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const previewFile = event.target.files[0];
  //     const previewFileUrl = URL.createObjectURL(previewFile);
  //     setPreviewImage(previewFileUrl);
  //   }
  // };

  // async 함수로 변경한 모임 생성 제출 함수
  const handleMeetupFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    // 모든 날짜가 오늘보다 과거인지 유효성 검사
    // const now = new Date();
    // now.setHours(0, 0, 0, 0);

    // 필드 이름 케이스별로 가져오기
    // const getDateFieldName = (fieldName: string): string => {
    //   switch (fieldName) {
    //     case "startedAt":
    //       return "모임 시작일";
    //     case "endedAt":
    //       return "모임 종료일";
    //     case "adEndedAt":
    //       return "광고 종료일";
    //     default:
    //       return fieldName;
    //   }
    // };

    // 통과(true)인지 걸리는지(false) 불리언 값 리턴하는 유효성 검사 함수
    // 날짜와 필드네임을 받는데
    // 그게 엄청 아래에서 실제 실행될 때 값으로 들어옴
    // const createMeetUpValidateDate = (date: string | null, fieldName: string): boolean => {
    //   // 사용자 입력값 미정이면 true (통과)
    //   if (!date) {
    //     return true;
    //   }

    //   const inputDate = new Date(date);
    //   inputDate.setHours(0, 0, 0, 0);

    //   // 사용자 입력 날짜값이 오늘보다 이전이면 false(걸림)
    //   // if (inputDate !== null && inputDate < now) {
    //   //   alert(`${getDateFieldName(fieldName)}은 이미 지난 날짜로 설정할 수 없습니다.`);
    //   //   return false;
    //   // }

    //   // 모임 시작날짜와 모임 종료 날짜 비교
    //   if (endDate !== null && startDate !== null) {
    //     const endDateObject = new Date(endDate);
    //     const startDateObject = new Date(startDate);
    //     if (endDateObject < startDateObject) {
    //       console.log("시작일 타입:", typeof startDate);
    //       console.log("종료일 타입", typeof endDate);
    //       console.log("시작일 오브젝트 타입", typeof startDateObject);
    //       alert("모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.");
    //       return false;
    //     }
    //   }

    //   return true;
    // };

    // 폼 제출전, 유효성 검사 에 함수 실행해보고 통과 못하면 제출 전에 리턴으로 탈출
    // if (!createMeetUpValidateDate(startDate, "startedAt") || !createMeetUpValidateDate(endDate, "endedAt") || !createMeetUpValidateDate(adEndDate, "adEndedAt")) {
    //   console.log("유효성 함수 실행은 됨");
    //   console.log("설정된 모임 시작일, 모임 종료일, 광고 종료일:", startDate, endDate, adEndDate);
    //   return;
    // }

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
      console.log("----1111이미지패스 찍자", imageUrl);
      // ---1--- 이미지 있으면 (s3에 업로드)
      if (imageRef?.current?.files?.[0]) {
        const imageFile = imageRef.current.files[0]; //
        // const fileType = typeof(imageFile).toString()
        //위처럼 이렇게 쓰면 오브젝트 반환함 (File 객체니까sssss)

        // ✅ 파일 타입 정확히 가져오기
        const fileType = imageFile.type as FileType;
        // console.log("🎯 파일 타입 확인:", fileType);

        // presigned URL 요청
        // const presignedResponse: S3PresignedResponse = await getMeetupPresignedUrl(fileType);
        // const presignedData: S3PresignedItem = presignedResponse.result[0];

        const presignedResponse = await getPresignedUrl.mutateAsync(fileType);
        const presignedData = presignedResponse.result[0];

        // presigned 데이터의 Content-Type 확인
        // console.log("🎯 presigned Content-Type:", presignedData.fields["Content-Type"]);
        // s3업로드 함수 실행으로 업로드 하고 imageUrl 받아오기
        imageUrl = await s3Upload.mutateAsync({ file: imageFile, presignedData });
        console.log("----222이미지패스 찍자", imageUrl);
      }

      if (mode === "create") {
        // ---2--- 모임 데이터 생성 (폼데이터X)
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
          // image: imageRef.current?.value || "",
          isLike: false,
          likeCount: 0,
          createdAt: "",
          commentCount: 0,
        };
        // ---3--- 모임 생성 (이미 업로드되고 받아온 이미지 url포함, 이건 유저 폼제출 이!!후!!에 유저 모르게 일어나는 과정임)

        await createMutation.mutateAsync({ data: newMeetup, imageUrl });
        console.log("----1111 생성이미지패스 찍자", imageUrl);

        toast.success("모임 생성에 성공했습니다!");
        console.log("생성할 새모임 데이터:", newMeetup);
        // queryClient.invalidateQueries({ queryKey: ["meetups"] });
        // queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
      } else {
        if (!previousMeetupData) return;
        const editedMeetup: Meetup = {
          ...previousMeetupData,
          name: nameRef.current?.value || "",
          description: descriptionRef.current?.value || "",
          place: placeRef.current?.value || "",
          placeDescription: placeDescriptionRef.current?.value || "",
          // startedAt: isStartedAtNull ? null : startedAtRef.current?.value || null,
          startedAt: startDate,
          endedAt: endDate,
          // endedAt: isEndedAtNull ? null : endedAtRef.current?.value || null,
          adTitle: adTitleRef.current?.value || "",
          // adEndedAt: adEndedAtRef.current?.value || "",
          adEndedAt: adEndDate,
          isPublic: !isPublicRef.current?.checked,
          category: categoryRef.current?.value || "",
          // image: imageRef.current?.value || "",
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

    // const meetupFormData = new FormData();
    // meetupFormData.append("payload", JSON.stringify(newMeetup));

    // if (imageRef.current?.files?.[0]) {
    //   meetupFormData.append("image", imageRef.current.files[0]);
    // }

    // try {
    //   await createMutation.mutateAsync({ meetupData: newMeetup, imageUrl: imageUrl });
    //   queryClient.invalidateQueries({ queryKey: ["meetups"] });
    //   queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
    //   alert("모임 생성에 성공했습니다!");
    //   router.push("/");
    // } catch (error) {
    //   console.error(error);
    // }
  };

  // 로딩 상태 처리
  if (mode === "edit" && isPending) return <p>로딩 중...</p>;
  if (mode === "edit" && isError) return <p>모임 데이터 로드 에러 발생</p>;

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}
      <div className="mx-auto my-[5rem] w-[32rem] rounded-[1rem] border-[0.1rem] border-gray-medium p-[3rem] md:w-full md:max-w-[100rem]">
        <div className="place-items-center">
          <h1 className="text-center text-3xl font-semibold">{mode === "create" ? "모임 생성하기" : "모임 수정하기"}</h1>
          <p className="font-sm mb-[4rem] text-warning">모든 폼은 필수 입력 사항입니다.</p>
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
                    // defaultChecked={mode === "edit" ? previousMeetupData.isStartedAtNull : false}
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
                    // defaultChecked={mode === "edit" ? previousMeetupData.isEndedAtNull : false}
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

                  {/* 커스텀 버튼 */}
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
                      fill={previewImage !== "/meetup_default_image.png"} // 업로드된 이미지일 때만 fill
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
