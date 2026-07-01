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
    <div className="space-y-[1.4rem]">
      <div className="border-border bg-card inline-flex rounded-full border p-[0.4rem]">
        {[
          { key: "current", label: "현재" },
          { key: "past", label: "지난 모임" },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-full px-[1.6rem] py-[0.7rem] text-sm font-semibold transition-colors ${activeSubTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
