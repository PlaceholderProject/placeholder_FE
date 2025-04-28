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
    <div className="flex flex-row justify-between border-2 rounded-lg p-3">
      <div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
            <Image
              src={proposal.user.image ? (proposal.user.image.startsWith("http") ? proposal.user.image : `${BASE_URL}${proposal.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              width="30"
              height="30"
              unoptimized={true}
            />
          </div>
          <span>{proposal.user.nickname}</span>
          <span>날짜</span>
        </div>
        <p>{proposal.text}</p>
      </div>
      <div className="flex flex-row items-center">
        <button onClick={handleProposalAccept}>
          <FaUserCheck />
        </button>
        <button onClick={handleProposalRefuse}>
          <FaUserTimes />
        </button>
      </div>
    </div>
  );
};

export default ReceivedProposalItem;
