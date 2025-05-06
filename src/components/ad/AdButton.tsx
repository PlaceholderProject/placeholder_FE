"use client";

import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import ProposalPostcard from "../modals/ProposalPostcard";
import { useMyProposalStatus } from "@/hooks/useProposal";
import { useAdItem } from "@/hooks/useAdItem";
import Link from "next/link";
import ProposalCancellationModal from "../modals/ProposalCancellationModal";
import { useState } from "react";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const [isProposalPostcardOpen, setIsProposalPostcardOpen] = useState(false);
  const [isProposalCancellationOpen, setIsProposalCancellationOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  const { data: proposal, isLoading } = useMyProposalStatus(meetupId);
  const { adData } = useAdItem(meetupId);

  if (isLoading) return <p>로딩 중...</p>;

  const handleProposalModal = () => {
    setIsProposalPostcardOpen(prev => !prev);
  };

  const handleCancellationModal = () => {
    setIsProposalCancellationOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col gap-2 items-center py-6 px-12">
      {user.nickname === adData?.organizer.nickname ? (
        <Link href={`/meetup/${meetupId}`} className="bg-[#006B8B] w-full text-center p-1 rounded-md text-white">
          입장하기
        </Link>
      ) : proposal ? (
        proposal.status === "pending" ? (
          <div className="flex flex-row gap-2 w-full">
            <button onClick={handleCancellationModal} className="bg-[#F9617A] w-full text-center p-1 rounded-md text-white">
              취소하기
            </button>
            <div className="bg-[#E8E8E8] w-full text-center p-1 rounded-md">수락 대기 중</div>
          </div>
        ) : proposal.status === "acceptance" ? (
          <div className="flex flex-row gap-2 w-full">
            <div className="bg-[#E8E8E8] w-full text-center p-1 rounded-md">수락 완료</div>
            <Link href={`/meetup/${meetupId}`} className="bg-[#006B8B] w-full text-center p-1 rounded-md text-white">
              입장하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-row gap-2 w-full">
            <div className="bg-[#E8E8E8] w-full text-center p-1 rounded-md">거절됨</div>
            <div className="bg-[#E8E8E8] w-full text-center p-1 rounded-md">입장하기</div>
          </div>
        )
      ) : (
        <div className="flex flex-row gap-2 w-full">
          <button onClick={handleProposalModal} className="bg-[#FBFFA9] w-full text-center p-1 rounded-md">
            신청하기
          </button>
          <div className="bg-[#E8E8E8] w-full text-center p-1 rounded-md">입장하기</div>
          {isProposalPostcardOpen && <ProposalPostcard meetupId={meetupId} onClose={() => setIsProposalPostcardOpen(false)} />}
        </div>
      )}
      {isProposalCancellationOpen && <ProposalCancellationModal proposal={proposal} onClose={() => setIsProposalCancellationOpen(false)} />}
    </div>
  );
};

export default AdButton;
