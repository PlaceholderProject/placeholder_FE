"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Meetup {
  name: string;
  description: string;
  place: string;
  placeDescription: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string | null;
  isPublic: boolean;
  image: string;
  category: string;
}

interface LabeledInputProps {
  id: string;
  name: string;
  label: string;
  type?: string; // 인풋 타입 (기본값: "text")
  placeholder?: string; // 선택적 placeholder
  minlength?: string;
  maxlength?: string;
  required: boolean;
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(({ id, name, label, type = "text", placeholder, required = true }, ref) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={name} type={type} placeholder={placeholder} required={required} ref={ref} />
      </div>
    </>
  );
});

const MeetupForm = () => {
  const queryClient = useQueryClient();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMTg3MjE4LCJpYXQiOjE3MzIxODY5MTgsImp0aSI6ImVjZDc0ZDBiOGEyODRmODZhMGE3MjRmYjUzNTBkNmRkIiwidXNlcl9pZCI6Mn0.Oy6DifyBzOdwsQt3kGxKEicCockgcsCuWlWDAEnBFG0";

  const [isPublicChecked, setIsPublicChecked] = useState(true);
  const [isStartedAtChecked, setIsStartedAtChecked] = useState(false);
  const [isEndedAtChecked, setIsEndedAtChecked] = useState(false);
  const [isStartedAtNullChecked, setIsStartedAtNullChecked] = useState(false);
  const [isEndedAtNullChecked, setIsEndedAtNullChecked] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // 모임 생성
  const createMeetup = async (newMeetup: Meetup): Promise<void> => {
    const response = await fetch("http://localhost:8000/api/v1/meetup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMeetup),
    });

    if (!response.ok) {
      throw new Error("모임 생성 실패");
    }
    return;
  };

  // const {
  //   data: meetups,
  //   isPending,
  //   isError,
  // } = useQuery<Meetup[]>({
  //   queryKey: ["meetups"],
  //   queryFn: getMeetups,
  // });

  const createMutation = useMutation<void, Error, Meetup>({
    mutationFn: createMeetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
    },
  });

  const handleMeetupFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!nameRef.current) {
      console.error("nameRef가 인풋에 연걸 안돼있어");
      return;
    }
    const name = nameRef.current?.value || "";
    console.log("Submitted name:", name);

    if (!startedAtRef.current) {
      console.error("startedAtRef가 인풋에 연걸 안돼있어");
      return;
    }
    const startedAt = startedAtRef.current?.value || "";
    console.log("Submitted startedAt:", startedAt);

    if (!endedAtRef.current) {
      console.error("endedAtRef가 인풋에 연걸 안돼있어");
      return;
    }
    const endedAt = endedAtRef.current?.value || "";
    console.log("Submitted endedAt:", endedAt);

    if (!placeRef.current) {
      console.error("placeRef가 인풋에 연걸 안돼있어");
      return;
    }
    const place = placeRef.current?.value || "";
    console.log("Submitted place:", place);

    if (!placeDescriptionRef.current) {
      console.error("placeDescriptionRef가 인풋에 연결 안돼있어");
      return;
    }

    const placeDescription = placeDescriptionRef.current?.value || "";
    console.log("Submitted placeDescription:", placeDescription);

    if (!adTitleRef.current) {
      console.error("adTitleRef가 인풋에 연걸 안돼있어");
      return;
    }
    const adTitle = placeRef.current?.value || "";
    console.log("Submitted adTitle:", adTitle);

    if (!adEndedAtRef) {
      console.error("adEndedAtRef가 인풋에 연결 안돼있어");
      return;
    }
    const adEndedAt = adEndedAtRef.current?.value || "";
    console.log("Submitted adEndedAt:", adEndedAt);

    if (!descriptionRef) {
      console.error("descriptionRef가 인풋에 연결 안돼있어");
      return;
    }

    // const description = descriptionRef.current.value || "";

    // const form = event.currentTarget as HTMLFormElement;
    // const isPublicValue = (form.elements.namedItem("isPublic") as HTMLInputElement).checked;

    const newMeetup: Meetup = {
      name: nameRef.current?.value || "", // name: nameRef였음 ㅜㅜ
      description: descriptionRef.current?.value || "",
      place: placeRef.current?.value || "",
      placeDescription: placeDescriptionRef.current?.value || "",
      startedAt: startedAtRef.current?.value || "",
      endedAt: endedAtRef.current?.value || "",
      adTitle: adTitleRef.current?.value || "",
      adEndedAt: adEndedAtRef.current?.value || "",
      isPublic: isPublicRef.current?.checked || false, // `checked`로 값 가져오기
      image: imageRef.current?.value || "",
      category: categoryRef.current?.value || "",
    };

    createMutation.mutate(newMeetup);
  };

  // if (isPending) {
  //   return <p>Pending...</p>;
  // }

  // if (isError) {
  //   return <p>Error발생</p>;
  // }

  return (
    <>
      <div>
        <form onSubmit={handleMeetupFormSubmit}>
          <div>
            {/* <LabeledInput id="category" name="category" label="모임 성격" type="text" required /> */}
            {/* <select>
              <option value="">{value}</option>
            </select> */}
            <LabeledInput id="name" name="name" label="모임 이름(랜덤 생성 버튼 필요)" type="text" ref={nameRef} required />
            <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} required />
            <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} required />
            <LabeledInput id="place" name="place" label="모임 지역" type="text" ref={placeRef} required />
            <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" ref={placeDescriptionRef} required />

            <LabeledInput id="adTitle" name="adTitle" label="광고글 제목" type="text" ref={adTitleRef} required />

            <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} required />
          </div>
          <div>
            <label htmlFor="description">광고글 설명</label>
            <textarea id="description" name="description" defaultValue="" placeholder="멤버 광고글에 보여질 설명을 적어주세요." ref={descriptionRef}></textarea>
          </div>
          <div>
            <label htmlFor="isPublic">광고글 공개하기</label>
            <input id="isPublic" type="checkbox" checked={isPublicChecked} onChange={() => setIsPublicChecked(!isPublicChecked)} />
          </div>
          <div>
            <button type="submit">모임 생성하기</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MeetupForm;
