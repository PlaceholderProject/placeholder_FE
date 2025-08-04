"use client";

import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { useMyProposalStatus } from "@/hooks/useProposal";
import { useAdItem } from "@/hooks/useAdItem";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import { toast } from "sonner";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const { openModal } = useModal();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: proposal, isLoading } = useMyProposalStatus(meetupId);
  const { adData } = useAdItem(meetupId);

  if (isLoading) return <p>로딩 중...</p>;

  const handleProposalModal = () => {
    if (!user.email) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    openModal("PROPOSAL_POSTCARD", { meetupId });
  };

  const handleCancellationModal = () => {
    if (proposal) {
      openModal("PROPOSAL_CANCELLATION", { proposal });
    }
  };

  if (proposal) {
    console.log("신청서 상태", proposal.status);
  }

  return (
    <div className="flex w-full justify-center">
      <div className="my-[2rem] w-[90%] max-w-[80rem]">
        {user.nickname === adData?.organizer.nickname ? (
          <Link href={`/meetup/${meetupId}`} className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-primary text-white">
            입장하기
          </Link>
        ) : proposal ? (
          proposal.status === "pending" ? (
            <div className="flex w-full flex-row gap-[1rem]">
              <button onClick={handleCancellationModal} className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-warning text-white">
                취소하기
              </button>
              <div className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-gray-light">수락 대기 중</div>
            </div>
          ) : proposal.status === "acceptance" ? (
            <div className="flex w-full flex-row gap-[1rem]">
              <div className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-gray-light">수락 완료</div>
              <Link href={`/meetup/${meetupId}`} className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-primary text-white">
                입장하기
              </Link>
            </div>
          ) : (
            <div className="flex w-full flex-row gap-[1rem]">
              <div className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-gray-light">거절됨</div>
              <div className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-gray-light">입장하기</div>
            </div>
          )
        ) : (
          <div className="flex w-full flex-row gap-[1rem]">
            <button onClick={handleProposalModal} className="h-[3.5rem] w-full rounded-[0.5rem] bg-secondary-dark">
              신청하기
            </button>
            <div className="flex h-[3.5rem] w-full items-center justify-center rounded-[0.5rem] bg-gray-light">입장하기</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdButton;
