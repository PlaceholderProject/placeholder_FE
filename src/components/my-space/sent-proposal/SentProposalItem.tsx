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
    <div className="flex flex-row items-center gap-5 border-2 rounded-xl justify-between p-4 ">
      <div>
        {proposal.status === "pending" ? (
          <div>
            <FaUser />
            대기중
          </div>
        ) : proposal.status === "acceptance" ? (
          <div>
            <FaUserCheck />
            수락됨
          </div>
        ) : (
          <div>
            <FaUserTimes />
            거절됨
          </div>
        )}
      </div>
      <div className="w-[400px]">
        <div>{proposal.meetup_name}</div>
        <div>
          {proposal.text}
          <span>{transformCreatedDate(proposal.created_at)}</span>
        </div>
      </div>
      <div className="flex gap-4">
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
