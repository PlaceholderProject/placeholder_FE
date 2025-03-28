"use client";

import { createProposal } from "@/services/proposal.service";
import React, { useState } from "react";

const ProposalPostcard = ({ meetupId }: { meetupId: number }) => {
  const [proposalText, setProposalText] = useState("");

  const handleProposalText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProposalText(e.target.value);
  };

  const handleProposalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createProposal(proposalText, meetupId); // meetupId 보내야줘야함
    // console.log(proposalText);
  };

  return (
    <div className="bg-red-100 w-[280px] h-[287px] rounded-3xl flex flex-col justify-center items-center">
      <h1>모임참여 신청하기</h1>
      <form onSubmit={handleProposalSubmit}>
        <div className="flex flex-col">
          <label htmlFor="proposal">방장에게 할말</label>
          <input type="text" value={proposalText} onChange={handleProposalText} />
        </div>

        <button type="submit">신청하기</button>
      </form>
    </div>
  );
};

export default ProposalPostcard;
