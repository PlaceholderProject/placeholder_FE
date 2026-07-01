import { useAcceptProposal, useRefuseProposal } from "@/hooks/useProposal";
import { ReceivedProposal } from "@/types/proposalType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { getImageURL } from "@/utils/getImageURL";
import Image from "next/image";
import React from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { toast } from "sonner";

const ReceivedProposalItem = ({ proposal }: { proposal: ReceivedProposal }) => {
  const acceptProposal = useAcceptProposal();
  const refuseProposal = useRefuseProposal();

  const handleProposalAccept = () => {
    acceptProposal.mutate(proposal.id);
    toast.success(`${proposal.user.nickname}님을 수락했습니다.`);
  };

  const handleProposalRefuse = () => {
    refuseProposal.mutate(proposal.id);
    toast.success(`${proposal.user.nickname}님을 거절했습니다.`);
  };

  return (
    <div className="border-border bg-card rounded-[1.6rem] border p-[1.4rem]">
      <div className="flex items-start gap-[1rem]">
        <div className="relative h-[4rem] w-[4rem] shrink-0 overflow-hidden rounded-full">
          <Image src={getImageURL(proposal.user.image)} alt={proposal.user.nickname} fill sizes="4rem" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[0.6rem]">
            <span className="text-foreground font-semibold">{proposal.user.nickname}</span>
            <span className="text-muted-foreground text-xs">{transformCreatedDate(proposal.createdAt)}</span>
          </div>
          <p className="bg-muted text-foreground/90 mt-[1rem] rounded-[1.2rem] px-[1.2rem] py-[1rem] text-sm leading-relaxed break-keep">{proposal.text}</p>
        </div>
      </div>
      <div className="mt-[1rem] grid grid-cols-2 gap-[0.8rem]">
        <button
          onClick={handleProposalAccept}
          disabled={acceptProposal.isPending || refuseProposal.isPending}
          className="bg-primary text-primary-foreground flex h-[3.8rem] items-center justify-center gap-[0.5rem] rounded-[1.2rem] text-sm font-semibold transition hover:opacity-90 disabled:opacity-55"
        >
          <LuCheck className="h-[1.5rem] w-[1.5rem] stroke-[2]" />
          수락
        </button>
        <button
          onClick={handleProposalRefuse}
          disabled={acceptProposal.isPending || refuseProposal.isPending}
          className="bg-muted text-muted-foreground hover:text-foreground flex h-[3.8rem] items-center justify-center gap-[0.5rem] rounded-[1.2rem] text-sm font-semibold transition disabled:opacity-55"
        >
          <LuX className="h-[1.5rem] w-[1.5rem] stroke-[2]" />
          거절
        </button>
      </div>
    </div>
  );
};

export default ReceivedProposalItem;
