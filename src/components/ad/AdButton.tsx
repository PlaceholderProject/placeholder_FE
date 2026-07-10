"use client";

import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { useMyProposalStatus } from "@/hooks/useProposal";
import { useAdItem } from "@/hooks/useAdItem";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import { FaCheckCircle, FaClock, FaInfoCircle } from "react-icons/fa";
import { getDday } from "@/utils/getDday";

const ActionNote = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-muted-foreground flex items-start justify-center gap-[0.5rem] text-center text-xs leading-relaxed break-keep">
      <FaInfoCircle className="mt-[0.2rem] h-[1.1rem] w-[1.1rem] shrink-0" />
      <span>{children}</span>
    </p>
  );
};

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const { openModal } = useModal();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: proposal, isLoading } = useMyProposalStatus(meetupId);
  const { adData } = useAdItem(meetupId);
  const isClosed = getDday(adData?.adEndedAt ?? "") === "마감";

  if (isLoading) return <div className="bg-muted h-[4.4rem] w-full animate-pulse rounded-[1.4rem]" />;

  const handleProposalModal = () => {
    openModal("PROPOSAL_POSTCARD", { meetupId });
  };

  const handleCancellationModal = () => {
    if (proposal) {
      openModal("PROPOSAL_CANCELLATION", { proposal });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {user.nickname === adData?.organizer.nickname ? (
          <Link
            href={`/meetup/${meetupId}`}
            className="bg-primary text-primary-foreground flex h-[4.4rem] w-full items-center justify-center rounded-[1.4rem] font-semibold transition hover:opacity-90"
          >
            입장하기
          </Link>
        ) : proposal ? (
          proposal.status === "pending" ? (
            <div className="flex w-full flex-col gap-[0.8rem]">
              <div className="bg-primary-soft text-primary flex h-[4.4rem] w-full items-center justify-center gap-[0.6rem] rounded-[1.4rem] font-semibold">
                <FaClock className="h-[1.4rem] w-[1.4rem]" />
                승인 대기 중
              </div>
              <button
                onClick={handleCancellationModal}
                className="border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 flex h-[4rem] w-full items-center justify-center rounded-[1.4rem] border font-semibold transition"
              >
                신청 취소
              </button>
              <ActionNote>방장이 승인하면 입장 버튼이 열려요.</ActionNote>
            </div>
          ) : proposal.status === "acceptance" ? (
            <div className="flex w-full flex-col gap-[0.8rem]">
              <Link
                href={`/meetup/${meetupId}`}
                className="bg-primary text-primary-foreground flex h-[4.4rem] w-full items-center justify-center rounded-[1.4rem] font-semibold transition hover:opacity-90"
              >
                입장하기
              </Link>
              <p className="text-primary flex items-center justify-center gap-[0.5rem] text-xs font-semibold">
                <FaCheckCircle className="h-[1.2rem] w-[1.2rem]" />
                참여 중인 멤버입니다.
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-[0.8rem]">
              <div className="bg-muted text-muted-foreground flex h-[4.4rem] w-full items-center justify-center rounded-[1.4rem] font-semibold">신청이 거절되었어요</div>
              <ActionNote>이번 모집에는 입장할 수 없어요.</ActionNote>
            </div>
          )
        ) : isClosed ? (
          <div className="flex w-full flex-col gap-[0.8rem]">
            <div className="bg-muted text-muted-foreground flex h-[4.6rem] w-full items-center justify-center rounded-[1.4rem] font-bold">모집이 마감되었어요</div>
            <ActionNote>다른 모집 중인 모임을 둘러보세요.</ActionNote>
          </div>
        ) : !user.email ? (
          <div className="flex w-full flex-col gap-[0.8rem]">
            <Link href="/login" className="bg-primary text-primary-foreground flex h-[4.4rem] w-full items-center justify-center rounded-[1.4rem] font-semibold transition hover:opacity-90">
              로그인하고 신청하기
            </Link>
            <ActionNote>로그인 후 신청서를 보낼 수 있어요.</ActionNote>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-[0.8rem]">
            <button onClick={handleProposalModal} className="bg-primary text-primary-foreground hover:bg-primary-hover h-[4.6rem] w-full rounded-[1.4rem] font-bold transition-colors">
              가입 신청하기
            </button>
            <ActionNote>승인되면 모임 공간에 입장할 수 있어요.</ActionNote>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdButton;
