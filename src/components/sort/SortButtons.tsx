import { SortType } from "@/types/meetupType";
import React from "react";
import { IconType } from "react-icons";
import { FaFire, FaRegClock, FaHourglassHalf } from "react-icons/fa";

const SORT_BUTTONS: { type: SortType; label: string; icon: IconType }[] = [
  { type: "like", label: "인기순", icon: FaFire },
  { type: "latest", label: "최신순", icon: FaRegClock },
  { type: "deadline", label: "마감임박", icon: FaHourglassHalf },
];

const SortButtons = ({ currentSort, handleSortChange, showLabels = false }: { currentSort: SortType; handleSortChange: (NewSortType: SortType) => void; showLabels?: boolean }) => {
  return (
    <div className="border-border bg-card flex shrink-0 rounded-full border p-[0.3rem]">
      {SORT_BUTTONS.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => handleSortChange(type)}
          title={label}
          aria-label={label}
          className={`flex items-center gap-[0.4rem] rounded-full px-[1.1rem] py-[0.5rem] text-sm transition ${
            currentSort === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="text-[1.2rem]" />
          <span className={showLabels ? "inline" : "hidden sm:inline"}>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SortButtons;
