"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/Meetup";
import { LabeledInputProps } from "@/types/LabeledInputProps";
import { LabeledSelectProps } from "@/types/LabeledSelectProps";

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(({ id, name, label, type = "text", placeholder, disabled, required, checked, onChange }, ref) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={name} type={type} placeholder={placeholder} disabled={disabled} required={required} checked={checked} onChange={onChange} ref={ref} />
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

const MeetupEditForm = ({ meetupId }: { meetupId: string }) => {
  const queryClient = useQueryClient();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyNzc4Mzk3LCJpYXQiOjE3MzI3Nzc2NzgsImp0aSI6ImM2YzY1NDAyMmMyNDQ1NDU5NjE3YmVkMTMyNTU1NGM5IiwidXNlcl9pZCI6Mn0.gi9APOp-RGyhEooUXWjZhhWeqbP07iWaWzUU0aCBGmE";

  const [meetupData, setMeetupData] = useState<Meetup | null>(null);
  //왜 초기값이 null인지 갑자기 이해 안된다

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

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // meetup 디테일 fetch
  const {
    data: meetupDetails,
    isPending,
    isError,
  } = useQuery<Meetup>(
    ["meetup", meetupId], // queryKey
    async () => {
      const response = await fetch(`http://localhost:8000/api/v1/meetup/${meetupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("모임 디테일 가져오기 실패");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        setMeetupData(data);
      },
    },
  );

  // 모임 수정
  const editMeetup = async (editedMeetup: { id: string }) => {
    const response = await fetch(`http://localhost:8000/api/v1/meetup/${editedMeetup.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedMeetup),
    });
    if (!response.ok) {
      throw new Error("모임 수정 실패");
    }
  };

  const editMutation = useMutation<void, Error, Meetup>({
    mutationFn: editMeetup,
    onSuccess: () => {
      queryClient.invalidateQueries(["meetups"]);
    },
  });

  const handleMeetupEditFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!meetupData) return;

    const editedMeetup: Meetup = {
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
    editMutation.mutate(editedMeetup);
  };

  useEffect(() => {
    if (meetupDetails) {
      setMeetupData(meetupDetails);
    }
  }, [meetupDetails]);

  if (isPending) {
    return <p>Pending...</p>;
  }

  if (isError) {
    return <p>meetup details fetching Error</p>;
  }
  return (
    <form onSubmit={handleMeetupEditFormSubmit}>
      <LabeledInput id="name" name="name" label="모임 이름" type="text" ref={nameRef} defaultValue={meetupData?.name} required />
      <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} defaultValue={meetupData?.category} required />
      <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} defaultValue={meetupData?.startedAt || ""} />
      <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} defaultValue={meetupData?.endedAt || ""} />
      <LabeledSelect id="place" name="place" label="모임 지역" options={placeOptions} ref={placeRef} defaultValue={meetupData?.place} required />
      <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소 설명" type="text" ref={placeDescriptionRef} defaultValue={meetupData?.placeDescription} required />
      <LabeledInput id="adTitle" name="adTitle" label="광고글 제목" type="text" ref={adTitleRef} defaultValue={meetupData?.adTitle} required />
      <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} defaultValue={meetupData?.adEndedAt || ""} />
      <label htmlFor="description">광고글 설명</label>
      <textarea id="description" name="description" ref={descriptionRef} defaultValue={meetupData?.description || ""} placeholder="설명을 작성하세요" />
      <LabeledInput id="isPublic" name="isPublic" label="공개 여부" type="checkbox" ref={isPublicRef} defaultChecked={meetupData?.isPublic} />
      <button type="submit">수정 완료</button>
    </form>

    // <div>
    // <form onSubmit={handleMeetupFormSubmit}>
    //   <div>
    //     <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} required />

    //     <LabeledInput id="name" name="name" label="모임 이름(랜덤 생성 버튼 필요)" type="text" ref={nameRef} required />

    //     <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} disabled={isStartedAtNull} required />
    //     <LabeledInput
    //       id="startedAtUndecided"
    //       name="startedAtUndecided"
    //       label="미정"
    //       type="checkbox"
    //       // １. ref={isStartedAtNullRef}
    //       //checked={isStartedAtNullRef.current}를 위처럼 수정하고
    //       //onChage 지우니까 토글만 됨

    //       // 2.　useRef를 통해 상태를 저장, 리액트의 chekced와 disabled 속성을
    //       // useRef.current 기준으로 렌더링에 반영

    //       // checked={isStartedAtNullRef.current}
    //       // onChange={event => {
    //       //   isStartedAtNullRef.current = event?.target.checked;
    //       //   if (startedAtRef.current) {
    //       //     startedAtRef.current.disabled = event.target.checked;
    //       //   }
    //       // }}

    //       onChange={event => {
    //         setIsStartedAtNull(event.target.checked);
    //       }}
    //     />

    //     <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} disabled={isEndedAtNull} required />
    //     <LabeledInput
    //       id="endedAtUndecided"
    //       name="endedAtUndecided"
    //       label="미정"
    //       type="checkbox"
    //       onChange={event => {
    //         setIsEndedAtNull(event.target.checked);
    //       }}
    //     />

    //     <LabeledSelect id="category" name="category" label="모임 지역" options={placeOptions} ref={placeRef} required />
    //     <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" ref={placeDescriptionRef} required />

    //     <LabeledInput id="adTitle" name="adTitle" label="광고글 제목" type="text" ref={adTitleRef} required />

    //     <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} required />
    //   </div>
    //   <div>
    //     <label htmlFor="description">광고글 설명</label>
    //     <textarea id="description" name="description" defaultValue="" placeholder="멤버 광고글에 보일 설명을 적어주세요." ref={descriptionRef}></textarea>
    //   </div>

    //   <div>
    //     <h4>선택된 이미지</h4>
    //     <img src={previewImage} alt="previewImage" />
    //     <LabeledInput
    //       id="image"
    //       name="image"
    //       label="광고글 대표 이미지"
    //       type="file"
    //       accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
    //       ref={imageRef}
    //       onChange={handlePreviewImageChange}
    //       required
    //     />
    //   </div>
    //   <LabeledInput id="isPublic" name="isPublic" label="광고글 공개하기" type="checkbox" ref={isPublicRef} />

    //   <div>
    //     <button type="submit">모임 생성하기</button>
    //   </div>
    // </form>
    // </div>
  );
};

export default MeetupEditForm;
