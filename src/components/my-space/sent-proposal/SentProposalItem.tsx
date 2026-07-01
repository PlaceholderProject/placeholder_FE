"use client";

import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { LuClock, LuCheck, LuX } from "react-icons/lu";
import { SentProposal } from "@/types/proposalType";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

const STATUS_META = {
  pending: { label: "대기중", className: "bg-muted text-muted-foreground", icon: LuClock },
  acceptance: { label: "수락됨", className: "bg-primary-soft text-primary", icon: LuCheck },
  accepted: { label: "수락됨", className: "bg-primary-soft text-primary", icon: LuCheck },
  rejected: { label: "거절됨", className: "bg-destructive/10 text-destructive", icon: LuX },
  refuse: { label: "거절됨", className: "bg-destructive/10 text-destructive", icon: LuX },
} as const;

const SentProposalItem = ({ proposal }: { proposal: SentProposal }) => {
  const { openModal } = useModal();
  const status = STATUS_META[proposal.status as keyof typeof STATUS_META] ?? STATUS_META.pending;
  const StatusIcon = status.icon;

  const handleCancellationModalOpen = () => {
    openModal("PROPOSAL_CANCELLATION", { proposal });
  };

  const handleProposalHide = () => {
    openModal("PROPOSAL_HIDE", { proposal });
  };

  return (
    <div className="border-border bg-card rounded-[1.6rem] border p-[1.4rem]">
      <div className="flex items-start justify-between gap-[1rem]">
        <div className="min-w-0 flex-1">
          <Link href={`/ad/${proposal.meetup_id}`} className="text-foreground block truncate font-semibold hover:underline">
            {proposal.meetup_ad_title}
          </Link>
          <p className="text-muted-foreground mt-[0.3rem] truncate text-xs">{proposal.meetup_name}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-[0.4rem] rounded-full px-[0.8rem] py-[0.35rem] text-xs font-semibold ${status.className}`}>
          <StatusIcon className="h-[1.3rem] w-[1.3rem] stroke-[2]" />
          {status.label}
        </span>
      </div>

      <p className="bg-muted text-foreground/90 mt-[1rem] rounded-[1.2rem] px-[1.2rem] py-[1rem] text-sm leading-relaxed break-keep">{proposal.text}</p>

      <div className="mt-[1rem] flex items-center justify-between gap-[1rem]">
        <span className="text-muted-foreground text-xs">{transformCreatedDate(proposal.created_at)}</span>
        <div className="flex gap-[0.6rem] whitespace-nowrap">
          {proposal.status === "pending" && (
            <button
              onClick={handleCancellationModalOpen}
              className="text-destructive hover:bg-destructive/5 border-border rounded-full border px-[1rem] py-[0.55rem] text-xs font-semibold transition-colors"
            >
              취소
            </button>
          )}
          <button
            onClick={handleProposalHide}
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-full border px-[1rem] py-[0.55rem] text-xs font-semibold transition-colors"
          >
            숨기기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentProposalItem;
