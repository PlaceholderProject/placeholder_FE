"use client";

import Link from "next/link";
import React, { useState } from "react";

const MySpaceLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeMainTab, setActiveMainTab] = useState<"myMeetup" | "myAd">("myMeetup");

  return (
    <>
      <div>
        <nav>
          <h1>내 공간</h1>
          <Link className={`font-bold p-4 ${activeMainTab === "myMeetup" ? "active" : ""}`} onClick={() => setActiveMainTab("myMeetup")} href="/my-space/my-meetup">
            내 모임
          </Link>
          <Link className={`font-bold p-4 ${activeMainTab === "myAd" ? "active" : ""}`} onClick={() => setActiveMainTab("myAd")} href="/my-space/my-ad">
            내 광고
          </Link>
          <Link className="font-bold p-4" href="/my-space/received-proposal">
            받은 신청서
          </Link>
          <Link className="font-bold p-4" href="/my-space/sent-proposal">
            보낸 신청서
          </Link>
        </nav>
        {children}
      </div>
    </>
  );
};
