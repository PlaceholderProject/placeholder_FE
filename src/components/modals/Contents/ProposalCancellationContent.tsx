import { useCancelProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";
import { SentProposal } from "@/types/proposalType";

const ProposalCancellationContent = ({ proposal }: { proposal: SentProposal }) => {
  const { closeModal } = useModal();
  const cancelMutation = useCancelProposal();

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id);
    closeModal(); // 성공 시 모달 닫기
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h1 className="text-[20px]">{proposal.meetup_name}</h1>
      <p className="text-[14px]">신청을 취소할까요?</p>
      <div className="flex w-full flex-col gap-2">
        <button onClick={closeModal} className="rounded-lg bg-gray-300 px-4 py-2 text-[13px]">
          아니요
        </button>
        <button onClick={handleProposalCancel} disabled={cancelMutation.isPending} className="rounded-lg bg-[#FBFFA9] px-4 py-2 text-[13px]">
          {cancelMutation.isPending ? "취소 중..." : "네"}
        </button>
      </div>
    </div>
  );
};

export default ProposalCancellationContent;
