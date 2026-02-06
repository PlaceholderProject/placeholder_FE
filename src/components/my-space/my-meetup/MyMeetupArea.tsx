"use client";

import React, { useState } from "react";
import CurrentMyMeetup from "./CurrentMyMeetup";
import PastMyMeetup from "./PastMyMeetup";

const MyMeetupArea = () => {

  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <>
      <div className="">
        {}

        {}
        <div className="sub-tabs mb-[2rem] mt-[2.7rem] flex justify-between md:grid md:grid-cols-2 md:gap-x-[4rem]">
          <button
            className={`${activeSubTab === "current" ? "active bg-primary text-white" : "bg-gray-medium text-primary"} rounded-[1rem] px-[1.5rem] py-[0.5rem] text-base md:text-xl`}
            onClick={() => setActiveSubTab("current")}
          >
            현재 내 모임 보기
          </button>
          <button
            className={`${activeSubTab === "past" ? "active bg-primary text-white" : "bg-gray-medium text-primary"} rounded-[1rem] px-[1.5rem] py-[0.5rem] text-base md:text-xl`}
            onClick={() => setActiveSubTab("past")}
          >
            지난 내 모임 보기
          </button>
        </div>

        {}
        {activeSubTab === "current" ? <CurrentMyMeetup /> : <PastMyMeetup />}
      </div>
    </>
  );
};

export default MyMeetupArea;
