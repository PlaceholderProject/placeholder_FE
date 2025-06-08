"use client";

import Link from "next/link";
import React, { useState } from "react";

const MySpaceLayout = ({ children }: { children: React.ReactNode }) => {
  // --NOTE--
  // 메인 탭 기본값이 myMeetup이어서 my-space/my-meetup으로 url 엔드 포인트 타이핑 해서 들어가도
  // 내 광고가 아닌 내 모임이 기본으로 뜬다
  // 그런데 유저가 내 공간(모임, 광고 모두 포함) 버튼 - 내 모임 - 내광고 순서로 접근하는 것 외에
  // 기획상 내광고로 한 번에 접근할 경로는 아직 없으므로 그냥 둠

  const [activeMainTab, setActiveMainTab] = useState<"myMeetup" | "myAd">("myMeetup");

  return (
    <>
      <div className="py-[10rem]">
        <nav className="border-gray-medium border-b-[0.1rem]">
          <h1 className="m-2 text-xl font-bold">내 공간</h1>
          <Link
            className={`m-4 rounded-md p-2 font-semibold ${activeMainTab === "myMeetup" ? "active bg-[#FBFFA9]" : "bg-white"}`}
            onClick={() => setActiveMainTab("myMeetup")}
            href="/my-space/my-meetup"
          >
            내 모임
          </Link>
          <Link className={`m-4 rounded-md p-2 font-semibold ${activeMainTab === "myAd" ? "active bg-[#FBFFA9]" : "bg-white"}`} onClick={() => setActiveMainTab("myAd")} href="/my-space/my-ad">
            내 광고
          </Link>
          <Link className="m-4 rounded-md p-2 font-semibold" href="/my-space/received-proposal">
            받은 신청서
          </Link>
          <Link className="m-4 rounded-md p-2 font-semibold" href="/my-space/sent-proposal">
            보낸 신청서
          </Link>
        </nav>
        {children}
      </div>
    </>
  );
};

export default MySpaceLayout;
