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
        <div className="text-[20px] font-semibold">{proposal.meetup_ad_title}</div>
        <div className="text-[13px]">
          {proposal.text}&nbsp;&nbsp;
          <span className="text-[#B7B7B7]">{transformCreatedDate(proposal.created_at)}</span>
        </div>
      </div>
      <div className="flex gap-6 text-[15px] text-white whitespace-nowrap">
        <button onClick={handleCancellationModalOpen} className="bg-[#F9617A] p-2 rounded-lg">
          취소
          {/* <FaTimesCircle /> */}
        </button>
        <button onClick={handleProposalDelete} className="bg-[#868282] p-2 rounded-lg">
          숨기기
          {/* <FaTrashAlt /> */}
        </button>
      </div>
      {isModalOpen && modalType === "cancellation" && <ProposalCancellationModal proposal={proposal} onClose={onModalClose} />}
      {isModalOpen && modalType === "deletion" && <ProposalDeletionModal proposal={proposal} onClose={onModalClose} />}
    </div>
  );
};

export default SentProposalItem;
