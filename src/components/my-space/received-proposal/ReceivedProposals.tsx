"use client";

import { useProposalsByMeetupId } from "@/hooks/useProposal";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import ReceivedProposalItem from "./ReceivedProposalItem";
import { ReceivedProposal } from "@/types/proposalType";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons";
import { PROPOSALS_BUTTONS_PER_GROUP, PROPOSALS_SIZE_LIMIT } from "@/constants/pagination";

const ReceivedProposals = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);

  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useProposalsByMeetupId(selectedMeetupId!, page);

  useEffect(() => {
    setPage(1);
  }, [selectedMeetupId]);

  const receivedProposals = data ? data.proposals.filter((proposal: ReceivedProposal) => proposal.status === "pending") : [];
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

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;

  // const receivedProposals = data?.filter((proposal: ReceivedProposal) => proposal.status === "pending");

  if (!receivedProposals || receivedProposals.length === 0) {
    return <p className="mt-24 flex justify-center">받은 신청서가 없습니다.</p>;
  }

  return (
    <div className="mb-[6rem] flex flex-col items-center gap-[3rem]">
      <ul className="flex w-[90%] flex-col gap-[1.5rem] md:max-w-[80rem]">
        {receivedProposals.map((proposal: ReceivedProposal) => (
          <li key={proposal.id}>
            <ReceivedProposalItem proposal={proposal} />
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

export default ReceivedProposals;
