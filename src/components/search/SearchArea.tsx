"use client";

import ProposalPostcard from "@/components/modals/ProposalPostcard";
import React, { useState } from "react";

const SearchArea = () => {
  // 추후 모달 RTK로 변경
  const [isOpen, setIsOpen] = useState(false);
  // AdButton로 이동
  const handleProposalModal = () => {
    setIsOpen(!isOpen);
  };

  console.log(isOpen);

  return (
    <div>
      searchArea
      <button onClick={handleProposalModal} className="bg-slate-300">
        신청하기
      </button>
      {isOpen && <ProposalPostcard />}
    </div>
  );
};

export default SearchArea;
