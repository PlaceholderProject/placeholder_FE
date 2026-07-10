"use client";

import React, { useState } from "react";
import CurrentMyAd from "./CurrentMyAd";
import PastMyAd from "./PastMyAd";
import SegmentedIndicator from "@/components/common/SegmentedIndicator";

const MyAdArea = () => {
  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <div className="space-y-[1.4rem]">
      <div className="border-border bg-card relative grid grid-cols-2 rounded-[1.3rem] border p-[0.3rem]">
        <SegmentedIndicator count={2} index={activeSubTab === "current" ? 0 : 1} className="bg-primary-soft rounded-[1rem]" />
        {[
          { key: "current", label: "모집 중" },
          { key: "past", label: "마감" },
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

      {activeSubTab === "current" ? <CurrentMyAd /> : <PastMyAd />}
    </div>
  );
};

export default MyAdArea;
