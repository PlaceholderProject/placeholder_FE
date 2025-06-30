"use client";

import React, { useState } from "react";
import { useCreateProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";

const ProposalPostcardContent = ({ meetupId }: { meetupId: number }) => {
  const { closeModal } = useModal();
  const [proposalText, setProposalText] = useState("");
  const [bioTextLength, setBioTextLength] = useState(0);
  const [messageWarning, setMessageWarning] = useState("");

  const { mutate } = useCreateProposal(meetupId);

  const handleProposalText = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 40) {
      setMessageWarning("할말은 최대 40자까지 작성이 가능합니다.");
      return;
    } else {
      setMessageWarning("");
    }
    setProposalText(event.target.value);
    setBioTextLength(event.target.value.length);
  };

  const handleProposalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      mutate(proposalText);
      closeModal(); // 성공 시 모달 닫기
    } catch (error) {
      console.error("신청서 제출 실패:", error);
    }
  };

  return (
    <div className="flex h-[25rem] w-full flex-col items-center justify-center">
      <h1 className="mb-[2rem] text-2xl font-semibold">모임참여 신청하기</h1>
      <form onSubmit={handleProposalSubmit} className="flex w-[90%] flex-col justify-center gap-[0.5rem]">
        <div className="flex w-full flex-col">
          <label htmlFor="proposal" className="mb-[0.3rem] text-lg">
            방장에게 할말
          </label>
          <input type="text" id="proposal" value={proposalText} onChange={handleProposalText} className="h-[4rem] rounded-[1rem] border-[0.1rem] border-gray-medium px-[1rem]" />
          {messageWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{messageWarning}</p>}
          <div className="flex w-full justify-end">
            <p className="mt-[0.3rem] text-sm">{bioTextLength}/40</p>
          </div>
        </div>
        <button type="submit" className="flex h-[4rem] items-center justify-center rounded-[1rem] bg-secondary-dark text-lg">
          신청하기
        </button>
      </form>
    </div>
  );
};

export default ProposalPostcardContent;
