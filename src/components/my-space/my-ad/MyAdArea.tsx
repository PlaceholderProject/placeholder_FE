"use client";

import React, { useState } from "react";
import CurrentMyAd from "./CurrentMyAd";
import PastMyAd from "./PastMyAd";

const MyAdArea = () => {
  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <div className="space-y-[1.4rem]">
      <div className="border-border bg-card inline-flex rounded-full border p-[0.4rem]">
        {[
          { key: "current", label: "현재" },
          { key: "past", label: "지난 광고" },
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

      {activeSubTab === "current" ? <CurrentMyAd /> : <PastMyAd />}
    </div>
  );
};

export default MyAdArea;
