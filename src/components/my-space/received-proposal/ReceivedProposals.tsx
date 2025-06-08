"use client";

import { useProposalsByMeetupId } from "@/hooks/useProposal";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import ReceivedProposalItem from "./ReceivedProposalItem";
import { ReceivedProposal } from "@/types/proposalType";

const ReceivedProposals = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);

  const { data, isLoading, isError, error } = useProposalsByMeetupId(selectedMeetupId!);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;

  const receivedProposals = data?.filter((proposal: ReceivedProposal) => proposal.status === "pending");

  if (!receivedProposals || receivedProposals.length === 0) {
    return <p className="mt-24 flex justify-center">받은 신청서가 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-[1.5rem] px-[2rem]">
      {receivedProposals.map((proposal: ReceivedProposal) => (
        <li key={proposal.id}>
          <ReceivedProposalItem proposal={proposal} />
        </li>
      ))}
    </ul>
  );
};

export default ReceivedProposals;
