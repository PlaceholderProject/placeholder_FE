"use client";

import { useCreateNestedReply } from "@/hooks/useReply";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { Dispatch, SetStateAction } from "react";
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
    <div className="w-full flex">
      <form className="flex flex-col gap-2 w-full" onSubmit={handleNestedReplySubmit}>
        <div className="border-[1px] border-[#CFCFCF] w-full h-[70px] flex flex-col justify-center items-center rounded-lg p-[10px] gap-2">
          <div className="text-[8px] w-full flex justify-between">@ {nestedReply.user.nickname ? nestedReply.user.nickname : rootReply.user.nickname}</div>
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
            <button type="button" onClick={handleNestedReplyForm} className="bg-[#CFCFCF] w-[38px] h-[14px] text-[6px] rounded-md ">
              닫기
            </button>
            <button type="submit" className="bg-[#FBFFA9] w-[38px] h-[14px] text-[6px] rounded-md ">
              등록
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default NestedReplyForm;
