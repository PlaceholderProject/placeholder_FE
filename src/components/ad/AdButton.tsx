"use client";

import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { useMyProposalStatus } from "@/hooks/useProposal";
import { useAdItem } from "@/hooks/useAdItem";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const { openModal } = useModal();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: proposal, isLoading } = useMyProposalStatus(meetupId);
  const { adData } = useAdItem(meetupId);

  if (isLoading) return <p>로딩 중...</p>;

  const handleProposalModal = () => {
    openModal("PROPOSAL_POSTCARD", { meetupId });
  };

  const handleCancellationModal = () => {
    if (proposal) {
      openModal("PROPOSAL_CANCELLATION", { proposal });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 px-12 py-6">
      {user.nickname === adData?.organizer.nickname ? (
        <Link href={`/meetup/${meetupId}`} className="w-full rounded-md bg-[#006B8B] p-1 text-center text-white">
          입장하기
        </Link>
      ) : proposal ? (
        proposal.status === "pending" ? (
          <div className="flex w-full flex-row gap-2">
            <button onClick={handleCancellationModal} className="w-full rounded-md bg-[#F9617A] p-1 text-center text-white transition-colors hover:bg-[#e55470]">
              취소하기
            </button>
            <div className="w-full rounded-md bg-[#E8E8E8] p-1 text-center">수락 대기 중</div>
          </div>
        ) : proposal.status === "acceptance" ? (
          <div className="flex w-full flex-row gap-2">
            <div className="w-full rounded-md bg-[#E8E8E8] p-1 text-center">수락 완료</div>
            <Link href={`/meetup/${meetupId}`} className="w-full rounded-md bg-[#006B8B] p-1 text-center text-white">
              입장하기
            </Link>
          </div>
        ) : (
          <div className="flex w-full flex-row gap-2">
            <div className="w-full rounded-md bg-[#E8E8E8] p-1 text-center">거절됨</div>
            <div className="w-full rounded-md bg-[#E8E8E8] p-1 text-center">입장하기</div>
          </div>
        )
      ) : (
        <div className="flex w-full flex-row gap-2">
          <button onClick={handleProposalModal} className="w-full rounded-md bg-[#FBFFA9] p-1 text-center transition-colors hover:bg-[#f0f56e]">
            신청하기
          </button>
          <div className="w-full rounded-md bg-[#E8E8E8] p-1 text-center">입장하기</div>
        </div>
      )}
    </div>
  );
};

export default AdButton;
