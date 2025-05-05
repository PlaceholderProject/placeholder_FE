"use client";

import ProposalCancellationModal from "@/components/modals/ProposalCancellationModal";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { FaUser, FaUserCheck, FaUserTimes, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleProposalCancellationModal, toggleProposalDeletionModal } from "@/stores/modalSlice";
import ProposalDeletionModal from "@/components/modals/ProposalDeletionModal";
import { SentProposal } from "@/types/proposalType";

const SentProposalItem = ({ proposal }: { proposal: SentProposal }) => {
  const { isProposalCancellationModalOpen, isProposalDeletionModalOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const handleCancellationModalOpen = () => {
    dispatch(toggleProposalCancellationModal());
  };

  const handleProposalDelete = () => {
    dispatch(toggleProposalDeletionModal());
  };

  console.log(proposal);

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
        {isProposalCancellationModalOpen && <ProposalCancellationModal proposal={proposal} />}
        <button onClick={handleProposalDelete}>
          <FaTrashAlt />
        </button>
        {isProposalDeletionModalOpen && <ProposalDeletionModal proposal={proposal} />}
      </div>
    </div>
  );
};

export default SentProposalItem;
