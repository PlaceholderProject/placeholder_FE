"use client";

import { createProposal } from "@/services/proposal.service";
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";

const ProposalPostcardContent = ({ meetupId }: { meetupId: number }) => {
  const { closeModal } = useModal();
  const [proposalText, setProposalText] = useState("");

  const handleProposalText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProposalText(event.target.value);
  };

  const handleProposalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createProposal(proposalText, meetupId);
      closeModal(); // 신청 성공 시 모달 닫기
    } catch (error) {
      console.error("신청서 제출 실패:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-3xl">
      <h1 className="pb-8 text-[15px]">모임참여 신청하기</h1>
      <form onSubmit={handleProposalSubmit} className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col">
          <label htmlFor="proposal" className="text-[13px]">
            방장에게 할말
          </label>
          <input type="text" id="proposal" value={proposalText} onChange={handleProposalText} className="rounded-md border-[1px] p-2" />
        </div>
        <button type="submit" className="mt-6 w-[130px] rounded-lg bg-[#FBFFA9] p-1 text-[13px]">
          신청하기
        </button>
      </form>
    </div>
  );
};

export default ProposalPostcardContent;
