"use client";

import React, { useState } from "react";

import { useEffect } from "react";
import { AdUserData } from "@/types/adType";
import Cookies from "js-cookie";
import { getUser } from "@/services/user.service";

const AdUser = ({ meetupId }: { meetupId: number }) => {
  const [adUserData, setAdUserData] = useState<AdUserData | null>(null);
  useEffect(() => {
    const getAccountToken = Cookies.get("accessToken");
    console.log("현재 내 토큰:", getAccountToken);
    // 💖💖💖💖💖getAccount 함수의 fetch url 엔드포인트 /api/v1/user로 수정하면 유저 정보 잘 가져와진다!!!💖💖💖💖💖💖
    // 🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽 이브한테 물어보기 🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽🌽
    getUser().then(setAdUserData);
  }, []);

  // if (!adUserData) {
  //   return (
  //     <>
  //       <div className="animate-pulse">로딩 중.. 스켈레톤 UI</div>
  //       <div className="flex items-center gap-2">
  //         <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
  //         <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
  //       </div>
  //     </>
  //   );
  // }
  console.log(adUserData);

  return (
    <>
      <div>
        <img src={adUserData?.image} alt={`${adUserData?.nickname}의 프로필 사진`} className="w-10 h-10 rounded-full" />
      </div>
      <div>🔷유저닉네임:{adUserData?.nickname}</div>
    </>
  );
};

export default AdUser;

// 👇 현 컴포넌트에서 아래 코드처럼
// 👇👇👇👇👇 로딩, 에러처리까지 해주는 것이 UX 측면에서 좋긴 하다

// "use client";

// import React, { useEffect, useState } from "react";
// import { getAccount } from "@/services/account.service";

// // 사용자 데이터의 타입을 정의합니다 (실제 데이터 구조에 맞게 수정해주세요)
// type UserData = {
//   name?: string;
//   email?: string;
//   // 기타 필요한 사용자 정보 필드들
// };

// const AdUser = ({ meetupId }: { meetupId: number }) => {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await getAccount();
//         if (response) {
//           setUserData(response);
//         } else {
//           setError("사용자 정보를 불러올 수 없습니다.");
//         }
//       } catch (err) {
//         setError("데이터 로딩 중 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <div>로딩 중...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!userData) {
//     return <div>사용자 정보가 없습니다.</div>;
//   }

//   return (
//     <div>
//       <h2>사용자 정보</h2>
//       <div>
//         {/* 실제 데이터 구조에 맞게 수정해주세요 */}
//         <p>이름: {userData.name}</p>
//         <p>이메일: {userData.email}</p>
//         {/* 필요한 다른 사용자 정보들을 여기에 추가하세요 */}
//       </div>
//     </div>
//   );
// };

// export default AdUser;
