import { useCancelProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";
import { SentProposal } from "@/types/proposalType";
import { useParams } from "next/navigation";

const ProposalCancellationContent = ({ proposal }: { proposal: SentProposal }) => {
  const { closeModal } = useModal();
  const { meetupId } = useParams();

  const cancelMutation = useCancelProposal(Number(meetupId));

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id);
    closeModal(); // 성공 시 모달 닫기
  };

  return (
    <div className="flex w-[90%] flex-col items-center gap-[1.5rem]">
      <h1 className="text-lg font-bold">{proposal.meetup_ad_title}</h1>
      <p>신청을 취소할까요?</p>
      <div className="flex w-full flex-col gap-[1rem]">
        <button onClick={closeModal} className="h-[4rem] rounded-[1rem] bg-gray-light">
          아니요
        </button>
        <button onClick={handleProposalCancel} disabled={cancelMutation.isPending} className="h-[4rem] rounded-[1rem] bg-secondary-dark">
          {cancelMutation.isPending ? "취소 중..." : "네"}
        </button>
      </div>
    </div>
  );
};

export default ProposalCancellationContent;
