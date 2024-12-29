import { BASE_URL } from "@/constants/baseURL";

const AdDetail = async ({ meetupId }: { meetupId: number }) => {
  const token = process.env.NEXT_PUBLIC_MY_TOKEN;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("해당 id 모임 가져오기 실패");
    }

    const meetupAsAd = await response.json();
    console.log(meetupAsAd);
    const imageUrl = `${BASE_URL}${meetupAsAd.image}`;

    return (
      <>
        <div>
          <h3>
            <div>{meetupAsAd.adTitle}</div>
            <div>{meetupAsAd.adEndedAt.substring(0, 10)}까지 모집</div>
            <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
            {/* <Image width={50} height={20} src={imageUrl} alt={"모임 광고글 이미지"} /> */}
            <img src={imageUrl} alt={"모임 광고글 이미지"} />
            ---------TODO-------- <br />
            서버에서 보내주는 날짜 값 뒷자리 제거하는 함수 util로 만들기
          </h3>
          <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
          <div>🩵 모임이름 : {meetupAsAd.name}</div>
          <div>
            🍎 모임장소 : [{meetupAsAd.place}] {meetupAsAd.placeDescription}
          </div>
          <div>
            {meetupAsAd.startedAt} ~ {meetupAsAd.endedAt}
            <br />
            ---------TODO-------- <br />
            두번재 날짜에서 첫번째 날짜 빼서 계산하고 값이 1이하면 day, 아니면 days 붙이는 함수 util로 만들기 미정이 있으면 day글자 자체가 안 나오게 (메인페이지에서도 사용)
          </div>
          <div>{meetupAsAd.description}</div>
        </div>
      </>
    );
  } catch (error) {
    return <div>에러 발생: {error.message}</div>;
  }
};

export default AdDetail;

// "use client";

// import React, { useEffect } from "react";

// const AdDetail = ({ meetupId }: { meetupId: number }) => {
//   const token = process.env.NEXT_PUBLIC_MY_TOKEN;

//   const getMeetupById = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/meetup/${meetupId}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         console.error("가져오기 실패: ", response.status, response.statusText);
//         throw new Error("해당 id 모임 가져오기 실패");
//       }

//       const meetupAsAd = await response.json();
//       console.log(meetupAsAd);
//       return meetupAsAd;
//     } catch (error) {
//       console.log("에러 : ", error.message);
//     }
//   };

//   useEffect(() => {
//     getMeetupById();
//   }, []);

//   getMeetupById();

//   return <div>AdDetail</div>;
// };

// export default AdDetail;

// 🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠 SSR 구현중🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠
// import React from "react";

// export const getServerSideProps = async context => {
//   const token = process.env.NEXT_PUBLIC_MY_TOKEN;

//   try {
//     const response = await fetch("http://localhost:8000/api/v1/meetup/2", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw (new Error("해당 id 광고글 가져오기 실패"), console.log("광고글 가져오기 실패:", response.status, response.statusText));
//     }

//     const meetupAsAd = await response.json();

//     return {
//       props: {
//         meetupAsAd,
//       },
//     };
//   } catch (error) {
//     console.log("에러 발생:", error.message);
//     return {
//       props: {
//         meetupAsAd: null,
//         error: error.message,
//       },
//     };
//   }
// };

// const AdDetail = ({ meetupAsAd, error }) => {
//   if (error) {
//     return <div>오류 발생 : {error}</div>;
//   }

//   if (!meetupAsAd) {
//     return <div>광고글 못 찾음</div>;
//   }

//   return (
//     <>
//       <div>
//         <h1>광고글 디테일이지롱</h1>

//         <p>{JSON.stringify(meetupAsAd)}</p>
//       </div>
//     </>
//   );
// };

// export default AdDetail;

// 🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️ 무지성으로 망한 SSR 시도 🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️🙅🏻‍♀️ㅍ

// export const getMeetupById = async () => {

//   const token = process.env.NEXT_PUBLIC_MY_TOKEN;

//   try {
//     const response = await fetch("http://localhost:8000/api/v1/meetup/2", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//     });

//     if (!response.ok) {
//       throw new Error("해당 id 광고글 가져오기 실패")
//       console.log("광고글 가져오기 실패:", response.status, response.statusText)
//     }

//     const meetupAsAd = await response.json();
//     console.log(meetupAsAd);
//     return meetupAsAd;

//   } catch (error) {
//     console.log("에러 메세지:", error.message) ;
//   }
// };

// const AdDetail = ( {meetupId: number} ) => {

//   return(<>
//   <div>
//     <h1>광고글 디테일이지롱</h1>
//     <p>{meetupAsAd}</p>
//     </div></>)

// }

// export default AdDetail;
