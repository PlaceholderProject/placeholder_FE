"use client";

import { type ChangeEvent, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import { ReplyItemProps } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import NestedReplyItem from "./NestedReplyItem";
import { useDeleteReply, useEditReply } from "@/hooks/useReply";
import NestedReplyForm from "./NestedReplyForm";
import { useDeleteScheduleReply, useUpdateScheduleReply } from "@/hooks/useScheduleReply";
import { toast } from "sonner";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { LuCheck, LuChevronDown, LuChevronUp, LuCrown, LuMessageCircle, LuPencil, LuTrash2, LuX } from "react-icons/lu";

const getReplyImage = (image?: string | null) => {
  if (!image) return "/profile.png";
  return image.startsWith("http") ? image : `${BASE_URL}/${image}`;
};

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, allReplies, meetupId, scheduleId, canWrite = true, disabledReason }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const [text, setText] = useState(reply.text);
  const [isVisibleNestedReply, setIsVisibleNestedReply] = useState(false);
  const [isVisibleNestedReplyForm, setIsVisibleNestedReplyForm] = useState(false);

  const editReplyMutation = useEditReply(meetupId);
  const deleteReplyMutation = useDeleteReply(meetupId);
  const editScheduleReplyMutation = useUpdateScheduleReply(Number(scheduleId));
  const deleteScheduleReplyMutation = useDeleteScheduleReply(Number(scheduleId));

  const nestedReplies = allReplies.filter(r => r.root === reply.id).reverse();
  const isMine = reply.user.nickname === user.nickname;

  const handleNestedReplyFormToggle = () => {
    if (!canWrite) {
      toast.info(disabledReason ?? "댓글 작성 권한이 필요해요.");
      return;
    }
    setIsVisibleNestedReplyForm(prev => !prev);
  };

  const handleReplyDelete = async (replyId: number) => {
    showConfirmToast({
      message: "정말로 댓글을 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          if (scheduleId) {
            await deleteScheduleReplyMutation.mutateAsync(replyId);
          } else if (meetupId) {
            await deleteReplyMutation.mutateAsync(replyId);
          } else {
            toast.error("삭제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
            return;
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
    setText(reply.text);
  };

  const handleReplyUpdate = async (replyId: number) => {
    const nextText = text.trim();
    if (!nextText) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    showConfirmToast({
      message: "정말로 댓글을 수정하시겠습니까?",
      confirmText: "수정",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          if (scheduleId) {
            await editScheduleReplyMutation.mutateAsync({ text: nextText, replyId });
          } else if (meetupId) {
            await editReplyMutation.mutateAsync({ text: nextText, replyId });
          }
          toast.success("정상적으로 수정되었습니다.");
          setIsEditMode(false);
        } catch {
          toast.error("댓글 수정 중 문제가 발생했습니다.");
        }
      },
    });
  };

  return (
    <article className="flex gap-[1rem]">
      <div className="bg-muted relative h-[3.8rem] w-[3.8rem] shrink-0 overflow-hidden rounded-full">
        <Image unoptimized src={getReplyImage(reply.user.image)} alt={reply.user.nickname} fill sizes="3.8rem" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="bg-muted/55 rounded-[1.6rem] rounded-tl-[0.5rem] px-[1.3rem] py-[1.1rem]">
          <div className="flex flex-wrap items-start justify-between gap-[0.8rem]">
            <div className="flex min-w-0 flex-wrap items-center gap-[0.6rem]">
              <span className="text-foreground text-sm font-bold">{reply.user.nickname}</span>
              {reply.isOrganizer && (
                <span className="bg-primary-soft text-primary inline-flex items-center gap-[0.3rem] rounded-full px-[0.6rem] py-[0.2rem] text-[1.1rem] font-bold">
                  <LuCrown className="fill-primary/20 h-[1.2rem] w-[1.2rem] stroke-[2]" />
                  방장
                </span>
              )}
              <span className="text-muted-foreground text-xs">{transformCreatedDate(reply.createdAt)}</span>
            </div>

            {isMine && (
              <div className="text-muted-foreground flex shrink-0 items-center gap-[0.7rem] text-xs font-semibold">
                {isEditMode ? (
                  <>
                    <button type="button" onClick={handleUpdateMode} className="hover:text-foreground inline-flex items-center gap-[0.2rem] transition-colors">
                      <LuX className="h-[1.3rem] w-[1.3rem]" />
                      취소
                    </button>
                    <button type="button" onClick={() => handleReplyUpdate(reply.id)} className="text-primary inline-flex items-center gap-[0.2rem] transition hover:opacity-75">
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
                    <button type="button" onClick={() => handleReplyDelete(reply.id)} className="hover:text-destructive inline-flex items-center gap-[0.2rem] transition-colors">
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
              className="border-border bg-card focus:border-primary/45 mt-[1rem] min-h-[7rem] w-full resize-none rounded-[1.2rem] border px-[1rem] py-[0.9rem] text-sm leading-relaxed outline-none"
            />
          ) : (
            <p className="text-foreground/90 mt-[0.7rem] text-sm leading-relaxed break-keep whitespace-pre-line">{reply.text}</p>
          )}
        </div>

        <div className="mt-[0.8rem] flex flex-wrap items-center gap-[1rem] pl-[0.6rem] text-xs font-semibold">
          <button type="button" onClick={handleNestedReplyFormToggle} className="text-muted-foreground hover:text-primary inline-flex items-center gap-[0.35rem] transition-colors">
            <LuMessageCircle className="h-[1.4rem] w-[1.4rem] stroke-[1.9]" />
            답글
          </button>

          {nestedReplies.length > 0 && (
            <button type="button" onClick={() => setIsVisibleNestedReply(prev => !prev)} className="text-primary inline-flex items-center gap-[0.35rem] transition hover:opacity-75">
              {isVisibleNestedReply ? <LuChevronUp className="h-[1.4rem] w-[1.4rem]" /> : <LuChevronDown className="h-[1.4rem] w-[1.4rem]" />}
              답글 {nestedReplies.length}개 {isVisibleNestedReply ? "접기" : "보기"}
            </button>
          )}
        </div>

        {isVisibleNestedReply && nestedReplies.length > 0 && (
          <div className="mt-[1rem] space-y-[1.2rem]">
            {nestedReplies.map(nestedReply => (
              <NestedReplyItem key={nestedReply.id} nestedReply={nestedReply} meetupId={meetupId} scheduleId={scheduleId} />
            ))}
          </div>
        )}

        {isVisibleNestedReplyForm && (
          <NestedReplyForm
            rootReply={reply}
            meetupId={meetupId}
            scheduleId={scheduleId}
            setIsVisiableNestedReplyForm={setIsVisibleNestedReplyForm}
            isVisiableNestedReplyForm={isVisibleNestedReplyForm}
            setIsVisiableNestedReply={setIsVisibleNestedReply}
          />
        )}
      </div>
    </article>
  );
};

export default ReplyItem;
