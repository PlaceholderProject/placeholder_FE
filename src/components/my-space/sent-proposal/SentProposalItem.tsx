"use client";

import ProposalCancellationModal from "@/components/modals/ProposalCancellationModal";
import { Proposal } from "@/types/proposalType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { FaUser, FaUserCheck, FaUserTimes, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleProposalCancellationModal, toggleProposalDeletionModal } from "@/stores/modalSlice";
import ProposalDeletionModal from "@/components/modals/ProposalDeletionModal";

const SentProposalItem = ({ proposal }: { proposal: Proposal }) => {
  const { isProposalCancellationModalOpen, isProposalDeletionModalOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const handleCancellationModalOpen = () => {
    dispatch(toggleProposalCancellationModal());
  };

  const handleProposalDelete = () => {
    dispatch(toggleProposalDeletionModal());
  };

  return (
    <div className="flex flex-row gap-5 bg-red-50">
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
      <div>
        <div>{proposal.meetup_name}</div>
        <div>
          {proposal.text}
          <span>{transformCreatedDate(proposal.created_at)}</span>
        </div>
      </div>

      <button onClick={handleCancellationModalOpen}>
        <FaTimesCircle />
      </button>
      {isProposalCancellationModalOpen && <ProposalCancellationModal />}
      <button onClick={handleProposalDelete}>
        <FaTrashAlt />
      </button>
      {isProposalDeletionModalOpen && <ProposalDeletionModal />}
    </div>
  );
};

export default SentProposalItem;
