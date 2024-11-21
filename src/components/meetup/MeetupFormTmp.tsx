import React from "react";
import InputField from "./InputField";
import { error } from "console";

const MeetupFormTmp= () => {

  
// interface FormState {
//   meetupName: string;
//   meetupCriteria: string;
//   meetupStartedAt: string;
//   meetupEndedAt: string;
//   meetupPlace: string;
//   placeDescription: string;
//   adTitle: string;
//   adStartedAt: string;
//   adEndedAt: string;
//   adImage: string;
//   adDescription: string;
//   isToggleOn: boolean;
//   isPublic: boolean;
// }

// const initialState: FormState = {
//   meetupName: "",
//   meetupCriteria: "",
//   meetupStartedAt: "",
//   meetupEndedAt: "",
//   meetupPlace: "",
//   placeDescription: "",
//   adTitle: "",
//   adStartedAt: "",
//   adEndedAt: "",
//   adImage: "",
//   adDescription: "",
//   isToggleOn: true,
//   isPublic: true,
// }

// const handleSubmit = () => {

// };

// ----- POST 요청 코드 시작-----
  
const createMeetup = async(data: FormState) => {
//FormState 정의 필요
  const token = "YOUR_JWT_TOKEN"

  const response = await fetch('/api/v1/meetup', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`모임 생성 실패: ${errorDetails.message || 'Unknown error'}`);
  }

  return response.json(); //성공적인 응답 반환
}

//.json() 지워도 될걸?


export const useCreateMeetup = () => {
  const queryClient = useQueryClient();

  return useMutation(createMeetup, {
    onSucess: () => {
      queryClient.invalidateQueries(['meetups']);
    },
    onError: (error: Error) => {
      console.error('모임 생성 실패:', error.message);
    },
  });

}

// ----- POST 요청 코드 끝-----
// 아래처럼 useCreateMeetup 훅을 사용해 POST 요청을 실행할 수 있다.


const mutation = useCreateMeetup();
const handleMeetupFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const requestData: FormState = {
    name: "새모임",
    started_at: "2024-11-11",
    ended_at: "2024-11-15",
    place: "서울",
    placeDescription: "세모호수공원",
    image: "url",
    isPublic: true,
    meetingType: "운동"
  };

  mutation.mutate(requestData); //데이터 POST
}

return (<form onSubmit={handleMeetupFormSubmit}>
  <button type="submit">모임 생성</button>


</form>)

  return (<>
  
  <div>MeetupForm</div>
  {/* <form onSubmit={handleSubmit} className="">
<InputField label=""
type="" value="" onChange={(value) => {}}>

</InputField>


  </form> */}
  </>);
};

export default MeetupFormTmp;
