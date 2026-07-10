"use client";

import { useProposalsByMeetupId } from "@/hooks/useProposal";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import ReceivedProposalItem from "./ReceivedProposalItem";
import { ReceivedProposal } from "@/types/proposalType";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons";
import { PROPOSALS_BUTTONS_PER_GROUP, PROPOSALS_SIZE_LIMIT } from "@/constants/pagination";
import Spinner from "@/components/common/Spinner";
import MySpaceEmptyState from "../MySpaceEmptyState";

const ReceivedProposals = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeetupId);

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

  if (!selectedMeetupId) return null;
  if (isLoading) return <Spinner isLoading={isLoading} />;
  if (isError) {
    return (
      <div className="border-error/20 bg-error/5 text-error rounded-[1.6rem] border px-[1.4rem] py-[2.4rem] text-center text-sm font-medium">{error.message || "가입 신청을 불러오지 못했어요."}</div>
    );
  }

  // const receivedProposals = data?.filter((proposal: ReceivedProposal) => proposal.status === "pending");

  if (!receivedProposals || receivedProposals.length === 0) {
    return (
      <MySpaceEmptyState
        title="새로 도착한 가입 신청이 없어요"
        description="신청이 도착하면 여기에서 확인하고 멤버 참여를 결정할 수 있어요."
        actionHref="/my-space/my-ad"
        actionLabel="모집 관리 보기"
      />
    );
  }

  return (
    <div className="space-y-[1.2rem]">
      <ul className="flex flex-col gap-[0.8rem]">
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
