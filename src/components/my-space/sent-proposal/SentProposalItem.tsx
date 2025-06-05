"use client";

import ProposalCancellationModal from "@/components/modals/ProposalCancellationModal";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { FaUser, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { SentProposalItemProps } from "@/types/proposalType";
import ProposalHideModal from "@/components/modals/ProposalHideModal";

const SentProposalItem = ({ proposal, isModalOpen, modalType, onModalOpen, onModalClose }: SentProposalItemProps) => {
  const handleCancellationModalOpen = () => {
    onModalOpen(proposal.id, "cancellation");
  };

  const handleProposalHide = () => {
    onModalOpen(proposal.id, "hide");
  };

  console.log(proposal); // meetupId 확인 필요

  return (
    <div className="bg-secondary-light flex flex-col items-center justify-between gap-[0.5rem] rounded-[1rem] p-[1.5rem] shadow-md">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-[1rem]">
          <div className="px-1">
            {proposal.status === "pending" ? (
              <div className="text-gray-dark flex flex-col items-center">
                <div className="text-2xl">
                  <FaUser />
                </div>
                <div className="whitespace-nowrap text-xs">대기중</div>
              </div>
            ) : proposal.status === "acceptance" ? (
              <div className="flex flex-col items-center text-[#028AB3]">
                <div className="text-[2.2rem]">
                  <FaUserCheck />
                </div>
                <div className="h-fil whitespace-nowrap text-xs leading-5">수락됨</div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#F9617A]">
                <div className="text-[2.2rem]">
                  <FaUserTimes />
                </div>
                <div className="whitespace-nowrap text-xs leading-5">거절됨</div>
              </div>
            )}
          </div>
          <div className="break-all font-semibold">{proposal.meetup_ad_title}</div>
        </div>
        <span className="text-gray-dark text-sm">{transformCreatedDate(proposal.created_at)}</span>
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-[1rem]">
        <div className="break-all">{proposal.text}&nbsp;&nbsp;</div>
        <div className="flex gap-[1rem] whitespace-nowrap text-white">
          <button onClick={handleCancellationModalOpen} className="bg-warning h-fil rounded-[0.5rem] p-[0.5rem] text-sm font-bold">
            취소
          </button>
          <button onClick={handleProposalHide} className="bg-gray-dark rounded-[0.5rem] p-[0.5rem] text-sm font-bold">
            숨기기
          </button>
        </div>
      </div>
      {isModalOpen && modalType === "cancellation" && <ProposalCancellationModal meetupId={proposal.meetup_id} title={proposal.meetup_ad_title} proposal={proposal} onClose={onModalClose} />}
      {isModalOpen && modalType === "hide" && <ProposalHideModal proposal={proposal} onClose={onModalClose} />}
    </div>
  );
};

export default SentProposalItem;
