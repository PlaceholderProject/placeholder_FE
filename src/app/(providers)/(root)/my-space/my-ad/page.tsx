"use client";

import CurrentMyAd from "@/components/my-space/my-ad/CurrentMyAd";
import PastMyAd from "@/components/my-space/my-ad/PastMyAd";
import React, { useState } from "react";

const myAdPage = () => {
  const [activeSubTab, setActiveSubTab] = useState<"current" | "past">("current");

  return (
    <div>
      <div className="sub-tabs">
        <button className={`${activeSubTab === "current" ? "active bg-[#006B8B] text-white" : "bg-[#D9D9D9] text-black"} rounded-md p-2 m-2 font-semibold`} onClick={() => setActiveSubTab("current")}>
          현재 내 광고 보기
        </button>
        <button className={`${activeSubTab === "past" ? "active bg-[#006B8B] text-white" : "bg-[#D9D9D9] text-black"} rounded-md p-2 m-2 font-semibold`} onClick={() => setActiveSubTab("past")}>
          지난 내 광고 보기
        </button>
      </div>

      {activeSubTab === "current" ? <CurrentMyAd /> : <PastMyAd />}
    </div>
  );
};

export default myAdPage;
