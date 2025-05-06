import ModalLayout from "./ModalLayout";
import { ProposalCancellationModalProps } from "@/types/proposalType";
import { useCancelProposal } from "@/hooks/useProposal";

const ProposalCancellationModal = ({ proposal, onClose }: ProposalCancellationModalProps) => {
  const cancelMutation = useCancelProposal();

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id);
    onClose(); // 성공 시 모달 닫기
  };

  return (
    <ModalLayout onClose={onClose}>
      <div className="flex flex-col gap-4 w-full items-center">
        <h1 className="text-[20px]">{proposal.meetup_name}</h1>
        <p className="text-[14px]">신청을 취소할까요?</p>
        <div className="flex flex-col gap-2 w-full">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-[13px]">
            아니요
          </button>
          <button onClick={handleProposalCancel} disabled={cancelMutation.isPending} className="px-4 py-2 bg-[#FBFFA9] rounded-lg text-[13px]">
            {cancelMutation.isPending ? "취소 중..." : "네"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalCancellationModal;
