"use client";

import React, { useState } from "react";
import { getAccount } from "@/services/account.service";
import { useEffect } from "react";
import { AdUserData } from "@/types/adType";
import Cookies from "js-cookie";

const AdUser = ({ meetupId }: { meetupId: number }) => {
  const [adUserData, setAdUserData] = useState<AdUserData | null>(null);

  useEffect(() => {
    const getAccountToken = Cookies.get("accessToken");
    console.log("현재 내 토큰:", getAccountToken);

    getAccount().then(setAdUserData);
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
