import { useHideProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";
import { SentProposal } from "@/types/proposalType";

const ProposalHideContent = ({ proposal }: { proposal: SentProposal }) => {
  const { closeModal } = useModal();
  const hideMutation = useHideProposal();

  const handleProposalHide = () => {
    hideMutation.mutate(proposal.id);
    closeModal(); // 작업 완료 후 모달 닫기
  };

  return (
    <div className="flex w-[90%] flex-col items-center gap-[1.5rem]">
      <h2 className="text-lg font-bold">{proposal.meetup_ad_title}</h2>
      <p>신청서를 숨길까요?</p>
      <div className="flex w-full flex-col items-center text-gray-dark">
        <div>신청은 유지됩니다.</div>
        <div className="flex items-center justify-center">
          취소를 원하시면 &nbsp; <span className="h-fil rounded-[0.5rem] bg-warning px-[0.5rem] py-[0.2rem] text-sm font-bold text-white">취소</span>를 눌러주세요.
        </div>
      </div>
      <div className="flex w-full flex-col gap-[1rem]">
        <button onClick={closeModal} className="h-[4rem] rounded-[1rem] bg-gray-light">
          아니요
        </button>
        <button onClick={handleProposalHide} className="h-[4rem] rounded-[1rem] bg-secondary-dark">
          숨기기
        </button>
      </div>
    </div>
  );
};

export default ProposalHideContent;
