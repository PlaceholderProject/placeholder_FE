"use client";

import { useSentProposal } from "@/hooks/useProposal";
import React, { useState } from "react";
import SentProposalItem from "./SentProposalItem";
import { SentProposal } from "@/types/proposalType";

const SentProposals = () => {
  const { data: sentProposals, isLoading } = useSentProposal();
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"cancellation" | "deletion" | null>(null);

  if (isLoading) return <div>로딩중</div>;

  const handleModalOpen = (proposalId: number, type: "cancellation" | "deletion") => {
    setSelectedProposalId(proposalId);
    setModalType(type);
  };

  const handleModalClose = () => {
    setSelectedProposalId(null);
    setModalType(null);
  };

  if (!sentProposals || sentProposals.length === 0) {
    return <p className="flex justify-center mt-24">보낸 신청서가 없습니다.</p>;
  }

  return (
    <ul className="p-5 flex flex-col gap-5 mt-6">
      {sentProposals.map((proposal: SentProposal) => (
        <li key={proposal.id}>
          <SentProposalItem proposal={proposal} isModalOpen={selectedProposalId === proposal.id} modalType={modalType} onModalOpen={handleModalOpen} onModalClose={handleModalClose} />
        </li>
      ))}
    </ul>
  );
};

export default SentProposals;
