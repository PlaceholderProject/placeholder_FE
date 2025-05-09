"use client";

import { createProposal } from "@/services/proposal.service";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import { ProposalPostcardProps } from "@/types/proposalType";

const ProposalPostcard = ({ meetupId, onClose }: ProposalPostcardProps) => {
  const [proposalText, setProposalText] = useState("");

  const handleProposalText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProposalText(event.target.value);
  };

  const handleProposalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createProposal(proposalText, meetupId);
      onClose(); // 신청 성공 시 모달 닫기
    } catch (error) {
      console.error("신청서 제출 실패:", error);
    }
  };

  return (
    <ModalLayout onClose={onClose}>
      <div className="rounded-3xl flex flex-col justify-center items-center w-full">
        <h1 className="pb-8 text-[15px]">모임참여 신청하기</h1>
        <form onSubmit={handleProposalSubmit} className=" flex flex-col items-center w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="proposal" className="text-[13px]">
              방장에게 할말
            </label>
            <input type="text" id="proposal" value={proposalText} onChange={handleProposalText} className="border-[1px] rounded-md p-2" />
          </div>
          <button type="submit" className="bg-[#FBFFA9] w-[130px] mt-6 p-1 rounded-lg text-[13px]">
            신청하기
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default ProposalPostcard;
