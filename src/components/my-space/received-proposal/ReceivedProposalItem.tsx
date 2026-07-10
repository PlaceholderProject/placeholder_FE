"use client";

import { useAcceptProposal, useRefuseProposal } from "@/hooks/useProposal";
import { ReceivedProposal } from "@/types/proposalType";
import { getImageURL } from "@/utils/getImageURL";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import { useState } from "react";
import { LuCalendarDays, LuCheck, LuLoaderCircle, LuMessageSquareQuote, LuX } from "react-icons/lu";
import { toast } from "sonner";

const ReceivedProposalItem = ({ proposal }: { proposal: ReceivedProposal }) => {
  const acceptProposal = useAcceptProposal();
  const refuseProposal = useRefuseProposal();
  const [isConfirmingRefusal, setIsConfirmingRefusal] = useState(false);
  const isDeciding = acceptProposal.isPending || refuseProposal.isPending;

  const handleProposalAccept = () => {
    acceptProposal.mutate(proposal.id, {
      onSuccess: () => toast.success(`${proposal.user.nickname}님의 가입을 승인했어요.`),
      onError: () => toast.error("가입 승인 중 문제가 발생했습니다."),
    });
  };

  const handleProposalRefuse = () => {
    refuseProposal.mutate(proposal.id, {
      onSuccess: () => toast.success(`${proposal.user.nickname}님의 신청을 거절했어요.`),
      onError: () => toast.error("신청 거절 중 문제가 발생했습니다."),
    });
  };

  return (
    <article className="border-border bg-card rounded-[1.8rem] border p-[1.4rem] md:p-[1.6rem]">
      <header className="flex items-center gap-[1rem]">
        <div className="bg-muted relative h-[4.8rem] w-[4.8rem] shrink-0 overflow-hidden rounded-full">
          <Image src={getImageURL(proposal.user.image)} alt={`${proposal.user.nickname} 프로필`} fill sizes="4.8rem" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-primary text-[1rem] font-black">가입 신청자</p>
          <h3 className="text-foreground mt-[0.2rem] truncate text-base font-black">{proposal.user.nickname}</h3>
        </div>
        <span className="text-muted-foreground inline-flex shrink-0 items-center gap-[0.4rem] text-xs">
          <LuCalendarDays className="h-[1.3rem] w-[1.3rem] stroke-[1.8]" />
          {transformCreatedDate(proposal.createdAt)}
        </span>
      </header>

      <section className="bg-muted/70 mt-[1.2rem] rounded-[1.3rem] px-[1.2rem] py-[1rem]" aria-label="신청 메시지">
        <p className="text-muted-foreground inline-flex items-center gap-[0.4rem] text-[1rem] font-bold">
          <LuMessageSquareQuote className="h-[1.3rem] w-[1.3rem] stroke-[1.9]" />
          신청 메시지
        </p>
        <p className="text-foreground/90 mt-[0.5rem] text-sm leading-relaxed break-keep">{proposal.text}</p>
      </section>

      {isConfirmingRefusal ? (
        <div className="border-destructive/15 bg-destructive/[0.035] mt-[1.1rem] flex flex-wrap items-center gap-[0.8rem] rounded-[1.3rem] border px-[1.1rem] py-[0.9rem]">
          <p className="text-foreground min-w-[14rem] flex-1 text-xs font-bold break-keep">{proposal.user.nickname}님의 신청을 거절할까요?</p>
          <button
            type="button"
            onClick={() => setIsConfirmingRefusal(false)}
            disabled={isDeciding}
            className="text-muted-foreground hover:text-foreground h-[3.2rem] rounded-full px-[1rem] text-xs font-bold transition-colors"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleProposalRefuse}
            disabled={isDeciding}
            className="bg-destructive text-destructive-foreground inline-flex h-[3.2rem] items-center gap-[0.4rem] rounded-full px-[1.1rem] text-xs font-bold disabled:cursor-wait disabled:opacity-55"
          >
            {refuseProposal.isPending && <LuLoaderCircle className="h-[1.4rem] w-[1.4rem] animate-spin" />}
            거절 확정
          </button>
        </div>
      ) : (
        <div className="mt-[1.1rem] grid grid-cols-2 gap-[0.8rem]">
          <button
            type="button"
            onClick={() => setIsConfirmingRefusal(true)}
            disabled={isDeciding}
            className="border-border text-muted-foreground hover:bg-destructive/5 hover:text-destructive flex h-[4rem] items-center justify-center gap-[0.5rem] rounded-[1.3rem] border text-sm font-bold transition-colors disabled:opacity-55"
          >
            <LuX className="h-[1.5rem] w-[1.5rem] stroke-[2]" />
            거절
          </button>
          <button
            type="button"
            onClick={handleProposalAccept}
            disabled={isDeciding}
            className="bg-primary text-primary-foreground flex h-[4rem] items-center justify-center gap-[0.5rem] rounded-[1.3rem] text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-55"
          >
            {acceptProposal.isPending ? <LuLoaderCircle className="h-[1.5rem] w-[1.5rem] animate-spin" /> : <LuCheck className="h-[1.5rem] w-[1.5rem] stroke-[2]" />}
            {acceptProposal.isPending ? "승인 중" : "가입 승인"}
          </button>
        </div>
      )}
    </article>
  );
};

export default ReceivedProposalItem;
