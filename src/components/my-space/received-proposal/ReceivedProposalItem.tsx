import { BASE_URL } from "@/constants/baseURL";
import { useAcceptProposal, useRefuseProposal } from "@/hooks/useProposal";
import { ReceivedProposal } from "@/types/proposalType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
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

  console.log(proposal);

  return (
    <div className="flex flex-row justify-between gap-[1rem] rounded-[1rem] bg-secondary-light p-[1.5rem] shadow-md">
      <div className="w-full">
        <div className="flex flex-row items-center gap-[1rem]">
          <div className="h-[2rem] w-[2rem] overflow-hidden rounded-full">
            <Image
              src={proposal.user.image ? (proposal.user.image.startsWith("http") ? proposal.user.image : `${BASE_URL}/${proposal.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              width="20"
              height="20"
              unoptimized={true}
            />
          </div>
          <span>{proposal.user.nickname}</span>
          <span className="text-sm text-gray-dark">{transformCreatedDate(proposal.createdAt)}</span>
        </div>
        <p className="pt-[0.5rem]">{proposal.text}</p>
      </div>
      <div className="flex flex-row items-center gap-3">
        <button onClick={handleProposalAccept} className="text-[2.5rem] text-[#028AB3]">
          <FaUserCheck />
        </button>
        <button onClick={handleProposalRefuse} className="text-[2.5rem] text-warning">
          <FaUserTimes />
        </button>
      </div>
    </div>
  );
};

export default ReceivedProposalItem;
