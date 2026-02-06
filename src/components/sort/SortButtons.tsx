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
      {}

      <div>
        {sortButtonsArray.map(({ type, label }) => (
          <button key={type} className={`mr-[0.9rem] mt-[1rem] text-base ${currentSort === type ? "" : "text-gray-medium"}`} onClick={() => handleSortChange(type)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
};

export default SortButtons;
