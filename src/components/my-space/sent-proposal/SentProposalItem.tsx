"use client";

import ProposalCancellationModal from "@/components/modals/ProposalCancellationModal";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { FaUser, FaUserCheck, FaUserTimes, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import ProposalDeletionModal from "@/components/modals/ProposalDeletionModal";
import { SentProposalItemProps } from "@/types/proposalType";

const SentProposalItem = ({ proposal, isModalOpen, modalType, onModalOpen, onModalClose }: SentProposalItemProps) => {
  const handleCancellationModalOpen = () => {
    onModalOpen(proposal.id, "cancellation");
  };

  const handleProposalDelete = () => {
    onModalOpen(proposal.id, "deletion");
  };

  return (
    <div className="flex flex-row items-center gap-4 rounded-xl justify-between py-4 px-6 bg-[#FEFFEC] shadow-md ">
      <div className="px-1">
        {proposal.status === "pending" ? (
          <div className="flex flex-col items-center text-[#C0C0C0]">
            <div className="text-[24px]">
              <FaUser />
            </div>
            <div className="text-[10px] whitespace-nowrap">대기중</div>
          </div>
        ) : proposal.status === "acceptance" ? (
          <div className="flex flex-col items-center text-[#028AB3]">
            <div className="text-[26px]">
              <FaUserCheck />
            </div>
            <div className="text-[10px] whitespace-nowrap">수락됨</div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-[#F9617A]">
            <div className="text-[26px]">
              <FaUserTimes />
            </div>
            <div className="text-[10px] whitespace-nowrap">거절됨</div>
          </div>
        )}
      </div>
      <div className="w-[400px]">
        <div className="text-[20px] font-semibold">{proposal.meetup_name}</div> {/* 광고제목으로 바꿔야 함 */}
        <div className="text-[13px]">
          {proposal.text}&nbsp;&nbsp;
          <span className="text-[#B7B7B7]">{transformCreatedDate(proposal.created_at)}</span>
        </div>
      </div>
      <div className="flex gap-6 text-[20px] text-[#868282]">
        <button onClick={handleCancellationModalOpen}>
          <FaTimesCircle />
        </button>
        {isModalOpen && modalType === "cancellation" && <ProposalCancellationModal proposal={proposal} onClose={onModalClose} />}
        <button onClick={handleProposalDelete}>
          <FaTrashAlt />
        </button>
        {isModalOpen && modalType === "deletion" && <ProposalDeletionModal proposal={proposal} onClose={onModalClose} />}
      </div>
    </div>
  );
};

export default SentProposalItem;
