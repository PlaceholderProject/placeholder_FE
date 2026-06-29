"use client";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { BASE_URL } from "@/constants/baseURL";
import { useDeleteReply } from "@/hooks/useReply";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const NestedReplyItem = ({ nestedReply, meetupId, handleReplyUpdate }: { nestedReply: Reply; meetupId: number; handleReplyUpdate: (replyId: number) => void }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const deleteReplyMutation = useDeleteReply(meetupId);

  const [text, setText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleReplyDelete = async (replyId: number) => {
    showConfirmToast({
      message: "정말로 답글을 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteReplyMutation.mutateAsync(replyId);
          toast.success("정상적으로 삭제되었습니다.");
        } catch {
          toast.error("삭제 중 문제가 발생했습니다.");
        }
      },
    });
  };

  const handleTextchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleUpdateMode = () => {
    setIsEditMode(!isEditMode);
    setText(nestedReply.text);
  };

  return (
    <div className="mt-[0.5rem] flex w-full flex-col items-start gap-[0.5rem]">
      <div className="flex w-full justify-between">
        <span className="flex flex-row items-center gap-[0.5rem]">
          <div className="relative h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full">
            <Image
              src={nestedReply.user.image ? (nestedReply.user.image.startsWith("http") ? nestedReply.user.image : `${BASE_URL}/${nestedReply.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm">
            {nestedReply.isOrganizer && "👑 "}
            {nestedReply.user.nickname} ✨
          </span>
          <span className="text-gray-dark text-sm">{transformCreatedDate(nestedReply.createdAt)}</span>
        </span>
        {nestedReply.user.nickname === user.nickname ? (
          !isEditMode ? (
            <span className="text-gray-dark flex gap-[1rem]">
              <button onClick={handleUpdateMode}>수정</button>
              <button onClick={() => handleReplyDelete(nestedReply.id)}>삭제</button>
            </span>
          ) : (
            <span className="text-gray-dark flex gap-[1rem]">
              <button onClick={handleUpdateMode}>취소</button>
              <button onClick={() => handleReplyUpdate(nestedReply.id)}>수정</button>
            </span>
          )
        ) : null}
      </div>
      {isEditMode ? <textarea value={text} onChange={handleTextchange} className="mx-[3rem] my-[1rem] w-[90%] rounded-[1rem] p-[1rem]" /> : <div className="w-full px-[3rem]">{nestedReply.text}</div>}
    </div>
  );
};

export default NestedReplyItem;
