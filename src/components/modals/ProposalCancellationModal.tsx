import { toggleProposalCancellationModal } from "@/stores/modalSlice";
import { useDispatch } from "react-redux";
import ModalLayout from "./ModalLayout";
import { SentProposal } from "@/types/proposalType";
import { useCancelProposal } from "@/hooks/useProposal";

const ProposalCancellationModal = ({ proposal }: { proposal: SentProposal }) => {
  const dispatch = useDispatch();
  const cancelMutation = useCancelProposal();

  const handleClose = () => {
    dispatch(toggleProposalCancellationModal());
  };

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id);
  };

  return (
    <ModalLayout onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h1>{proposal.meetup_name}</h1>
        <p>신청을 취소할까요?</p>
        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
            아니요
          </button>
          <button onClick={handleProposalCancel} disabled={cancelMutation.isPending} className="px-4 py-2 bg-red-500 text-white rounded">
            {cancelMutation.isPending ? "취소 중..." : "네"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalCancellationModal;
