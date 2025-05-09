import { BASE_URL } from "@/constants/baseURL";
import { useAcceptProposal, useRefuseProposal } from "@/hooks/useProposal";
import { ReceivedProposal } from "@/types/proposalType";
import Image from "next/image";
import React from "react";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

const ReceivedProposalItem = ({ proposal }: { proposal: ReceivedProposal }) => {
  const acceptProposal = useAcceptProposal();
  const refuseProposal = useRefuseProposal();

  const handleProposalAccept = () => {
    acceptProposal.mutate(proposal.id);
    alert(`${proposal.user.nickname}님을 수락했습니다.`);
  };

  const handleProposalRefuse = () => {
    refuseProposal.mutate(proposal.id);
    alert(`${proposal.user.nickname}님을 거절했습니다.`);
  };

  return (
    <div className="flex flex-row justify-between bg-[#FEFFEC] rounded-xl p-4 shadow-lg">
      <div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[20px] h-[20px] rounded-full overflow-hidden">
            <Image
              src={proposal.user.image ? (proposal.user.image.startsWith("http") ? proposal.user.image : `${BASE_URL}${proposal.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              width="20"
              height="20"
              unoptimized={true}
            />
          </div>
          <span className="text-[13px]">{proposal.user.nickname}</span>
          <span className="text-[#B7B7B7] text-[13px]">날짜</span>
        </div>
        <p className="pt-2 text-[13px]">{proposal.text}</p>
      </div>
      <div className="flex flex-row items-center gap-3">
        <button onClick={handleProposalAccept} className="text-[#028AB3] text-[26px]">
          <FaUserCheck />
        </button>
        <button onClick={handleProposalRefuse} className="text-[#F9617A] text-[26px]">
          <FaUserTimes />
        </button>
      </div>
    </div>
  );
};

export default ReceivedProposalItem;
