"use client";

import React, { useState } from "react";
import CurrentMyMeetup from "./CurrentMyMeetup";
import PastMyMeetup from "./PastMyMeetup";

const MyMeetupArea = () => {
  // 🐣🐣🐣객체 맵핑 방식~~ 🐣🐣
  // const TAB_COMPONENTS = {
  //   myMeetup: <MyMeetupArea />,
  //   myAd: <MyAdArea />,
  //   receivedProposal: <ReceivedProposals />,
  //   sentProposal: <SentProposals />,
  // };

  // 스위치-케이스문
  // {(() => {
  //   switch(activeMainTab) {
  //     case "myMeetup": return <MyMeetupComponent />;
  //     case "myAd": return <MyAdComponent />;
  //     case "received": return <ReceivedApplicationsComponent />;
  //     case "sent": return <SentApplicationsComponent />;
  //     default: return null;
  //   }
  // })()}

  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <>
      <div className="">
        {/* 상위 탭 제목들
        <div className="main-tabs">
          <div className="tab-list">
            <button className={activeMainTab === "myMeetup" ? "active" : ""} onClick={() => setActiveMainTab("myMeetup")}>
              내 모임
            </button>
            <button className={activeMainTab === "myAd" ? "active" : ""} onClick={() => setActiveMainTab("myAd")}>
              내 광고
            </button>
          </div>
        </div>

        {activeMainTab === "myMeetup"} */}

        {/* 하위 탭 버튼들 */}
        <div className="sub-tabs mt-[2.7rem] mb-[2rem] flex justify-between md:grid md:grid-cols-2 md:gap-x-[4rem]">
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

        {/* 나올 내용 */}
        {activeSubTab === "current" ? <CurrentMyMeetup /> : <PastMyMeetup />}
      </div>
    </>
  );
};

export default MyMeetupArea;
