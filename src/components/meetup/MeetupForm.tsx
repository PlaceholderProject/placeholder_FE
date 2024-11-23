"use client";

import React, { useState } from "react";
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

const MeetupForm = () => {
  const queryClient = useQueryClient();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMTg3MjE4LCJpYXQiOjE3MzIxODY5MTgsImp0aSI6ImVjZDc0ZDBiOGEyODRmODZhMGE3MjRmYjUzNTBkNmRkIiwidXNlcl9pZCI6Mn0.Oy6DifyBzOdwsQt3kGxKEicCockgcsCuWlWDAEnBFG0";

  const [isPublicChecked, setIsPublicChecked] = useState(true);
  const [isStartedAtNullChecked, setIsStartedAtNullChecked] = useState(false);
  const [isEndedAtNullChecked, setIsEndedAtNullChecked] = useState(false);
  // API 함수들
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
    <div className="w-80 p-5 m-5">
      <h2 className="">MeetupForm</h2>
      <div>
        모임에 대해 알려주세요.
        <form onSubmit={handleMeetupFormSubmit}>
          모임 성격
          <input name="category" type="select" required />
          모임 이름(랜덤생성하기버튼필요)
          <input name="title" type="text" required />
          모임 날짜 시작 날짜
          <input name="startedAt" type="date" />
          {/* <input name="startedAtNull" type="checkbox" /> */}
          종료 날짜
          <input name="startedAt" type="date" />
          {/* <input name="endedAtNull" type="checkbox" /> */}
          모임 장소 모임 지역
          <input name="place" type="select" required />
          <input name="description" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" required />
          <br />
          광고글에 필요한 내용을 작성해주세요. <br />
          광고글 제목
          <input name="adTitle" type="text" required />
          광고 기간 광고 종료 날짜
          <input name="adEndedAt" type="date" />
          <br />
          광고글 설명
          <textarea name="description" />
          {/* 광고글 대표 이미지 */}
          광고글 공개
          <input type="checkbox" checked={isPublicChecked} onChange={() => setIsPublicChecked(!isPublicChecked)} />
          <button type="submit" onClick={handleMeetupFormSubmit}>
            모임 생성하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeetupForm;
