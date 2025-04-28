"use client";

import { useSentProposal } from "@/hooks/useProposal";
import React from "react";
import SentProposalItem from "./SentProposalItem";
import { Proposal } from "@/types/proposalType";

const SentProposals = () => {
  const { data: proposals, isLoading } = useSentProposal();

  if (isLoading) return <div>로딩중</div>;
  console.log(proposals);
  return (
    <ul>
      {proposals.map((proposal: Proposal) => (
        <li key={proposal.id}>
          <SentProposalItem proposal={proposal} />
        </li>
      ))}
    </ul>
  );
};

export default SentProposals;
