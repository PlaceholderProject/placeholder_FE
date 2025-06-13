"use client";

import { useCreateNestedReply } from "@/hooks/useReply";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { resetReply } from "@/stores/replySlice";

const NestedReplyForm = ({
  rootReply,
  meetupId,
  isVisiableNestedReplyForm,
  setIsVisiableNestedReplyForm,
  setIsVisiableNestedReply,
}: {
  rootReply: Reply;
  meetupId: string | string[];
  isVisiableNestedReplyForm: boolean;
  setIsVisiableNestedReplyForm: Dispatch<SetStateAction<boolean>>;
  setIsVisiableNestedReply: Dispatch<SetStateAction<boolean>>;
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const nestedReply = useSelector((state: RootState) => state.reply.reply);

  const dispatch = useDispatch();

  const createNestedReplyMutation = useCreateNestedReply(nestedReply.id ? nestedReply.id : rootReply.id, meetupId);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 300) {
      return;
    }
    setContent(event.target.value);
  };

  const handleNestedReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.trim().length === 0) return;
    if (rootReply.id) {
      createNestedReplyMutation.mutate({ text: content });
    }
    setIsVisiableNestedReply(true);
    setContent("");
  };

  const handleNestedReplyForm = () => {
    setIsVisiableNestedReplyForm(!isVisiableNestedReplyForm);
    setIsVisiableNestedReply(false);
    dispatch(resetReply());
  };

  return (
    <div className="flex w-full">
      <form className="flex w-full flex-col gap-2" onSubmit={handleNestedReplySubmit}>
        <div className="flex h-[70px] w-full flex-col items-center justify-center gap-2 rounded-lg border-[1px] border-[#CFCFCF] p-[10px]">
          <div className="flex w-full justify-between text-[8px]">@ {nestedReply.user.nickname ? nestedReply.user.nickname : rootReply.user.nickname}</div>
          <textarea
            ref={textareaRef}
            className="h-[50px] w-full text-[8px]"
            placeholder={user.email ? `${nestedReply.user.nickname ? nestedReply.user.nickname : rootReply.user.nickname}님에게 답글 다는 중` : "로그인한 이후에 댓글을 작성할 수 있습니다."}
            onChange={handleContentChange}
            value={content}
            disabled={!user.email}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[6px]">{content.length}/ 300</span>
          <span className="flex gap-2">
            <button type="button" onClick={handleNestedReplyForm} className="h-[14px] w-[38px] rounded-md bg-[#CFCFCF] text-[6px]">
              닫기
            </button>
            <button type="submit" className="h-[14px] w-[38px] rounded-md bg-[#FBFFA9] text-[6px]">
              등록
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default NestedReplyForm;
