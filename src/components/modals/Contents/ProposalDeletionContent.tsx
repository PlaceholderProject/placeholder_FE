import { FaTimesCircle } from "react-icons/fa";
import { useHideProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";
import { SentProposal } from "@/types/proposalType";

const ProposalDeletionContent = ({ proposal }: { proposal: SentProposal }) => {
  const { closeModal } = useModal();
  const hideMutation = useHideProposal();

  const handleProposalHide = () => {
    hideMutation.mutate(proposal.id);
    closeModal(); // 작업 완료 후 모달 닫기
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="text-[20px]">{proposal.meetup_name}</h2>
      <div className="text-[14px]">신청서를 숨길까요?</div>
      <div className="flex w-full flex-col items-center text-[13px] text-[#949394]">
        <div>신청은 유지됩니다.</div>
        <div className="flex w-full items-center justify-center">
          취소를 원하시면 &nbsp; <FaTimesCircle />를 눌러주세요.
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <button onClick={closeModal} className="rounded-lg bg-gray-300 px-4 py-2 text-[13px]">
          아니요
        </button>
        <button onClick={handleProposalHide} className="rounded-lg bg-[#FBFFA9] px-4 py-2 text-[13px]">
          숨기기
        </button>
      </div>
    </div>
  );
};

export default ProposalDeletionContent;
