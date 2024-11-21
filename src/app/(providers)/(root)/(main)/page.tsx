import React from "react";

const MainPage = () => {


// 모임들 가져오기
const {data: meetups, isPending, error} = useQuery(["meetups"], async () => {
  const response = await fetch("/api/v1/meetup", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, //jwtToken?
    },
  })

  if (!response.ok) {
    throw new Error('모임들 가져오기 실패')
  }
  return response.json()
})

// 모임 하나 가져오기
 const {data: meetup, isPending, error} = useQuery(["meetup"], async () => {
  const response = await fetch(`api/v1/meetup/${meetup_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, //jwtToken?
    },
  })

  if (error) {

    throw new Error('모임 가져오기 실패')

  }
  return response.json()

 })

 
  return <div>MainPage</div>;
};

export default MainPage;
