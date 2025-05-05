"use client";

import { useSentProposal } from "@/hooks/useProposal";
import React from "react";
import SentProposalItem from "./SentProposalItem";
import { SentProposal } from "@/types/proposalType";

const SentProposals = () => {
  const { data: proposals, isLoading } = useSentProposal();

  if (isLoading) return <div>로딩중</div>;
  console.log("이거", proposals);
  return (
    <ul className="p-5 flex flex-col gap-3">
      {proposals.map((proposal: SentProposal) => (
        <li key={proposal.id}>
          <SentProposalItem proposal={proposal} />
        </li>
      ))}
    </ul>
  );
};

export default SentProposals;
