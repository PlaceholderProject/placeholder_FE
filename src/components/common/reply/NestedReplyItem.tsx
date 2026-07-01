"use client";

import { type ChangeEvent, useState } from "react";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { BASE_URL } from "@/constants/baseURL";
import { useDeleteReply, useEditReply } from "@/hooks/useReply";
import { useDeleteScheduleReply, useUpdateScheduleReply } from "@/hooks/useScheduleReply";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LuCheck, LuCrown, LuPencil, LuTrash2, LuX } from "react-icons/lu";

const getReplyImage = (image?: string | null) => {
  if (!image) return "/profile.png";
  return image.startsWith("http") ? image : `${BASE_URL}/${image}`;
};

const NestedReplyItem = ({ nestedReply, meetupId, scheduleId }: { nestedReply: Reply; meetupId: number; scheduleId?: number }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const editReplyMutation = useEditReply(meetupId);
  const deleteReplyMutation = useDeleteReply(meetupId);
  const editScheduleReplyMutation = useUpdateScheduleReply(Number(scheduleId));
  const deleteScheduleReplyMutation = useDeleteScheduleReply(Number(scheduleId));

  const [text, setText] = useState(nestedReply.text);
  const [isEditMode, setIsEditMode] = useState(false);
  const isMine = nestedReply.user.nickname === user.nickname;

  const handleReplyDelete = async (replyId: number) => {
    showConfirmToast({
      message: "정말로 답글을 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          if (scheduleId) {
            await deleteScheduleReplyMutation.mutateAsync(replyId);
          } else {
            await deleteReplyMutation.mutateAsync(replyId);
          }
          toast.success("정상적으로 삭제되었습니다.");
        } catch {
          toast.error("삭제 중 문제가 발생했습니다.");
        }
      },
    });
  };

  const handleTextchange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleUpdateMode = () => {
    setIsEditMode(prev => !prev);
    setText(nestedReply.text);
  };

  const handleNestedReplyUpdate = async (replyId: number) => {
    const nextText = text.trim();
    if (!nextText) {
      toast.error("답글 내용을 입력해주세요.");
      return;
    }

    showConfirmToast({
      message: "정말로 답글을 수정하시겠습니까?",
      confirmText: "수정",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          if (scheduleId) {
            await editScheduleReplyMutation.mutateAsync({ text: nextText, replyId });
          } else {
            await editReplyMutation.mutateAsync({ text: nextText, replyId });
          }
          toast.success("정상적으로 수정되었습니다.");
          setIsEditMode(false);
        } catch {
          toast.error("답글 수정 중 문제가 발생했습니다.");
        }
      },
    });
  };

  return (
    <article className="flex gap-[0.9rem]">
      <div className="bg-muted relative h-[3.2rem] w-[3.2rem] shrink-0 overflow-hidden rounded-full">
        <Image unoptimized src={getReplyImage(nestedReply.user.image)} alt={nestedReply.user.nickname} fill sizes="3.2rem" className="object-cover" />
      </div>
      <div className="bg-muted/40 min-w-0 flex-1 rounded-[1.5rem] rounded-tl-[0.5rem] px-[1.2rem] py-[1rem]">
        <div className="flex flex-wrap items-start justify-between gap-[0.8rem]">
          <div className="flex min-w-0 flex-wrap items-center gap-[0.55rem]">
            <span className="text-foreground text-sm font-bold">{nestedReply.user.nickname}</span>
            {nestedReply.isOrganizer && (
              <span className="bg-primary-soft text-primary inline-flex items-center gap-[0.3rem] rounded-full px-[0.55rem] py-[0.15rem] text-[1rem] font-bold">
                <LuCrown className="fill-primary/20 h-[1.1rem] w-[1.1rem] stroke-[2]" />
                방장
              </span>
            )}
            <span className="text-muted-foreground text-xs">{transformCreatedDate(nestedReply.createdAt)}</span>
          </div>

          {isMine && (
            <div className="text-muted-foreground flex shrink-0 items-center gap-[0.7rem] text-xs font-semibold">
              {isEditMode ? (
                <>
                  <button type="button" onClick={handleUpdateMode} className="hover:text-foreground inline-flex items-center gap-[0.2rem] transition-colors">
                    <LuX className="h-[1.3rem] w-[1.3rem]" />
                    취소
                  </button>
                  <button type="button" onClick={() => handleNestedReplyUpdate(nestedReply.id)} className="text-primary inline-flex items-center gap-[0.2rem] transition hover:opacity-75">
                    <LuCheck className="h-[1.3rem] w-[1.3rem]" />
                    저장
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={handleUpdateMode} className="hover:text-foreground inline-flex items-center gap-[0.2rem] transition-colors">
                    <LuPencil className="h-[1.3rem] w-[1.3rem]" />
                    수정
                  </button>
                  <button type="button" onClick={() => handleReplyDelete(nestedReply.id)} className="hover:text-destructive inline-flex items-center gap-[0.2rem] transition-colors">
                    <LuTrash2 className="h-[1.3rem] w-[1.3rem]" />
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditMode ? (
          <textarea
            value={text}
            onChange={handleTextchange}
            className="border-border bg-card focus:border-primary/45 mt-[1rem] min-h-[6rem] w-full resize-none rounded-[1.2rem] border px-[1rem] py-[0.9rem] text-sm outline-none"
          />
        ) : (
          <p className="text-foreground/90 mt-[0.65rem] text-sm leading-relaxed break-keep whitespace-pre-line">{nestedReply.text}</p>
        )}
      </div>
    </article>
  );
};

export default NestedReplyItem;
