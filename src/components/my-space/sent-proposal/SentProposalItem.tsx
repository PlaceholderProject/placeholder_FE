"use client";

import { useModal } from "@/hooks/useModal";
import { SentProposal } from "@/types/proposalType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Link from "next/link";
import { LuCalendarDays, LuCheck, LuClock3, LuDoorOpen, LuMessageSquareQuote, LuX } from "react-icons/lu";

const STATUS_META = {
  pending: { label: "승인 대기", className: "bg-muted text-muted-foreground", icon: LuClock3 },
  acceptance: { label: "가입 승인", className: "bg-success-soft text-success", icon: LuCheck },
  accepted: { label: "가입 승인", className: "bg-success-soft text-success", icon: LuCheck },
  rejected: { label: "가입 거절", className: "bg-destructive/10 text-destructive", icon: LuX },
  refuse: { label: "가입 거절", className: "bg-destructive/10 text-destructive", icon: LuX },
} as const;

const SentProposalItem = ({ proposal }: { proposal: SentProposal }) => {
  const { openModal } = useModal();
  const status = STATUS_META[proposal.status as keyof typeof STATUS_META] ?? STATUS_META.pending;
  const StatusIcon = status.icon;
  const isPending = proposal.status === "pending";
  const isAccepted = proposal.status === "acceptance" || proposal.status === "accepted";

  return (
    <article className="border-border bg-card rounded-[1.8rem] border p-[1.4rem] md:p-[1.6rem]">
      <div className="flex items-start justify-between gap-[1rem]">
        <div className="min-w-0 flex-1">
          <p className="text-primary text-[1rem] font-black">신청한 모임</p>
          <Link href={`/ad/${proposal.meetup_id}`} className="text-foreground mt-[0.35rem] block truncate text-base font-black hover:underline">
            {proposal.meetup_name}
          </Link>
          <p className="text-muted-foreground mt-[0.35rem] line-clamp-1 text-xs">
            <span className="font-bold">모집글</span> · {proposal.meetup_ad_title}
          </p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-[0.4rem] rounded-full px-[0.85rem] py-[0.4rem] text-xs font-bold ${status.className}`}>
          <StatusIcon className="h-[1.3rem] w-[1.3rem] stroke-[2]" />
          {status.label}
        </span>
      </div>

      <section className="bg-muted/70 mt-[1.2rem] rounded-[1.3rem] px-[1.2rem] py-[1rem]" aria-label="내가 보낸 메시지">
        <p className="text-muted-foreground inline-flex items-center gap-[0.4rem] text-[1rem] font-bold">
          <LuMessageSquareQuote className="h-[1.3rem] w-[1.3rem] stroke-[1.9]" />
          내가 보낸 메시지
        </p>
        <p className="text-foreground/90 mt-[0.5rem] text-sm leading-relaxed break-keep">{proposal.text}</p>
      </section>

      <footer className="mt-[1.1rem] flex flex-wrap items-center justify-between gap-[1rem]">
        <span className="text-muted-foreground inline-flex items-center gap-[0.4rem] text-xs">
          <LuCalendarDays className="h-[1.3rem] w-[1.3rem] stroke-[1.8]" />
          신청 {transformCreatedDate(proposal.created_at)}
        </span>

        <div className="flex flex-wrap justify-end gap-[0.6rem]">
          {isAccepted && (
            <Link
              href={`/meetup/${proposal.meetup_id}`}
              className="bg-primary text-primary-foreground inline-flex h-[3.4rem] items-center gap-[0.45rem] rounded-full px-[1.1rem] text-xs font-bold transition-opacity hover:opacity-90"
            >
              <LuDoorOpen className="h-[1.4rem] w-[1.4rem] stroke-[2]" />
              모임 입장
            </Link>
          )}
          {isPending ? (
            <button
              type="button"
              onClick={() => openModal("PROPOSAL_CANCELLATION", { proposal })}
              className="text-destructive hover:bg-destructive/5 border-border h-[3.4rem] rounded-full border px-[1.1rem] text-xs font-bold transition-colors"
            >
              신청 취소
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openModal("PROPOSAL_HIDE", { proposal })}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-[3.4rem] rounded-full border px-[1.1rem] text-xs font-bold transition-colors"
            >
              목록에서 숨기기
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};

export default SentProposalItem;
