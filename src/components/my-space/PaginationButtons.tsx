import { PaginationButtonProps } from "@/types/paginationType";
import React from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const PaginationButtons: React.FC<PaginationButtonProps> = ({ page, startPage, endPage, hasPreviousGroup, hasNextGroup, onPageButtonClick, onPreviousGroupButtonClick, onNextGroupButtonClick }) => {
  // 페이지 버튼 생성
  const renderPageButtons = () => {
    const buttons = [];

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => onPageButtonClick(i)} className={`mx-1 px-3 py-1 ${page === i ? "rounded bg-gray-200 font-bold" : ""}`}>
          {i}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="mt-4 flex flex-row items-center justify-center space-x-1">
        {/* 이전 그룹 버튼 */}
        <button onClick={onPreviousGroupButtonClick} disabled={!hasPreviousGroup} className={`px-3 py-1 ${!hasPreviousGroup ? "cursor-not-allowed text-gray-300" : ""}`}>
          <FaArrowAltCircleLeft />
        </button>

        {/* 페이지 버튼 영역 */}
        <div className="flex min-w-[180px] justify-center space-x-1">{renderPageButtons()}</div>

        {/* 다음 그룹 버튼 */}
        <button onClick={onNextGroupButtonClick} disabled={!hasNextGroup} className={`px-3 py-1 ${!hasNextGroup ? "cursor-not-allowed text-gray-300" : ""}`}>
          <FaArrowAltCircleRight />
        </button>
      </div>
    </>
  );
};

export default PaginationButtons;
