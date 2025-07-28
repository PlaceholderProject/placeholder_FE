"use client";

import { useCreateNestedReply } from "@/hooks/useReply";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { resetReply } from "@/stores/replySlice";
import SubmitLoader from "../SubmitLoader";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createNestedReplyMutation.mutateAsync({ text: content });
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    // 🔍 개발 환경에서만 지연 시간 추가
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 지연
    }

    setIsVisiableNestedReply(true);
    setContent("");
    setIsSubmitting(false);
  };

  const handleNestedReplyForm = () => {
    setIsVisiableNestedReplyForm(!isVisiableNestedReplyForm);
    setIsVisiableNestedReply(false);
    dispatch(resetReply());
  };

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}

      <div className="flex w-full justify-center">
        <form onSubmit={handleNestedReplySubmit} className="flex w-[80%] flex-col gap-[0.5rem] md:max-w-[80rem]">
          <div className="flex w-full flex-col items-center justify-center gap-[1rem] rounded-[1rem] border-[0.1rem] border-gray-medium bg-white p-[1.5rem]">
            <div className="justify-betwee flex w-full text-sm">@ {nestedReply.user.nickname ? nestedReply.user.nickname : rootReply.user.nickname}</div>
            <textarea
              ref={textareaRef}
              className="h-[50px] w-full text-sm"
              placeholder={user.email ? `${nestedReply.user.nickname ? nestedReply.user.nickname : rootReply.user.nickname}님에게 답글 다는 중` : "로그인한 이후에 댓글을 작성할 수 있습니다."}
              onChange={handleContentChange}
              value={content}
              disabled={!user.email}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{content.length}/ 300</span>
            <span className="flex gap-2">
              <button type="button" onClick={handleNestedReplyForm} className="h-[2.5rem] w-[6rem] rounded-[0.5rem] bg-gray-medium text-sm">
                닫기
              </button>
              <button type="submit" className="h-[2.5rem] w-[6rem] rounded-[0.5rem] bg-secondary-dark text-sm">
                등록
              </button>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default NestedReplyForm;
