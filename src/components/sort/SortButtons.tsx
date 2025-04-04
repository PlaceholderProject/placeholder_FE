import { SortType } from "@/types/meetupType";
import React from "react";

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

export default SortButtons;
