import { FaTimesCircle } from "react-icons/fa";
import ModalLayout from "./ModalLayout";
import { ProposalDeletionModalProps } from "@/types/proposalType";

const ProposalDeletionModal = ({ proposal, onClose }: ProposalDeletionModalProps) => {
  const handleProposalHide = () => {
    console.log(proposal);
    onClose(); // 작업 완료 후 모달 닫기
  };
  return (
    <ModalLayout onClose={onClose}>
      <div className="flex flex-col gap-4 w-full items-center">
        <h2 className="text-[20px]">{proposal.meetup_name}</h2>
        <p className="text-[14px]">신청서를 숨길까요?</p>
        <p className="flex flex-col w-full items-center text-[13px] text-[#949394]">
          <div>신청은 유지됩니다.</div>
          <div className="w-full flex items-center justify-center">
            취소를 원하시면 &nbsp; <FaTimesCircle />를 눌러주세요.
          </div>
        </p>

        <div className="flex flex-col gap-2 w-full">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-[13px]">
            아니요
          </button>
          <button onClick={handleProposalHide} className="px-4 py-2 bg-[#FBFFA9] rounded-lg text-[13px] ">
            숨기기
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalDeletionModal;
