"use client";

import React, { useState } from "react";
import CurrentMyAd from "./CurrentMyAd";
import PastMyAd from "./PastMyAd";

const MyAdArea = () => {
  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <div>
      <div className="sub-tabs mb-[2rem] mt-[2.7rem] flex justify-between">
        <button
          className={`${activeSubTab === "current" ? "active bg-primary text-white" : "bg-gray-medium text-primary"} rounded-[1rem] px-[1.5rem] py-[0.5rem] text-base`}
          onClick={() => setActiveSubTab("current")}
        >
          현재 내 광고 보기
        </button>
        <button
          className={`${activeSubTab === "past" ? "active bg-primary text-white" : "bg-gray-medium text-primary"} rounded-[1rem] px-[1.5rem] py-[0.5rem] text-base`}
          onClick={() => setActiveSubTab("past")}
        >
          지난 내 광고 보기
        </button>
      </div>

      {activeSubTab === "current" ? <CurrentMyAd /> : <PastMyAd />}
    </div>
  );
};

export default MyAdArea;
