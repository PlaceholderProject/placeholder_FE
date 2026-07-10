import { PaginationButtonProps } from "@/types/paginationType";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const PaginationButtons = ({ page, startPage, endPage, hasPreviousGroup, hasNextGroup, onPageButtonClick, onPreviousGroupButtonClick, onNextGroupButtonClick }: PaginationButtonProps) => {
  const pages = Array.from({ length: Math.max(endPage - startPage + 1, 0) }, (_, index) => startPage + index);

  if (pages.length === 0) return null;

  return (
    <nav aria-label="페이지 탐색" className="mt-[2.4rem] flex justify-center">
      <div className="border-border bg-card inline-flex items-center gap-[0.25rem] rounded-full border p-[0.4rem] shadow-[0_1.2rem_2.6rem_-2.2rem_rgba(24,23,29,0.3)]">
        <button
          type="button"
          onClick={onPreviousGroupButtonClick}
          disabled={!hasPreviousGroup}
          aria-label="이전 페이지 그룹"
          className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-25"
        >
          <LuChevronLeft className="h-[1.7rem] w-[1.7rem] stroke-[2]" />
        </button>

        {pages.map(pageNumber => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageButtonClick(pageNumber)}
            aria-current={page === pageNumber ? "page" : undefined}
            aria-label={`${pageNumber}페이지`}
            className={`grid h-[3.6rem] min-w-[3.6rem] place-items-center rounded-full px-[0.8rem] text-sm font-bold tabular-nums transition-colors ${
              page === pageNumber ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={onNextGroupButtonClick}
          disabled={!hasNextGroup}
          aria-label="다음 페이지 그룹"
          className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-25"
        >
          <LuChevronRight className="h-[1.7rem] w-[1.7rem] stroke-[2]" />
        </button>
      </div>
    </nav>
  );
};

export default PaginationButtons;
