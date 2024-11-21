import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Meetup {
  id: number;
  isOrganizer: boolean;
  organizer: {
    name: string;
    profileImage: string;
  };
  name: string;
  description: string;
  place: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string | null;
  isPublic: boolean; 
  image: string;
  category: string;

}

const MeetupForm = () => {

  const queryClient = useQueryClient();

const token = "my-jwt-token";

// API 함수들
// 모임들 가져오기 수정 중
// 이거를 가져와서 meetups 라는 애가 있는 상태에서
// 새로운 meetup을 추가하고 그걸 가지고 메인페이지로 넘어가야할듯?

const getMeetups = async () : Promise<Meetup[]> => {
  const response = await fetch("/api/v1/meetup", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error("모임들 가져오기 실패")
  }

  return response.json();
}

// 모임 생성 수정중
const createMeetup = async (newMeetup: Meetup): Promise<void> => {
  const response = await fetch("api/v1/meetup", {
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
}

const {data: meetups, isPending, isError} = useQuery<Meetup[]>({
  queryKey: ["meetups"],
  queryFn: getMeetups
});

const createMutation = useMutation<void, Error, Meetup>({
  mutationFn: createMeetup,
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["meetups"]})
  }
});

 const handleMeetupFormSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  // const form = event.currentTarget;

  const nameValue = (event.target as HTMLInputElement).value;
  const descritopnValue = (event.target as HTMLInputElement).value;
  const placeValue = (event.target as HTMLInputElement).value;
  const startedAtValue = (event.target as HTMLInputElement).value;
  const endedAtValue = (event.target as HTMLInputElement).value;
  const adTitleValue = (event.target as HTMLInputElement).value;
  const adEndedAtValue = (event.target as HTMLInputElement).value;
  const isPublicValue = (event.target as HTMLFormElement).isPublic.checked;
  const imageValue = (event.target as HTMLInputElement).value;
  const categoryValue = (event.target as HTMLInputElement).value;

  const newMeetup = {
    id: 0,
    isOrganizer: true,
    organizer: {
      name: "string",
      profileImage: "string"
    },
    // name: form.name.value,
    name: nameValue,
    description: descritopnValue,
    place: placeValue,
    startedAt: startedAtValue,
    endedAt: endedAtValue,
    adTitle: adTitleValue,
    adEndedAt: adEndedAtValue,
    isPublic: isPublicValue,
    image: imageValue,
    category: categoryValue,
  }

  createMutation.mutate(newMeetup)
  event.target.reset()
 }

 if (isPending) {
  return <p>Pending...</p>
}

if (isError) {
  return <p>Error발생</p>
}


  return (
    <div>
      <h2>MeetupForm</h2>
      모임에 대해 알려주세요.
      <form onSubmit={handleMeetupFormSubmit}>
        모임 성격
        <input name="category" type="select" required />
        모임 이름(랜덤생성하기버튼필요)
        <input name="title" type="text" required />
모임 날짜
시작 날짜
<input name="startedAt" type="date" /> <input name="startedAtNull" type="checkbox" />
종료 날짜
<input name="startedAt" type="date" /> <input name="endedAtNull" type="checkbox" />
모임 장소
모임 지역
<input name="place" type="select" required />
<input name="description" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" required />


광고글에 필요한 내용을 작성해주세요.
광고글 제목
<input name="adTitle" type="text" />
광고 기간
광고 종료 날짜
<input name="adEndedAt" type="date" />
광고글 대표 이미지
        <button type="submit">모임 생성하기</button>
        </form>
    </div>
  )
}

export default MeetupForm;
