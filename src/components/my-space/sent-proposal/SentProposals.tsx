"use client";

import { useSentProposal } from "@/hooks/useProposal";
import { useState } from "react";
import SentProposalItem from "./SentProposalItem";
import { SentProposal } from "@/types/proposalType";
import { PROPOSALS_BUTTONS_PER_GROUP, PROPOSALS_SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";

const SentProposals = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSentProposal(page);

  console.log(data);

  const sentProposals = data ? data.proposals : [];
  const total = data ? data.total : 0;

  const totalPages = Math.ceil(total / PROPOSALS_SIZE_LIMIT);
  const currentGroup = Math.ceil(page / PROPOSALS_BUTTONS_PER_GROUP);
  const startPage = (currentGroup - 1) * PROPOSALS_BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(startPage + PROPOSALS_BUTTONS_PER_GROUP - 1, totalPages);
  const hasPreviousGroup = startPage > 1;
  const hasNextGroup = endPage < totalPages;

  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };

  const handlePreviousGroupButtonClick = () => {
    const previousGroupStartPage = startPage - PROPOSALS_BUTTONS_PER_GROUP;
    setPage(previousGroupStartPage);
  };

  const handleNextGroupButtonClick = () => {
    const nextGroupStartPage = endPage + 1;
    setPage(nextGroupStartPage);
  };

  if (isLoading) return <div>로딩중</div>;

  if (!sentProposals || sentProposals.length === 0) {
    return <p className="mt-24 flex justify-center">보낸 신청서가 없습니다.</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <ul className="flex w-[90%] flex-col gap-[1.5rem] py-[3rem] md:max-w-[80rem]">
        {sentProposals.map((proposal: SentProposal) => (
          <li key={proposal.id}>
            <SentProposalItem proposal={proposal} />
          </li>
        ))}
      </ul>
      {totalPages > 0 && (
        <PaginationButtons
          page={page}
          startPage={startPage}
          endPage={endPage}
          hasPreviousGroup={hasPreviousGroup}
          hasNextGroup={hasNextGroup}
          onPageButtonClick={handlePageButtonClick}
          onPreviousGroupButtonClick={handlePreviousGroupButtonClick}
          onNextGroupButtonClick={handleNextGroupButtonClick}
        />
      )}
    </div>
  );
};

export default SentProposals;
