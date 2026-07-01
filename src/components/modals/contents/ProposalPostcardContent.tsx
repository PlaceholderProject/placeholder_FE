"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { useCreateProposal } from "@/hooks/useProposal";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import { LuLoaderCircle, LuMessageSquareText, LuSendHorizontal } from "react-icons/lu";

const MAX_PROPOSAL_LENGTH = 40;

const ProposalPostcardContent = ({ meetupId }: { meetupId: number }) => {
  const { closeModal } = useModal();
  const [proposalText, setProposalText] = useState("");

  const proposalMutation = useCreateProposal(meetupId);
  const trimmedProposalText = proposalText.trim();
  const isSubmitDisabled = proposalMutation.isPending || !trimmedProposalText;

  const handleProposalText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setProposalText(event.target.value.slice(0, MAX_PROPOSAL_LENGTH));
  };

  const handleProposalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedProposalText) {
      toast.error("신청 메시지를 입력해주세요.");
      return;
    }

    try {
      await proposalMutation.mutateAsync(trimmedProposalText);
      closeModal();
    } catch (error) {
      console.error("신청서 제출 실패:", error);
    }
  };

  return (
    <div className="pt-[0.4rem]">
      <div className="mb-[2rem] flex items-start gap-[1.2rem] pr-[3.6rem]">
        <div className="bg-primary-soft text-primary grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-[1.4rem]">
          <LuMessageSquareText className="h-[2.2rem] w-[2.2rem] stroke-[1.8]" />
        </div>
        <div>
          <p className="text-primary mb-[0.4rem] text-xs font-bold">참여 신청</p>
          <h2 className="text-foreground text-[2rem] leading-tight font-bold">모임장에게 신청서를 보낼게요</h2>
          <p className="text-muted-foreground mt-[0.8rem] text-sm leading-relaxed break-keep">승인되면 모임 공간에 입장할 수 있어요.</p>
        </div>
      </div>

      <form onSubmit={handleProposalSubmit} className="flex flex-col gap-[1.2rem]">
        <div>
          <label htmlFor="proposal" className="text-foreground mb-[0.8rem] block text-sm font-semibold">
            신청 메시지
          </label>
          <textarea
            id="proposal"
            value={proposalText}
            onChange={handleProposalText}
            maxLength={MAX_PROPOSAL_LENGTH}
            rows={4}
            placeholder="함께하고 싶은 이유를 짧게 남겨주세요."
            className="border-border bg-muted/40 placeholder:text-muted-foreground/70 focus:border-primary focus:bg-card focus:ring-primary/10 h-[11.6rem] w-full resize-none rounded-[1.6rem] border px-[1.4rem] py-[1.3rem] text-sm leading-relaxed transition outline-none focus:ring-[0.4rem]"
          />
          <div className="bg-primary-soft/55 mt-[0.8rem] flex items-start justify-between gap-[1rem] rounded-[1.2rem] px-[1.1rem] py-[0.8rem] text-xs leading-relaxed">
            <p className="text-primary font-semibold break-keep">40자 이내로 전달돼요. 신청 후에는 승인 대기 상태로 바뀝니다.</p>
            <p className={proposalText.length >= MAX_PROPOSAL_LENGTH ? "text-primary font-semibold" : "text-muted-foreground"}>
              {proposalText.length}/{MAX_PROPOSAL_LENGTH}
            </p>
          </div>
        </div>

        <div className="mt-[0.4rem] grid grid-cols-[1fr_1.45fr] gap-[0.8rem]">
          <button type="button" onClick={closeModal} className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-[4.4rem] rounded-[1.4rem] border font-semibold transition">
            닫기
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground flex h-[4.4rem] items-center justify-center gap-[0.7rem] rounded-[1.4rem] font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-100"
          >
            {proposalMutation.isPending ? (
              <>
                <LuLoaderCircle className="h-[1.7rem] w-[1.7rem] animate-spin stroke-[2]" />
                보내는 중
              </>
            ) : (
              <>
                <LuSendHorizontal className="h-[1.7rem] w-[1.7rem] stroke-[2]" />
                신청 보내기
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalPostcardContent;
