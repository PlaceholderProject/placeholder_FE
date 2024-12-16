import React from 'react'

const DisabledCode = () => {


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

  return (
    <div>
      
    </div>
  )
}

export default DisabledCode
