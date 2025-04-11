"use client";

import Link from "next/link";
import React, { useState } from "react";

const MySpaceLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeMainTab, setActiveMainTab] = useState<"myMeetup" | "myAd">("myMeetup");

  return (
    <>
      <div>
        <nav>
          <h1 className="text-xl font-bold m-2">내 공간</h1>
          <Link
            className={`rounded-md p-2 m-4 font-semibold ${activeMainTab === "myMeetup" ? "active bg-[#FBFFA9]" : "bg-white"}`}
            onClick={() => setActiveMainTab("myMeetup")}
            href="/my-space/my-meetup"
          >
            내 모임
          </Link>
          <Link className={`rounded-md p-2 m-4 font-semibold ${activeMainTab === "myAd" ? "active bg-[#FBFFA9]" : "bg-white"}`} onClick={() => setActiveMainTab("myAd")} href="/my-space/my-ad">
            내 광고
          </Link>
          <Link className="rounded-md p-2 m-4 font-semibold" href="/my-space/received-proposal">
            받은 신청서
          </Link>
          <Link className="rounded-md p-2 m-4 font-semibold" href="/my-space/sent-proposal">
            보낸 신청서
          </Link>
        </nav>
        {children}
      </div>
    </>
  );
};

export default MySpaceLayout;
