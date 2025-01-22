"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { LabeledInputProps } from "@/types/meetupType";
import { LabeledSelectProps } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { getMeetupByIdApi } from "@/services/meetup.service";

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

  const router = useRouter();
  // const [previewImage, setPreviewImage] = useState<string | null>("image:/media/meetup_images/pv_test.JPG");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // id 해당 모임 데이터 가져오는데
  // 미리 보기의 default값이 이미 들어가있어야 된다.
  // setPreviewImage는 최상단에 있는데
  // 미리 보기 설정 로직은 아래에 있다.

  // // id 해당 모임 get 함수
  // const getMeetupById = async () => {
  //   const response = await fetch(`http://localhost:8000/api/v1/meetup/${meetupId}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     console.error("가져오기 실패: ", response.status, response.statusText);
  //     throw new Error("해당 id 모임 가져오기 실패");
  //   }

  //   const meetupByIdData = await response.json();
  //   // console.log("json()하지 않은 해당 id 모임: ", response);
  //   // console.log("가져온 해당 id 모임:", meetupByIdData.json());
  //   // 아니 왜 콘솔에 .json() 넣으면 브라우저 에러 나는 것?
  //   // 안 그러다기???????????????

  //   // // 🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠 이거 되는거야 마는거야 🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠 아마 안됨
  //   setPreviewImage(`${meetupByIdData.image}`);

  //   console.log("가져온 데이터: ", meetupByIdData);
  //   console.log("meetupId 타입 뭐야?", typeof meetupByIdData.id);

  //   return meetupByIdData;
  // };

  //id 해당 모임 가져오기 탠스택
  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useQuery<Meetup, Error>({
    queryKey: ["meetup", meetupId],
    queryFn: () => getMeetupByIdApi(meetupId),

    // 💞 onSuccess는 queryFn인 getMeetupById가 데이터 반환에 성공했을 때 호출됨
    // 💞 queryFn에서 반환한 데이터를 onSuccess의 매개변수로 전달
    // 💞 즉 data는 getMeetupById의 반환값인 meetupByIdData

    onSuccess: (meetupByIdData: Meetup) => {
      if (meetupByIdData.image) {
        // console.log(`이전 미리보기 url: http://localhost:8000/api/v1${data.image}`);
        // setPreviewImage(`http://localhost:8000${meetupByIdData.image}`);
        // 💞 원래는
        setPreviewImage(`http://localhost:8000${previousMeetupData.image}`);
        // 였다
      }
    },

    retry: 0,
  });

  //수정 뮤테이션
  const editMutation = useMutation<void, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`http://localhost:8000/api/v1/meetup/${meetupId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("모임 수정 실패");
      }

      alert("모임 정보 수정 성공!");
      router.push("/");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      alert("모임 정보 수정 성공!");
      router.push("/");
    },
  });

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  const handleEditFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!previousMeetupData) return;

    const editedMeetup: Meetup = {
      ...previousMeetupData,
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      place: placeRef.current?.value || "",
      placeDescription: placeDescriptionRef.current?.value || "",
      startedAt: startedAtRef.current?.value || null,
      endedAt: endedAtRef.current?.value || null,
      adTitle: adTitleRef.current?.value || "",
      adEndedAt: adEndedAtRef.current?.value || null,
      isPublic: isPublicRef.current?.checked || false,
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const formData = new FormData();

    formData.append("editedMeetup", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      formData.append("iamge", file);
    }

    editMutation.mutate(formData);
  };

  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
  };

  // 이전 코드에서는 디폴트 이미지로 설정돼이썽ㅆ음
  // 근데 그 디폴트 부분을 데이터 통신으로 가져온 후에야 setPreviewImage로 설정가능하게 되어서
  // 절차 하나가 들어가ㅑㅇ 함
  //

  if (isPending) return <p>Pending...</p>;
  if (isError) return <p>모임 데이터 로드 error남</p>;

  console.log("🔮🔮🔮🔮🔮🔮  성공한 미리보기 previousMeetupData.image 스트링🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮 : ", previousMeetupData.image);
  return (
    <>
      <img src={`http://localhost:8000${previousMeetupData.image}`} alt="성공한 테스트" />
      <p>성공한 이미지는 위에⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ 뜰 것입니다</p>
      <img src={`http://localhost:8000meetup_images/pv_test.JPG`} alt="⬅️ 경로 테스트 실패한 이미지태그" />
      <form onSubmit={handleEditFormSubmit}>
        <LabeledInput id="name" name="name" label="모임 이름" type="text" ref={nameRef} defaultValue={previousMeetupData?.name} required />
        <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} defaultValue={previousMeetupData?.category} required />
        <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} defaultValue={previousMeetupData?.startedAt?.substring(0, 10)} />
        <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} defaultValue={previousMeetupData?.endedAt?.substring(0, 10)} />
        <LabeledSelect id="place" name="place" label="모임 지역" options={placeOptions} ref={placeRef} defaultValue={previousMeetupData?.place} required />
        <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소 설명" type="text" ref={placeDescriptionRef} defaultValue={previousMeetupData?.placeDescription} required />
        <LabeledInput id="adTitle" name="adTitle" label="광고 제목" type="text" ref={adTitleRef} defaultValue={previousMeetupData?.adTitle} required />
        <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} defaultValue={previousMeetupData?.adEndedAt?.substring(0, 10)} />
        <label htmlFor="description">광고글 설명</label>
        <textarea id="description" name="description" ref={descriptionRef} defaultValue={previousMeetupData?.description || ""} placeholder="설명을 작성하세요" />
        <LabeledInput id="isPublic" name="isPublic" label="공개 여부" type="checkbox" ref={isPublicRef} defaultChecked={previousMeetupData?.isPublic} />
        <div>
          <h3>선택된 이미지</h3>
          {/* 선택된 이미지 기본값 뭘로 고치지*/}
          <img src={`http://localhost:8000${previousMeetupData.image}`} alt="Preview" />
          🍓🍓🍓🍓🍓🍓🍓🍓🍓이렇게 그냥 갖다 쓰니까 미리보기 된다고?🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓
          {previewImage ? <img src={previewImage} alt="두번째 미리보기 텍스트" /> : <p>미리보기 이미지 없다</p>}
          🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️이거는 지금 소스 경로를 previewImage로 설정해놨고 아마 setPreviewImage가 다시 안 쓰여서 기본값 null로 뜬거같다.🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️
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
};

export default MeetupEditForm;
