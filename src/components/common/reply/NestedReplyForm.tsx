import { type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction, useRef, useState } from "react";
import { useCreateNestedReply } from "@/hooks/useReply";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { resetReply } from "@/stores/replySlice";
import { useCreateScheduleNestedReply } from "@/hooks/useScheduleReply";
import { toast } from "sonner";
import { LuLoaderCircle, LuSendHorizontal, LuX } from "react-icons/lu";

const MAX_NESTED_REPLY_LENGTH = 300;

const NestedReplyForm = ({
  rootReply,
  meetupId,
  scheduleId,
  isVisiableNestedReplyForm,
  setIsVisiableNestedReplyForm,
  setIsVisiableNestedReply,
}: {
  rootReply: Reply;
  meetupId: number;
  scheduleId?: number;
  isVisiableNestedReplyForm: boolean;
  setIsVisiableNestedReplyForm: Dispatch<SetStateAction<boolean>>;
  setIsVisiableNestedReply: Dispatch<SetStateAction<boolean>>;
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const nestedReply = useSelector((state: RootState) => state.reply.reply);

  const dispatch = useDispatch();

  const targetReplyId = nestedReply.id || rootReply.id;
  const targetNickname = nestedReply.user.nickname || rootReply.user.nickname;
  const createNestedReplyMutation = useCreateNestedReply(targetReplyId, Number(meetupId));
  const createScheduleNestedReplyMutation = useCreateScheduleNestedReply(targetReplyId, Number(scheduleId));
  const isSubmitting = createNestedReplyMutation.isPending || createScheduleNestedReplyMutation.isPending;

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value.slice(0, MAX_NESTED_REPLY_LENGTH));
  };

  const handleNestedReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.email) {
      toast.info("로그인 후 답글을 작성할 수 있어요.");
      return;
    }

    const text = content.trim();
    if (!text || isSubmitting) return;

    try {
      if (scheduleId) {
        await createScheduleNestedReplyMutation.mutateAsync({ text });
      } else {
        await createNestedReplyMutation.mutateAsync({ text });
      }

      setIsVisiableNestedReply(true);
      setIsVisiableNestedReplyForm(false);
      setContent("");
      dispatch(resetReply());
    } catch (error) {
      console.error("답글 작성 실패:", error);
      toast.error("답글 등록 중 문제가 발생했습니다.");
    }
  };

  const handleNestedReplyForm = () => {
    setIsVisiableNestedReplyForm(!isVisiableNestedReplyForm);
    setIsVisiableNestedReply(false);
    dispatch(resetReply());
  };

  return (
    <form onSubmit={handleNestedReplySubmit} className="border-border bg-card mt-[1rem] rounded-[1.5rem] border px-[1.1rem] py-[1rem]">
      <div className="mb-[0.6rem] flex items-center justify-between gap-[0.8rem]">
        <p className="text-primary text-xs font-bold">@{targetNickname}에게 답글</p>
        <button
          type="button"
          onClick={handleNestedReplyForm}
          className="text-muted-foreground hover:text-foreground grid h-[2.8rem] w-[2.8rem] place-items-center rounded-full transition-colors"
          aria-label="답글 닫기"
        >
          <LuX className="h-[1.5rem] w-[1.5rem]" />
        </button>
      </div>

      <div className="flex items-end gap-[0.8rem]">
        <textarea
          ref={textareaRef}
          className="placeholder:text-muted-foreground/75 min-h-[5rem] flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none"
          placeholder={user.email ? "답글을 남겨보세요" : "로그인 후 답글을 작성할 수 있어요."}
          onChange={handleContentChange}
          value={content}
          disabled={!user.email}
        />
        <button
          type="submit"
          disabled={!user.email || isSubmitting || content.trim().length === 0}
          className="bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground grid h-[3.4rem] w-[3.4rem] shrink-0 place-items-center rounded-full transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-100"
          aria-label="답글 등록"
        >
          {isSubmitting ? <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" /> : <LuSendHorizontal className="h-[1.6rem] w-[1.6rem]" />}
        </button>
      </div>

      <div className="mt-[0.5rem] flex justify-end text-xs">
        <span className={content.length >= MAX_NESTED_REPLY_LENGTH ? "text-primary font-semibold" : "text-muted-foreground"}>
          {content.length}/{MAX_NESTED_REPLY_LENGTH}
        </span>
      </div>
    </form>
  );
};

export default NestedReplyForm;
