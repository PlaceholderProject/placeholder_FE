import { SortType } from "@/types/meetupType";
import React from "react";
import { IconType } from "react-icons";
import { FaFire, FaRegClock, FaHourglassHalf } from "react-icons/fa";
import SegmentedIndicator from "../common/SegmentedIndicator";

const SORT_BUTTONS: { type: SortType; label: string; icon: IconType }[] = [
  { type: "like", label: "인기순", icon: FaFire },
  { type: "latest", label: "최신순", icon: FaRegClock },
  { type: "deadline", label: "마감임박", icon: FaHourglassHalf },
];

const SortButtons = ({ currentSort, handleSortChange, showLabels = false }: { currentSort: SortType; handleSortChange: (NewSortType: SortType) => void; showLabels?: boolean }) => {
  const activeSortIndex = SORT_BUTTONS.findIndex(item => item.type === currentSort);

  return (
    <div className="border-border bg-card relative grid shrink-0 grid-cols-3 rounded-[1.3rem] border p-[0.3rem] shadow-[0_1rem_3rem_-2.4rem_rgba(24,23,29,0.4)]">
      <SegmentedIndicator count={SORT_BUTTONS.length} index={activeSortIndex} className="bg-primary-soft rounded-[1rem]" />
      {SORT_BUTTONS.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => handleSortChange(type)}
          title={label}
          aria-label={label}
          className={`relative z-10 flex items-center justify-center gap-[0.4rem] rounded-[1rem] px-[1.1rem] py-[0.65rem] text-sm font-bold transition-colors duration-200 ${
            currentSort === type ? "text-primary-soft-foreground" : "text-muted-foreground hover:text-foreground"
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
