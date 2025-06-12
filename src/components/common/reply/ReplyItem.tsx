"use client";

import { BASE_URL } from "@/constants/baseURL";
import { ReplyItemProps } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import NestedReplyItem from "./NestedReplyItem";
import { useState } from "react";
import { useDeleteReply, useEditReply } from "@/hooks/useReply";
import NestedReplyForm from "./NestedReplyForm";
import { useDeleteScheduleReply, useUpdateScheduleReply } from "@/hooks/useScheduleReply";

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, allReplies, meetupId, scheduleId }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const [text, setText] = useState(reply.text);
  const [isVisiableNestedReply, setIsVisiableNestedReply] = useState(false);
  const [isVisiableNestedReplyForm, setIsVisiableNestedReplyForm] = useState(false);

  const editReplyMutation = useEditReply(meetupId);
  const deleteReplyMutation = useDeleteReply(meetupId);
  const editScheduleReplyMutation = useUpdateScheduleReply(Number(scheduleId));
  const deleteScheduleReplyMutation = useDeleteScheduleReply(Number(scheduleId));

  const nestedReplies = allReplies.filter(r => r.root === reply.id).reverse();

  const handleNestedReplyFormToggle = () => {
    setIsVisiableNestedReplyForm(!isVisiableNestedReplyForm);
  };

  const handleReplyDelete = async (replyId: number) => {
    if (confirm("정말로 댓글을 삭제하시겠습니까?")) {
      if (scheduleId) {
        await deleteScheduleReplyMutation.mutate(replyId);
      } else if (meetupId) {
        await deleteReplyMutation.mutate(replyId);
      }
      alert("정상적으로 삭제되었습니다.");
    }
  };

  const handleTextchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleUpdateMode = () => {
    setIsEditMode(!isEditMode);
    setText(reply.text);
  };

  const handleReplyUpdate = async (replyId: number) => {
    if (confirm("정말로 댓글을 수정하시겠습니까?")) {
      if (scheduleId) {
        await editScheduleReplyMutation.mutate({ text, replyId });
      } else if (meetupId) {
        await editReplyMutation.mutate({ text, replyId });
      }
      alert("정상적으로 수정되었습니다.");
      setIsEditMode(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-[1rem]">
      {/* 1️⃣ 댓글 정보 */}
      <div className="flex w-full justify-between">
        <div className="flex flex-row items-center gap-[0.5rem]">
          <div className="h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full">
            <Image
              src={reply.user.image ? (reply.user.image.startsWith("http") ? reply.user.image : `${BASE_URL}${reply.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              width="30"
              height="30"
              unoptimized={true}
            />
          </div>
          <span className="text-sm">
            {reply.isOrganizer && "👑 "}
            {reply.user.nickname} ✨
          </span>
          <span className="text-gray-dark text-sm">{transformCreatedDate(reply.createdAt)}</span>
        </div>
        {reply.user.nickname === user.nickname ? (
          !isEditMode ? (
            <span className="text-gray-dark flex gap-[1rem]">
              <button onClick={handleUpdateMode}>수정</button>
              <button onClick={() => handleReplyDelete(reply.id)}>삭제</button>
            </span>
          ) : (
            <span className="text-gray-dark flex gap-[1rem]">
              <button onClick={handleUpdateMode}>취소</button>
              <button onClick={() => handleReplyUpdate(reply.id)}>수정</button>
            </span>
          )
        ) : null}
      </div>
      {/* 2️⃣ 댓글 내용 */}
      {isEditMode ? <textarea value={text} onChange={handleTextchange} className="mx-[3rem] my-[1rem] w-[90%] rounded-[1rem] p-[1rem]" /> : <div className="w-full px-[3rem]">{reply.text}</div>}
      {/* 3️⃣ 답글 영역 */}
      <div className="flex w-full flex-col items-start gap-[0.5rem] pl-[3rem]">
        {/* 3-1. 답글 더보기 & 접기 */}
        {nestedReplies.length > 0 &&
          (isVisiableNestedReply ? (
            <div className="flex w-full flex-col items-start gap-[1rem]">
              {nestedReplies.map(nestedReply => (
                <NestedReplyItem key={nestedReply.id} nestedReply={nestedReply} meetupId={meetupId} handleReplyUpdate={handleReplyUpdate} />
              ))}
              <button onClick={() => setIsVisiableNestedReply(false)} className="text-gray-dark text-sm">
                ---- 답글 접기
              </button>
            </div>
          ) : (
            <button onClick={() => setIsVisiableNestedReply(true)} className="text-gray-dark text-sm">
              ---- 답글 {nestedReplies.length}개 더 보기
            </button>
          ))}
        {/* 3-2. 답글 폼 */}
        {isVisiableNestedReplyForm ? (
          <NestedReplyForm
            rootReply={reply}
            meetupId={meetupId}
            setIsVisiableNestedReplyForm={setIsVisiableNestedReplyForm}
            isVisiableNestedReplyForm={isVisiableNestedReplyForm}
            setIsVisiableNestedReply={setIsVisiableNestedReply}
          />
        ) : (
          <button onClick={handleNestedReplyFormToggle} className="text-gray-dark text-sm">
            답글달기
          </button>
        )}
      </div>
    </div>
  );
};

export default ReplyItem;
