import React from "react";

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// 가로 스크롤되는 필터 알약 버튼 (활성 시 foreground 채움)
const FilterPill = ({ active, onClick, children }: FilterPillProps) => {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-[1.4rem] py-[0.6rem] text-sm transition-all duration-150 ${
        active ? "bg-foreground text-background border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
};

export default FilterPill;
