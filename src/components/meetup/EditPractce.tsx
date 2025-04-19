"use client";

import { LabeledInputProps, LabeledSelectProps, Meetup } from "@/types/meetupType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

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

const EditPractice = ({ meetupId }: { meetupId: number }) => {
  const queryClient = useQueryClient();
  const nameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>();

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getMeetupById = async () => {
    const response = await fetch(`http://localhost:8000/api/v1/meetup/${meetupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // console.log("가져오기 실패 :", response.status, response.statusText);
      throw new Error("해당 id 모임 가져오기 실패");
    }

    const meetupByIdData = await response.json();

    setPreviewImage(`${meetupByIdData.image}`);
    // console.log(meetupByIdData.image);

    return meetupByIdData;
  };

  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useQuery<Meetup, Error>({
    queryKey: ["meetup", meetupId],
    queryFn: getMeetupById,
    onSuccess: (meetupById: Meetup) => {
      setPreviewImage(`http://localhost:8000${meetupByIdData.image}`);
      setPreviewImage(`http://localhost:8000${previousMeetupData.image}`);
    },
    retry: 0,
  });

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
      alert("mutationFn 모임 수정 성공!");
      router.push("/");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      alert("onSuccess 모임 수정 성공");
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
      adEndedAt: adEndedAtRef.current?.value || "",

      isPublic: isPublicRef.current?.checked || false,
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const formData = new FormData();

    formData.append("editedMeetup", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      formData.append("image", file);
    }

    editMutation.mutate(formData);
  };

  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
  };

  if (isPending) return <p>Pending...</p>;
  if (isError) return <p>모임 데이터 로드 Error</p>;

  return (
    <>
      <div>
        <form onSubmit={handleEditFormSubmit}>
          <LabeledInput id="name" name="name" label="모임 이름" type="text" ref={nameRef} defaultValue={previousMeetupData.name} required />
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
            <img src={`http://localhost:8000${previousMeetupData.image}`} alt="두번째 미리보기 텍스트" /> : <p>미리보기 이미지 없다</p>}
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
      </div>
    </>
  );
};

export default EditPractice
