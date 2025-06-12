import { PaginationButtonProps } from "@/types/paginationType";
import React from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const PaginationButtons: React.FC<PaginationButtonProps> = ({ page, startPage, endPage, hasPreviousGroup, hasNextGroup, onPageButtonClick, onPreviousGroupButtonClick, onNextGroupButtonClick }) => {
  // 페이지 버튼 생성
  const renderPageButtons = () => {
    const buttons = [];

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => onPageButtonClick(i)} className={`mx-1 px-3 py-1 ${page === i ? "font-bold bg-gray-200 rounded" : ""}`}>
          {i}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center mt-4 space-x-1">
        {/* 이전 그룹 버튼 */}
        <button onClick={onPreviousGroupButtonClick} disabled={!hasPreviousGroup} className={`px-3 py-1 ${!hasPreviousGroup ? "text-gray-300 cursor-not-allowed" : ""}`}>
          <FaArrowAltCircleLeft />
        </button>

        {/* 페이지 버튼 영역 */}
        <div className="flex justify-center space-x-1 min-w-[180px]">{renderPageButtons()}</div>

        {/* 다음 그룹 버튼 */}
        <button onClick={onNextGroupButtonClick} disabled={!hasNextGroup} className={`px-3 py-1 ${!hasNextGroup ? "text-gray-300 cursor-not-allowed" : ""}`}>
          <FaArrowAltCircleRight />
        </button>
      </div>
    </>
  );
};

export default PaginationButtons;
