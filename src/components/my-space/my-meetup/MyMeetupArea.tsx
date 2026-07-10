"use client";

import React, { useState } from "react";
import CurrentMyMeetup from "./CurrentMyMeetup";
import PastMyMeetup from "./PastMyMeetup";
import SegmentedIndicator from "@/components/common/SegmentedIndicator";

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
    <div className="space-y-[1.4rem]">
      <div className="border-border bg-card relative grid grid-cols-2 rounded-[1.3rem] border p-[0.3rem]">
        <SegmentedIndicator count={2} index={activeSubTab === "current" ? 0 : 1} className="bg-primary-soft rounded-[1rem]" />
        {[
          { key: "current", label: "진행 중" },
          { key: "past", label: "종료" },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`relative z-10 rounded-[1rem] px-[1.6rem] py-[0.7rem] text-sm font-bold transition-colors duration-200 ${activeSubTab === tab.key ? "text-primary-soft-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveSubTab(tab.key as "current" | "past")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "current" ? <CurrentMyMeetup /> : <PastMyMeetup />}
    </div>
  );
};

export default MyMeetupArea;
