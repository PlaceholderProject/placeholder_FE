"use client";

import { useSentProposal } from "@/hooks/useProposal";
import { useState } from "react";
import SentProposalItem from "./SentProposalItem";
import { SentProposal } from "@/types/proposalType";
import { PROPOSALS_BUTTONS_PER_GROUP, PROPOSALS_SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import Spinner from "@/components/common/Spinner";
import MySpaceEmptyState from "../MySpaceEmptyState";

const SentProposals = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSentProposal(page);

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

  if (isLoading) return <Spinner isLoading={isLoading} />;

  if (!sentProposals || sentProposals.length === 0) {
    return <MySpaceEmptyState title="아직 보낸 가입 신청이 없어요" description="마음에 드는 모임을 찾아 가입 신청을 보내보세요." actionHref="/" actionLabel="모임 둘러보기" />;
  }

  return (
    <div className="space-y-[1.2rem]">
      <ul className="flex flex-col gap-[0.8rem]">
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
