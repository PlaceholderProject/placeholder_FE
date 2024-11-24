"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Meetup {
  name: string;
  description: string;
  place: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string | null;
  // isPublic: boolean;
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

const LabeledInput: React.forwardRef<HTMLInputElement, LabeledInputProps> = ({ id, name, label, type = "text", placeholder, required = true }, ref) => {
  return (
    <>
      <div>
        <label htmlFor="{id}">{label}</label>
        <input id={id} name={name} type={type} placeholder={placeholder} required={required} ref={ref} />
      </div>
    </>
  );
};

const MeetupForm = () => {
  const queryClient = useQueryClient();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMTg3MjE4LCJpYXQiOjE3MzIxODY5MTgsImp0aSI6ImVjZDc0ZDBiOGEyODRmODZhMGE3MjRmYjUzNTBkNmRkIiwidXNlcl9pZCI6Mn0.Oy6DifyBzOdwsQt3kGxKEicCockgcsCuWlWDAEnBFG0";

  const [isPublicChecked, setIsPublicChecked] = useState(true);
  const [isStartedAtChecked, setIsStartedAtChecked] = useState(false);
  const [isEndedAtChecked, setIsEndedAtChecked] = useState(false);
  const [isStartedAtNullChecked, setIsStartedAtNullChecked] = useState(false);
  const [isEndedAtNullChecked, setIsEndedAtNullChecked] = useState(false);

  const adTitleRef = useRef<HTMLInputElement>();

  // ######## TODO ###############
  // startedAt에서 date가 선택되었으면 isStartedAtChecked true
  // endedAt에서 date가 선택되었으면 isEndedAtChecked true
  // 위에 상태로 나타내야지
  // 근데... 날짜 상태든 미정 상태든 무조간 하나는 true가 되어야 하고,
  // 양쪽 중 무조건 하나만 체크가 되어야 하고 (중복 체크 불가),
  // 그 양쪽을 하나로 묶는 상태가 필요할까? div로 묶기도 해야 할듯?
  // required 어떻게 처리할지 고민!!!!!

  // 모임들 가져오기 수정 중
  // 이거를 가져와서 meetups 라는 애가 있는 상태에서
  // 새로운 meetup을 추가하고 그걸 가지고 메인페이지로 넘어가야할듯?

  // 모임들 가져오기
  // const getMeetups = async (): Promise<Meetup[]> => {
  //   const response = await fetch("/api/v1/meetup", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error("모임들 가져오기 실패");
  //   }

  //   return response.json();
  // };

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
    const adTitle = adTitleRef.current?.value || "";
    console.log("Submitted adTitle:", adTitle);
    // const form = event.currentTarget as HTMLFormElement;

    const nameValue = (event.target as HTMLInputElement).value;
    const descriptionValue = (event.target as HTMLInputElement).value;
    const placeDescriptionValue = (event.target as HTMLInputElement).value;
    const placeValue = (event.target as HTMLInputElement).value;
    const startedAtValue = (event.target as HTMLInputElement).value;
    const endedAtValue = (event.target as HTMLInputElement).value;
    const adTitleValue = (event.target as HTMLInputElement).value;
    const adEndedAtValue = (event.target as HTMLInputElement).value;
    // const isPublicValue = (form.elements.namedItem("isPublic") as HTMLInputElement).checked;
    const imageValue = (event.target as HTMLInputElement).value;
    const categoryValue = (event.target as HTMLInputElement).value;

    const newMeetup = {
      // name: form.name.value,
      name: nameValue,
      description: descriptionValue,
      place: placeValue,
      placeDescription: placeDescriptionValue,
      startedAt: startedAtValue,
      endedAt: endedAtValue,
      adTitle: adTitleValue,
      adEndedAt: adEndedAtValue,
      // isPublic: isPublicValue,
      image: imageValue,
      category: categoryValue,
    };

    createMutation.mutate(newMeetup);
    // event.target.reset();
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
            <LabeledInput id="title" name="title" label="모임 이름(랜덤 생성 버튼 필요)" type="text" required />
            <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" required />
            <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" required />
            <LabeledInput id="place" name="place" label="모임 지역" type="text" required />
            <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" required />
            <LabeledInput id="adTitle" name="adTitle" label="광고글 제목" type="text" ref={adTitleRef} required />
            <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" required />
          </div>
          <div>
            <label htmlFor="description">광고글 설명</label>
            <textarea id="description" name="description" defaultValue=""></textarea>
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
    // <div className="w-80 p-5 m-5">
    //   <h2 className="">MeetupForm</h2>
    //   <div>
    //     모임에 대해 알려주세요.
    //     <form onSubmit={handleMeetupFormSubmit}>
    //       모임 성격
    //       <input name="category" type="select" required />
    //       모임 이름(랜덤생성하기버튼필요)
    //       <input name="title" type="text" required />
    //       모임 날짜 시작 날짜
    //       <input name="startedAt" type="date" />
    //       {/* <input name="startedAtNull" type="checkbox" /> */}
    //       종료 날짜
    //       <input name="startedAt" type="date" />
    //       {/* <input name="endedAtNull" type="checkbox" /> */}
    //       모임 장소 모임 지역
    //       <input name="place" type="select" required />
    //       <input name="description" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" required />
    //       <br />
    //       광고글에 필요한 내용을 작성해주세요. <br />
    //       광고글 제목
    //       <input name="adTitle" type="text" required />
    //       광고 기간 광고 종료 날짜
    //       <input name="adEndedAt" type="date" />
    //       <br />
    //       광고글 설명
    //       <textarea name="description" />
    //       {/* 광고글 대표 이미지 */}
    //       광고글 공개
    //       <input type="checkbox" checked={isPublicChecked} onChange={() => setIsPublicChecked(!isPublicChecked)} />
    //       <button type="submit" onClick={handleMeetupFormSubmit}>
    //         모임 생성하기
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default MeetupForm;
