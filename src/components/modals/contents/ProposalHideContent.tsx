"use client";

import { useModal } from "@/hooks/useModal";
import { useHideProposal } from "@/hooks/useProposal";
import { SentProposal } from "@/types/proposalType";
import { LuEyeOff, LuInfo, LuLoaderCircle } from "react-icons/lu";
import { toast } from "sonner";

const ProposalHideContent = ({ proposal }: { proposal: SentProposal }) => {
  const { closeModal } = useModal();
  const hideMutation = useHideProposal();

  const handleProposalHide = () => {
    hideMutation.mutate(proposal.id, {
      onSuccess: () => {
        closeModal();
        toast.success("가입 신청을 목록에서 숨겼어요.");
      },
      onError: () => toast.error("가입 신청을 숨기지 못했어요."),
    });
  };

  return (
    <div className="pt-[0.2rem]">
      <header className="mb-[1.8rem]">
        <div className="text-primary flex items-center gap-[0.5rem] pr-[4.4rem]">
          <LuEyeOff className="h-[1.5rem] w-[1.5rem] shrink-0 stroke-[2]" aria-hidden="true" />
          <p className="text-xs font-black">목록에서 숨기기</p>
        </div>
        <h2 className="text-foreground mt-[0.9rem] pr-[1rem] text-[2.2rem] leading-[1.25] font-black tracking-[-0.035em] break-keep">이 신청을 숨길까요?</h2>
      </header>

      <section className="border-primary/15 bg-primary-soft/45 rounded-[1.4rem] border px-[1.3rem] py-[1.15rem]" aria-label="숨길 가입 신청">
        <p className="text-primary text-[1rem] font-black">숨길 가입 신청</p>
        <p className="text-foreground mt-[0.45rem] text-sm leading-[1.55] font-bold break-keep">{proposal.meetup_name}</p>
        <p className="text-muted-foreground mt-[0.25rem] line-clamp-1 text-xs">{proposal.meetup_ad_title}</p>
      </section>

      <p className="text-muted-foreground mt-[1.1rem] flex items-start gap-[0.55rem] px-[0.2rem] text-xs leading-[1.65] break-keep">
        <LuInfo className="mt-[0.15rem] h-[1.4rem] w-[1.4rem] shrink-0 stroke-[2]" />
        <span>가입 상태는 그대로 유지되고 이 목록에서만 보이지 않게 됩니다.</span>
      </p>

      <div className="mt-[1.6rem] grid grid-cols-2 gap-[0.8rem]">
        <button
          type="button"
          onClick={closeModal}
          className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-[4.6rem] rounded-[1.4rem] border text-sm font-bold transition-colors"
        >
          계속 표시
        </button>
        <button
          type="button"
          onClick={handleProposalHide}
          disabled={hideMutation.isPending}
          className="bg-primary text-primary-foreground flex h-[4.6rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-55"
        >
          {hideMutation.isPending && <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" />}
          {hideMutation.isPending ? "숨기는 중" : "숨기기"}
        </button>
      </div>
    </div>
  );
};

export default ProposalHideContent;
