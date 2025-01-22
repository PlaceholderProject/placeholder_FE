"use client";

import CurrentMyMeetup from "@/components/my-space/my-meetup/CurrentMyMeetup";
import PastMyMeetup from "@/components/my-space/my-meetup/PastMyMeetup";
import React from "react";
import { useState } from "react";

const myMeetupPage = () => {
  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <>
      <CurrentMyMeetup />
      <PastMyMeetup />
      <div>
        {/* 상위 탭 제목들 */}
        <div className="main-tabs">
          <h1>내 공간</h1>
          <div className="tab-list">
            <span className="active font-bold p-4">내 모임</span>
            <span className="font-bold p-4">내 광고</span>
            <span className="font-bold p-4">받은 신청서</span>
            <span className="font-bold p-4">보낸 신청서</span>
          </div>
        </div>

        {/* 하위 탭 버튼들 */}
        <div className="sub-tabs">
          <button className={activeSubTab === "current" ? "active" : ""} onClick={() => setActiveSubTab("current")}>
            현재 내 모임 보기
          </button>
          <button className={activeSubTab === "past" ? "active" : ""} onClick={() => setActiveSubTab("past")}>
            지난 내 모임 보기
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        {activeSubTab === "current" ? "현재 모임목록" : "지난 모임목록"}
      </div>
    </>
  );
};

export default myMeetupPage;
