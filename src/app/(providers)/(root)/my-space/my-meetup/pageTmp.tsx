"use client";

import CurrentMyMeetup from "@/components/my-space/my-meetup/CurrentMyMeetup";
import PastMyMeetup from "@/components/my-space/my-meetup/PastMyMeetup";
import React, { useState } from "react";

const myMeetupPageTmp = () => {
  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <>
      <div>
        <div className="sub-tabs">
          <button
            className={`${activeSubTab === "current" ? "active bg-[#006B8B] text-white" : "bg-[#D9D9D9] text-black"} rounded-md p-2 m-2 font-semibold`}
            onClick={() => setActiveSubTab("current")}
          >
            현재 내 모임 보기
          </button>
          <button className={`${activeSubTab === "past" ? "active bg-[#006B8B] text-white" : "bg-[#D9D9D9] text-black"} rounded-md p-2 m-2 font-semibold`} onClick={() => setActiveSubTab("past")}>
            지난 내 모임 보기
          </button>
        </div>

        {/* 나올 내용 */}
        {activeSubTab === "current" ? <CurrentMyMeetup /> : <PastMyMeetup />}
      </div>
    </>
  );
};

export default myMeetupPageTmp;
