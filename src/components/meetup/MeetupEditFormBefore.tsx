"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { LabeledInputProps } from "@/types/meetupType";
import { LabeledSelectProps } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/baseURL";
import { editMeetupApi, getMeetupByIdApi } from "@/services/meetup.service";

const token = process.env.NEXT_PUBLIC_MY_TOKEN;

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

const MeetupEditFormBefore = ({ meetupId }: { meetupId: number }) => {
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

  // 🍰🍰🍰🍰🍰🍰🍰🍰 useEffect를 시작, 종료 날짜 미정 체크에 또 써야 하는데 🍰🍰🍰🍰🍰🍰
  // 🍰🍰🍰🍰🍰🍰🍰 이거 나중에 커스텀훅으로 묶을까? 🍰🍰🍰🍰🍰🍰

  // 체크 박스 상태 관리 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  const router = useRouter();
  // const [previewImage, setPreviewImage] = useState<string | null>("image:/media/meetup_images/pv_test.JPG");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useQuery<Meetup, Error>({
    queryKey: ["meetup", meetupId],
    queryFn: () => getMeetupByIdApi(meetupId),

    // 💞 onSuccess는 queryFn인 metMeetupById가 데이터 반환에 성공했을 때 호출됨
    // 💞 queryFn에서 반환한 데이터를 onSuccess의 매개변수로 전달
    // 💞 즉 data는 getMeetupById의 반환값인 meetupByIdData

    // onSuccess: (meetupByIdData: Meetup) => {
    //   // 💞 여기서 meetupByIdData를 매개면수로 받고 있으므로 이걸 써야돼

    //   if (meetupByIdData.image) {
    //     // console.log(`이전 미리보기 url: http://localhost:8000/api/v1${data.image}`);

    //     // setPreviewImage(`http://localhost:8000${previousMeetupData.image}`);
    //     setPreviewImage(`http://localhost:8000${meetupByIdData.image}`);
    //   }
    // },

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
    previousMeetupData?.startedAt === null ? setIsStartedAtNull(true) : setIsStartedAtNull(false);
    previousMeetupData?.endedAt === null ? setIsEndedAtNull(true) : setIsEndedAtNull(false);
  }, [previousMeetupData]);

  // 수정 api
  // const editMeetupApi = async (formData: FormData): Promise<void> => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
  //     method: "PUT",
  //     headers: { Authorization: `Bearer ${token}` },
  //     body: formData,
  //   });
  //   if (!response.ok) {
  //     throw new Error("모임 수정 실패");
  //   }

  //   // 🚨🚨🚨🚨🚨서버 응답 형태 확인용 지금 date랑 checkbox 인풋만 수정이 안되거든요🚨🚨🚨🚨🚨

  //   const responseData = await response.json();
  //   console.log("서버 응답:", responseData);
  //   return responseData;
  // };

  //수정 뮤테이션
  // 근데 뮤테이션은 최상단에 위치시키라고 했던거같은데
  const editMutation = useMutation<void, Error, FormData>({
    mutationFn: formData => editMeetupApi(meetupId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      // queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
      alert("onSuccess invalidate 모임 정보 수정 성공!");
      router.push("/");
    },
  });

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // 수정 제출 함수
  const handleEditFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!previousMeetupData) return;

    // 오늘 날짜
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const startDate = isStartedAtNull ? null : startedAtRef?.current?.value || null;
    const endDate = isEndedAtNull ? null : endedAtRef?.current?.value || null;
    const adEndDate = adEndedAtRef.current?.value || null;

    // 필드 이름
    const getDateFieldName = (fieldName: string): string => {
      switch (fieldName) {
        case "startedAT":
          return "모임 시작일";
        case "endedAt":
          return "모임 종료일";
        case "adEndedAt":
          return "광고 종료일";
        default:
          return fieldName;
      }
    };

    // 🐣 유효성 함수 시작
    const editMeetupValidateDate = (date: string | null, fieldName: string): boolean => {

      // 변수를 상단에서 선언해서 좀 자유롭게 쓰려고 헌다...
     let previousStartDate: Date | null = null;
     let previousEndDate: Date | null = null;
     
     if (previousMeetupData?.startedAt) {
      previousStartDate = new Date(previousMeetupData.startedAt);
      previousStartDate.setHours(0, 0, 0, 0);

    
     if (previousMeetupData?.endedAt) {
      previousEndDate = new Date(previousMeetupData.endedAt);
      previousEndDate.setHours(0, 0, 0, 0);

      if (!date) {
        return true;
      }

      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);

      // 미정이 아닐 경우에만 new Date 호출한다고 둘 다 null 체크
      // 오늘 기준으로 본 모임 시작일
      
        // 이미 시작 => 시작일 수정 X
        if (previousStartDate && previousStartDate < now) {
          alert("이미 시작된 모임의 모임 시작일을 수정할 수 없습니다.");
          return false;
        } else if (previousStartDate && inputDate < now) {
            alert("모임 시작일은 오늘보다 이전으로 설정할 수 없습니다.");
            return false;
          }

      // 오늘 기준으로 본 모임 종료일

        // 이미 종료 => 오늘보다 더 이르게 종료일 수정 X
        if (previousEndDate && previousEndDate < now && inputDate < now) {
          alert("이미 종료된 모임의 모임 종료일을 지나간 날짜로 수정할 수 없습니다.");
          return false;
        

        // if (previousStartDate !== null && new Date(previousStartDate) < now && new Date(inputDate) < new Date(previousStartDate)) {
        //   alert(`이미 시작된 모임의 ${getDateFieldName(fieldName)}을 이전으로 수정할 수 없습니다.`);

        //   return false;
        // }
      }

      // 여기서는 모임종료일과 광고종료일만 오늘 이후로!
      if (inputDate !== null && inputDate < now) {
        alert(`${getDateFieldName(fieldName)}이 이미 지난 날짜로 설정되었습니다.`);
        return false;
      }
      // 기존 설정 시작일이 오늘보다 이전이면 수정 불가능
      // 기존 설정 시작일이 오늘보다 이후면 수정 가능
      //새로 입력한 모임시작일이 기존 설정일보다 이전일 수 없음

      if (endDate !== null && startDate !== null && endDate < startDate) {
        const beforeAfter = endDate < startDate;
        console.log("앞뒤틀리니?", beforeAfter);
        alert("모임 종료일이 시작일보다 빠를 수 없습니다.");
        return false;
      }

      return true;
    };

    if (!editMeetupValidateDate(endDate, "endedAt") || !editMeetupValidateDate(adEndDate, "adEndedAt")) {
      console.log("유효성 함수 실행됨");
      console.log("시작일, 종료일, 광고종료일:", startDate, endDate, adEndDate);
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
      adEndedAt: adEndedAtRef.current?.value || null,
      // 수정전: isPublic: isPublicRef.current?.checked || false,
      isPublic: isPublicRef.current?.checked, //이래도 안됨
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const formData = new FormData();

    formData.append("payload", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      formData.append("image", file);
    }

    const payload = formData.get("payload");
    console.log("서버로 전송되는 수정된 모임 데이터:", JSON.stringify(payload as string));
    editMutation.mutate(formData);
  };

  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
  };

  if (isPending) return <p>Pending...</p>;
  if (isError) return <p>모임 데이터 로드 error남</p>;

  // console.log("🔮🔮🔮🔮🔮🔮  성공한 미리보기 previousMeetupData.image 스트링🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮 : ", previousMeetupData.image);
  return (
    <>
      {/* // <img src={`http://localhost:8000${previousMeetupData.image}`} alt="성공한 테스트" />
      // <p>성공한 이미지는 위에⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ 뜰 것입니다</p>
      // <img src={`http://localhost:8000meetup_images/pv_test.JPG`} alt="⬅️ 경로 테스트 실패한 이미지태그" /> */}

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
        <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} defaultValue={previousMeetupData?.adEndedAt?.substring(0, 10)} />
        <label htmlFor="description">광고글 설명</label>
        <textarea id="description" name="description" ref={descriptionRef} defaultValue={previousMeetupData?.description || ""} placeholder="설명을 작성하세요" />
        <LabeledInput id="isPublic" name="isPublic" label="공개 여부" type="checkbox" ref={isPublicRef} defaultChecked={previousMeetupData?.isPublic} />
        <div>
          {/* <h3>선택된 이미지</h3>
          <img src={`http://localhost:8000${previousMeetupData.image}`} alt="Preview" />
          🍓🍓🍓🍓🍓🍓🍓🍓🍓이렇게 그냥 갖다 쓰니까 미리보기 된다고?🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓 */}
          {previewImage ? <img src={previewImage} alt="미리보기 대체 텍스트" /> : <p>미리보기 이미지 없다</p>}
          {/* 🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️이거는 지금 소스 경로를 previewImage로 설정해놨고 아마 setPreviewImage가 다시 안 쓰여서 기본값 null로 뜬거같다.🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️ */}
          <LabeledInput
            id="image"
            name="image"
            label="광고글 대표 이미지"
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
            ref={imageRef}
            onChange={handlePreviewImageChange}
          />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </>
  );
}

export default MeetupEditFormBefore
