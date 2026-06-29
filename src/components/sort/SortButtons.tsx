import { SortType } from "@/types/meetupType";
import React from "react";

const SortButtons = ({ currentSort, handleSortChange }: { currentSort: SortType; handleSortChange: (NewSortType: SortType) => void }) => {
  const sortButtonsArray = [
    { type: "like" as SortType, label: "🔥 인기 모집" },
    { type: "latest" as SortType, label: "✨ 최신 모집" },
    { type: "deadline" as SortType, label: "⏰ 마감 임박 모집" },
  ];
  return (
    <>
      {/* <div className="">
        <button className={`${currentSort === "like" ? "px-[1rem] text-base" : "text-base text-gray-medium"}`} onClick={() => handleSortChange("like")}>
          🔥 인기 모집
        </button>
        <button className={`${currentSort === "latest" ? "text-base" : "text-base text-[#BDBDBD]"}`} onClick={() => handleSortChange("latest")}>
          ✨ 최신 모집
        </button>
        <button className={`${currentSort === "deadline" ? "text-base" : "text-base text-[#BDBDBD]"}`} onClick={() => handleSortChange("deadline")}>
          {" "}
          ⏰ 마감 임박 모집
        </button>
      </div> */}

      <div>
        {sortButtonsArray.map(({ type, label }) => (
          <button key={type} className={`mt-[1rem] mr-[0.9rem] text-base ${currentSort === type ? "" : "text-gray-medium"}`} onClick={() => handleSortChange(type)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
};

export default SortButtons;
