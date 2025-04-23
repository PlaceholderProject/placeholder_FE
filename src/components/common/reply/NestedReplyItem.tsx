"use client";
import { BASE_URL } from "@/constants/baseURL";
import { useDeleteReply } from "@/hooks/useReply";
import { setReply } from "@/stores/replySlice";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const NestedReplyItem = ({
  nestedReply,
  meetupId,
  handleReplyUpdate,
  setIsVisiableNestedReplyForm,
}: {
  nestedReply: Reply;
  meetupId: string | string[];
  handleReplyUpdate: (replyId: number) => void;
  setIsVisiableNestedReplyForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const deleteReplyMutation = useDeleteReply(meetupId);

  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleReplyDelete = async (replyId: number) => {
    if (confirm("정말로 답글을 삭제하시겠습니까?")) {
      await deleteReplyMutation.mutate(replyId);
      alert("정상적으로 삭제되었습니다.");
    }
  };

  const handleTextchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleUpdateMode = () => {
    setIsEditMode(!isEditMode);
    setText(nestedReply.text);
  };

  const selectNickname = () => {
    setIsVisiableNestedReplyForm(true);
    dispatch(setReply(nestedReply));
  };

  return (
    <div className="mx-4 my-2">
      <div className="flex justify-between">
        <span className="flex flex-row gap-1 items-center">
          <div className="w-[15px] h-[15px] rounded-full overflow-hidden">
            <Image
              src={nestedReply.user.image ? (nestedReply.user.image.startsWith("http") ? nestedReply.user.image : `${BASE_URL}${nestedReply.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              width="15"
              height="15"
              unoptimized={true}
            />
          </div>
          <span>
            {nestedReply.isOrganizer && "👑 "}
            {nestedReply.user.nickname}✨
          </span>
          <span className="text-[#B7B7B7]">{transformCreatedDate(nestedReply.createdAt)}</span>
        </span>
        {nestedReply.user.nickname === user.nickname && (
          <span className="flex gap-2">
            <button
              onClick={() => {
                handleUpdateMode();
              }}
            >
              수정
            </button>
            <button onClick={() => handleReplyDelete(nestedReply.id)}>삭제</button>
          </span>
        )}
      </div>
      {isEditMode ? (
        <div>
          <textarea value={text} onChange={handleTextchange} />
          <button onClick={handleUpdateMode}>취소</button>
          <button onClick={() => handleReplyUpdate(nestedReply.id)}>수정</button>
        </div>
      ) : (
        <div onClick={selectNickname} className="pl-6">
          <span>
            @{nestedReply.recipient} {nestedReply.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default NestedReplyItem;
