"use client";

import React, { useState } from "react";
import { SortType } from "@/types/meetupType";

const SortArea = () => {
  // 정렬 상태관리
  const [sortType, setSortType] = useState<SortType>("popular");
  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
    console.log(newSortType);
    // 여기다가 SortType에 따른 로직을 따로 쓰게 해야지
    if (newSortType === "popular") {
      alert("인기순이야");
    }

    if (newSortType === "newest") {
      alert("최신순이야");
    }

    if (newSortType === "adDeadline") {
      alert("마감 임받순이야");
    }
  };

  const SortButtons = ({ currentSort, handleSortChange }: { currentSort: SortType; handleSortChange: (sort: SortType) => void }) => {
    return (
      <>
        <div>
          <button className={`px-3 py-1 ${currentSort === "popular" ? "text-[#484848]" : "text-[#BDBDBD]"}`} onClick={() => handleSortChange("popular")}>
            🔥 인기 모집
          </button>
          <button className={`px-3 py-1 ${currentSort === "newest" ? "text-[#484848]" : "text-[#BDBDBD]"}`} onClick={() => handleSortChange("newest")}>
            ✨ 최신 모집
          </button>
          <button className={`px-3 py-1 ${currentSort === "adDeadline" ? "text-[#484848]" : "text-[#BDBDBD]"}`} onClick={() => handleSortChange("adDeadline")}>
            {" "}
            ⏰ 마감 임박 모집
          </button>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="flex  justify-items-center justify-center">
        <SortButtons currentSort={sortType} handleSortChange={handleSortChange} />
      </div>
    </>
  );
};

export default SortArea;
