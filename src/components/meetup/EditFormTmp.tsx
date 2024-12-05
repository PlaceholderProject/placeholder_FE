"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/Meetup";
import { LabeledInputProps } from "@/types/LabeledInputProps";
import { LabeledSelectProps } from "@/types/LabeledSelectProps";

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(({ id, name, label, type = "text", placeholder, defaultValue, disabled, required, checked, onChange }, ref) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input id={id} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} disabled={disabled} required={required} checked={checked} onChange={onChange} ref={ref} />
  </div>
));

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, defaultValue, required = true }, ref) => (
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

const MeetupEditForm = ({ meetupId }: { meetupId: string }) => {
  const queryClient = useQueryClient();
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [meetupData, setMeetupData] = useState<Meetup | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("/meetup_default_image.jpg");

  const { data, isLoading, isError } = useQuery(
    ["meetup", meetupId],
    async () => {
      const response = await fetch(`${apiUrl}/meetup/${meetupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch meetup details");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        setMeetupData(data);
        if (data.image) {
          setPreviewImage(data.image);
        }
      },
    },
  );

  const editMutation = useMutation(
    async (formData: FormData) => {
      const response = await fetch(`${apiUrl}/meetup/${meetupId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to edit meetup");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["meetups"]);
        alert("Meetup updated successfully!");
      },
    },
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const placeRef = useRef<HTMLSelectElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!meetupData) return;

    const updatedMeetup: Meetup = {
      ...meetupData,
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
    };

    const formData = new FormData();
    formData.append("updatedMeetup", new Blob([JSON.stringify(updatedMeetup)], { type: "application/json" }));

    if (imageRef.current?.files?.[0]) {
      formData.append("image", imageRef.current.files[0]);
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load meetup data</p>;

  return (
    <form onSubmit={handleSubmit}>
      <LabeledInput id="name" name="name" label="모임 이름" type="text" ref={nameRef} defaultValue={meetupData?.name} required />
      <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} defaultValue={meetupData?.category} required />
      <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} defaultValue={meetupData?.startedAt || ""} />
      <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} defaultValue={meetupData?.endedAt || ""} />
      <LabeledSelect id="place" name="place" label="모임 지역" options={placeOptions} ref={placeRef} defaultValue={meetupData?.place} required />
      <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소 설명" type="text" ref={placeDescriptionRef} defaultValue={meetupData?.placeDescription} required />
      <LabeledInput id="adTitle" name="adTitle" label="광고 제목" type="text" ref={adTitleRef} defaultValue={meetupData?.adTitle} required />
      <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} defaultValue={meetupData?.adEndedAt || ""} />
      <label htmlFor="description">광고글 설명</label>
      <textarea id="description" name="description" ref={descriptionRef} defaultValue={meetupData?.description || ""} placeholder="설명을 작성하세요" />
      <LabeledInput id="isPublic" name="isPublic" label="공개 여부" type="checkbox" ref={isPublicRef} defaultChecked={meetupData?.isPublic} />
      <div>
        <h4>선택된 이미지</h4>
        <img src={previewImage} alt="Preview" />
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
  );
};

export default MeetupEditForm;
