import { useCancelProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";
import { SentProposal } from "@/types/proposalType";
import { useParams } from "next/navigation";
import { LuCircleAlert, LuInfo, LuLoaderCircle } from "react-icons/lu";

const ProposalCancellationContent = ({ proposal }: { proposal: SentProposal }) => {
  const { closeModal } = useModal();
  const { meetupId } = useParams();

  const meetupNumberId = proposal.meetup_id || Number(meetupId);

  const cancelMutation = useCancelProposal(meetupNumberId);

  const handleProposalCancel = () => {
    cancelMutation.mutate(proposal.id, { onSuccess: closeModal });
  };

  return (
    <div className="pt-[0.2rem]">
      <div className="mb-[1.8rem]">
        <div className="text-destructive flex items-center gap-[0.5rem] pr-[4.4rem]">
          <LuCircleAlert className="h-[1.5rem] w-[1.5rem] shrink-0 stroke-[2]" aria-hidden="true" />
          <p className="text-destructive text-xs font-black">가입 신청 취소</p>
        </div>

        <h2 className="text-foreground mt-[0.9rem] pr-[1rem] text-[2.2rem] leading-[1.25] font-black tracking-[-0.035em] break-keep">신청을 취소할까요?</h2>
      </div>

      <section className="border-destructive/15 bg-destructive/[0.035] rounded-[1.4rem] border px-[1.3rem] py-[1.15rem]" aria-label="취소할 모임">
        <p className="text-destructive text-[1rem] font-black">취소할 모임</p>
        <p className="text-foreground mt-[0.45rem] text-sm leading-[1.55] font-bold break-keep">{proposal.meetup_ad_title}</p>
      </section>

      <p className="text-muted-foreground mt-[1.1rem] flex items-start gap-[0.55rem] px-[0.2rem] text-xs leading-[1.65] break-keep">
        <LuInfo className="mt-[0.15rem] h-[1.4rem] w-[1.4rem] shrink-0 stroke-[2]" />
        <span>취소하면 방장에게 전달된 신청이 철회되며, 승인 대기 상태도 종료됩니다.</span>
      </p>

      <div className="mt-[1.6rem] grid grid-cols-2 gap-[0.8rem]">
        <button onClick={closeModal} className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-[4.6rem] rounded-[1.4rem] border text-sm font-bold transition-colors">
          계속 기다리기
        </button>
        <button
          onClick={handleProposalCancel}
          disabled={cancelMutation.isPending}
          className="bg-destructive text-destructive-foreground flex h-[4.6rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {cancelMutation.isPending && <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" />}
          {cancelMutation.isPending ? "취소 중" : "신청 취소"}
        </button>
      </div>
    </div>
  );
};

export default ProposalCancellationContent;
