import ModalLayout from "./ModalLayout";
import { ProposalCancellationModalProps } from "@/types/proposalType";
import { useCancelProposal } from "@/hooks/useProposal";

const ProposalCancellationModal = ({ meetupId, proposal, onClose }: ProposalCancellationModalProps) => {
  const cancelMutation = useCancelProposal(meetupId);

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id);
    onClose(); // 성공 시 모달 닫기
  };

  return (
    <ModalLayout onClose={onClose}>
      <div className="flex w-full flex-col items-center gap-4">
        <h1 className="text-[20px]">{proposal.meetup_name}</h1>
        <p className="text-[14px]">신청을 취소할까요?</p>
        <div className="flex w-full flex-col gap-2">
          <button onClick={onClose} className="rounded-lg bg-gray-300 px-4 py-2">
            아니요
          </button>
          <button onClick={handleProposalCancel} disabled={cancelMutation.isPending} className="rounded-lg bg-[#FBFFA9] px-4 py-2 text-[13px]">
            {cancelMutation.isPending ? "취소 중..." : "네"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalCancellationModal;
