"use client";

import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { FaUser, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { SentProposal } from "@/types/proposalType";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

const SentProposalItem = ({ proposal }: { proposal: SentProposal }) => {
  const { openModal } = useModal();

  const handleCancellationModalOpen = () => {
    openModal("PROPOSAL_CANCELLATION", { proposal });
  };

  const handleProposalHide = () => {
    openModal("PROPOSAL_HIDE", { proposal });
  };

  console.log(proposal);

  return (
    <div className="flex flex-col items-center justify-between gap-[0.5rem] rounded-[1rem] bg-secondary-light p-[1.5rem] shadow-md">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-[1rem]">
          <div className="px-1">
            {proposal.status === "pending" ? (
              <div className="flex flex-col items-center text-gray-dark">
                <div className="text-2xl">
                  <FaUser />
                </div>
                <div className="whitespace-nowrap text-xs">대기중</div>
              </div>
            ) : proposal.status === "acceptance" ? (
              <div className="flex flex-col items-center text-[#028AB3]">
                <div className="text-[2.2rem]">
                  <FaUserCheck />
                </div>
                <div className="h-fil whitespace-nowrap text-xs leading-5">수락됨</div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#F9617A]">
                <div className="text-[2.2rem]">
                  <FaUserTimes />
                </div>
                <div className="whitespace-nowrap text-xs leading-5">거절됨</div>
              </div>
            )}
          </div>
          <Link href={`/ad/${proposal.meetup_id}`}>
            <div className="break-all font-semibold">{proposal.meetup_ad_title}</div>
          </Link>
        </div>
        <span className="text-sm text-gray-dark">{transformCreatedDate(proposal.created_at)}</span>
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-[1rem]">
        <div className="break-all">{proposal.text}&nbsp;&nbsp;</div>
        <div className="flex gap-[1rem] whitespace-nowrap text-white">
          <button onClick={handleCancellationModalOpen} className="h-fil rounded-[0.5rem] bg-warning p-[0.5rem] text-sm font-bold">
            취소
          </button>
          <button onClick={handleProposalHide} className="rounded-[0.5rem] bg-gray-dark p-[0.5rem] text-sm font-bold">
            숨기기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentProposalItem;
