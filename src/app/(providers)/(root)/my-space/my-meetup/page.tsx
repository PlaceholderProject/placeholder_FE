"use client";

import CurrentMyMeetup from "@/components/my-space/my-meetup/CurrentMyMeetup";
import PastMyMeetup from "@/components/my-space/my-meetup/PastMyMeetup";
import ReceivedProposals from "@/components/my-space/received-proposal/ReceivedProposals";
import SentProposals from "@/components/my-space/sent-proposal/SentProposals";
import React from "react";
import { useState } from "react";

const myMeetupPage = () => {
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
      <div>
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
        <div className="sub-tabs">
          <button
            className={`${activeSubTab === "current" ? "active bg-[#006B8B] text-white" : "bg-[#D9D9D9] text-black"} rounded-md p-2 m-4 font-semibold`}
            onClick={() => setActiveSubTab("current")}
          >
            현재 내 모임 보기
          </button>
          <button className={`${activeSubTab === "past" ? "active bg-[#006B8B] text-white" : "bg-[#D9D9D9] text-black"} rounded-md p-2 m-4 font-semibold`} onClick={() => setActiveSubTab("past")}>
            지난 내 모임 보기
          </button>
        </div>

        {/* 나올 내용 */}
        {activeSubTab === "current" ? <CurrentMyMeetup /> : <PastMyMeetup />}
      </div>
    </>
  );
};

export default myMeetupPage;
