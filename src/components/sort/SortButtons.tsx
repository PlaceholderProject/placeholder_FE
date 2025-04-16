import { SortType } from "@/types/meetupType";
import React from "react";

const SortButtons = ({ currentSort, handleSortChange }: { currentSort: SortType; handleSortChange: (NewSortType: SortType) => void }) => {
  return (
    <>
      <div>
        <button className={`px-3 py-1 ${currentSort === "like" ? "text-[#484848]" : "text-[#BDBDBD]"}`} onClick={() => handleSortChange("like")}>
          🔥 인기 모집
        </button>
        <button className={`px-3 py-1 ${currentSort === "latest" ? "text-[#484848]" : "text-[#BDBDBD]"}`} onClick={() => handleSortChange("latest")}>
          ✨ 최신 모집
        </button>
        <button className={`px-3 py-1 ${currentSort === "deadline" ? "text-[#484848]" : "text-[#BDBDBD]"}`} onClick={() => handleSortChange("deadline")}>
          {" "}
          ⏰ 마감 임박 모집
        </button>
      </div>
    </>
  );
};

export default SortButtons;
