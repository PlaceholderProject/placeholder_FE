"use client";

import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { FaUser, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { SentProposalItemProps } from "@/types/proposalType";
import { useModal } from "@/hooks/useModal";

const SentProposalItem = ({ proposal }: { proposal: SentProposalItemProps["proposal"] }) => {
  const { openModal } = useModal();

  const handleCancellationModalOpen = () => {
    openModal("PROPOSAL_CANCELLATION", { proposal });
  };

  const handleProposalDelete = () => {
    openModal("PROPOSAL_DELETION", { proposal });
  };

  return (
    <div className="flex flex-row items-center justify-between gap-4 rounded-xl bg-[#FEFFEC] px-6 py-4 shadow-md">
      <div className="px-1">
        {proposal.status === "pending" ? (
          <div className="flex flex-col items-center text-[#C0C0C0]">
            <div className="text-[24px]">
              <FaUser />
            </div>
            <div className="whitespace-nowrap text-[10px]">대기중</div>
          </div>
        ) : proposal.status === "acceptance" ? (
          <div className="flex flex-col items-center text-[#028AB3]">
            <div className="text-[26px]">
              <FaUserCheck />
            </div>
            <div className="whitespace-nowrap text-[10px]">수락됨</div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-[#F9617A]">
            <div className="text-[26px]">
              <FaUserTimes />
            </div>
            <div className="whitespace-nowrap text-[10px]">거절됨</div>
          </div>
        )}
      </div>
      <div className="w-[400px]">
        <div className="text-[20px] font-semibold">{proposal.meetup_ad_title}</div>
        <div className="text-[13px]">
          {proposal.text}&nbsp;&nbsp;
          <span className="text-[#B7B7B7]">{transformCreatedDate(proposal.created_at)}</span>
        </div>
      </div>
      <div className="flex gap-6 whitespace-nowrap text-[15px] text-white">
        <button onClick={handleCancellationModalOpen} className="rounded-lg bg-[#F9617A] p-2 transition-colors hover:bg-[#e55470]">
          취소
        </button>
        <button onClick={handleProposalDelete} className="rounded-lg bg-[#868282] p-2 transition-colors hover:bg-[#767070]">
          숨기기
        </button>
      </div>
    </div>
  );
};

export default SentProposalItem;
