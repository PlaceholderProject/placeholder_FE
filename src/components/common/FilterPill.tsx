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
      className={`inline-flex shrink-0 items-center gap-[0.45rem] rounded-full border px-[1.4rem] py-[0.75rem] text-sm font-bold transition-all duration-150 ${
        active
          ? "bg-primary text-primary-foreground border-transparent shadow-[0_0.8rem_2rem_-1.2rem_rgba(108,77,255,0.8)]"
          : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
};

export default FilterPill;
