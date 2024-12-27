const AdDetail = async ({ meetupId }: { meetupId: number }) => {
  const token = process.env.NEXT_PUBLIC_MY_TOKEN;

  try {
    const response = await fetch(`http://localhost:8000/api/v1/meetup/${meetupId}`, {
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
    return (
      <>
        <div>
          <h2>meetupAsAd 디테일</h2>
          <div>{meetupAsAd.name}</div>
          <div>{meetupAsAd.startedAt}</div>
          <p>렌더링 부분 다시 만드세용~~~</p>
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
