import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const MeetupForm = () => {

  const queryClient = useQueryClient();

//JWT token
const token = "my-jwt-token";

// API 함수들

// 모임들 가져오기 수정 중
// 이거를 가져와서 meetups 라는 애가 있는 상태에서
// 새로운 meetup을 추가하고 그걸 가지고 메인페이지로 넘어가야할듯?

// 모임들 가져오기 수정 중
// const { data: meetups, isPending, isError } = useQuery(["meetups"], async () => {
//   const response = await fetch("/api/v1/meetup", //baseURL? 
//     {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (isError) {
//     throw new Error('모임들 가져오기 실패')
//   }
//   return response.json()
// });

const getMeetups = async () => {
  const response = await fetch("/api/v1/meetup", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('모임 가져오기 실패')
  }

  return response.json();
}

const {data: meetups, isPending, isError} = useQuery({
  queryKey: ["meetups"],
  queryFn: getMeetups
})

if (isPending) {
  return <p>Pending...</p>
}

if (isError) {
  return <p>Error발생</p>
}

// 모임 생성 수정중

const createMeetup = async (newMeetup) => {
  const response = await fetch("api/v1/meetup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newMeetup),
  });

  if (!response.ok) {
    throw new Error('모임 생성 실패');
  }
      return;
}

const createMutation = useMutation({
  mutationFn: createMeetup,
  onSuccess: () => {
    queryClient.invalidateQueries(["meetups"])
  }
})


// const mutation = useMutation(
//   async (newMeetup: Object) => {
//     const response = await fetch("/api/v1/meetup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(newMeetup),
//     })

//     if (response.ok) {
//       throw new Error('모임 생성 실패')
//     }
//         return response.json()
//   },
  
//   {
//     onSuccees: () => {
//       queryClient.invalidateQueries(["meetups"])
//     },
//   }
// )


 const handleMeetupFormSubmit = (event: SubmitEvent) => {
  event.preventDefault()
  const newMeetup = {
    id: 0,
    isOrganizer: true,
    organizer: {
      name: "string",
      profileImage: "string"
    },
    name: event.target.name.value,
    description: event.target.description.value,
    place: event.target.place.value,
    startedAt: event.target.startedAt.value,
    endedAt: event.target.endedAt.value,
    adTitle: event.target.adTitle.value,
    adEndedAt: event.target.adEndedAt.value,
    isPublic: event.target.isPublic.value,
    image: event.target.image.value,
    category: event.target.category.value,

  }

  mutation.mutate(newMeetup)
  event.target.reset()
 }

 if (isPending) return <p>Pending...</p>
 if (isError) return <p>Error: {error.message}</p>


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
