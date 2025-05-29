import { FaTimesCircle } from "react-icons/fa";
import ModalLayout from "./ModalLayout";
import { useHideProposal } from "@/hooks/useProposal";
import { ProposalHideModalProps } from "@/types/proposalType";

const ProposalHideModal = ({ proposal, onClose }: ProposalHideModalProps) => {
  const hideMutation = useHideProposal();
  const handleProposalHide = () => {
    hideMutation.mutate(proposal.id);
    onClose(); // 작업 완료 후 모달 닫기
  };
  return (
    <ModalLayout onClose={onClose}>
      <div className="flex w-full flex-col items-center gap-[1.5rem]">
        <h2 className="text-lg font-bold">{proposal.meetup_ad_title}</h2>
        <div>신청서를 숨길까요?</div>
        <div className="text-gray-dark flex w-full flex-col items-center">
          <div>신청은 유지됩니다.</div>
          <div className="flex items-center justify-center">
            취소를 원하시면 &nbsp; <span className="bg-warning h-fil rounded-[0.5rem] px-[0.5rem] py-[0.2rem] text-sm font-bold text-white">취소</span>를 눌러주세요.
          </div>
        </div>
        <div className="flex w-full flex-col gap-[1rem]">
          <button onClick={onClose} className="bg-gray-light h-[4rem] rounded-[1rem]">
            아니요
          </button>
          <button onClick={handleProposalHide} className="bg-secondary-dark h-[4rem] rounded-[1rem]">
            숨기기
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalHideModal;
