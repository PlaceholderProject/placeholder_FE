import ModalLayout from "./ModalLayout";
import { ProposalCancellationModalProps } from "@/types/proposalType";
import { useCancelProposal } from "@/hooks/useProposal";

const ProposalCancellationModal = ({ meetupId, proposal, onClose, title }: ProposalCancellationModalProps) => {
  const cancelMutation = useCancelProposal(meetupId);

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id);
    onClose(); // 성공 시 모달 닫기
  };

  return (
    <ModalLayout onClose={onClose}>
      <div className="flex w-[90%] flex-col items-center gap-[1.5rem]">
        <h1 className="text-lg font-bold">{title}</h1>
        <p>신청을 취소할까요?</p>
        <div className="flex w-full flex-col gap-[1rem]">
          <button onClick={onClose} className="bg-gray-light h-[4rem] rounded-[1rem]">
            아니요
          </button>
          <button onClick={handleProposalCancel} disabled={cancelMutation.isPending} className="bg-secondary-dark h-[4rem] rounded-[1rem]">
            {cancelMutation.isPending ? "취소 중..." : "네"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalCancellationModal;
