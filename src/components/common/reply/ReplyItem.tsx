"use client";

import { BASE_URL } from "@/constants/baseURL";
import { setReply } from "@/stores/replySlice";
import { ReplyItemProps } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import NestedReplyItem from "./NestedReplyItem";
import { useState } from "react";
import { deleteReply, editReply } from "@/services/reply.service";

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, allReplies }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [isVisiableNestedReply, setIsVisiableNestedReply] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [text, setText] = useState(reply.text);

  const nestedReplies = allReplies.filter(r => r.root === reply.id);

  const handleReplySave = () => {
    dispatch(setReply({ id: reply.id, root: reply.root, recipient: reply.recipient, user: { nickname: reply.user.nickname, image: reply.user.image }, text: reply.text, createdAt: reply.createdAt }));
  };

  const handleNestedReplyToggle = () => {
    setIsVisiableNestedReply(!isVisiableNestedReply);
  };

  const handleReplyDelete = async (replyId: number) => {
    if (confirm("정말로 댓글을 삭제하시겠습니까?")) {
      await deleteReply(replyId);
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
      await editReply(text, replyId);
      alert("정상적으로 수정되었습니다.");
      setIsEditMode(false);
    }
  };

  return (
    <div className="m-2 text-[10px]">
      <div className="flex justify-between">
        <span className="flex flex-row gap-1 items-center">
          <div className="w-[15px] h-[15px] rounded-full overflow-hidden">
            <Image
              src={reply.user.image ? (reply.user.image.startsWith("http") ? reply.user.image : `${BASE_URL}${reply.user.image}`) : "/profile.png"}
              alt="프로필 이미지"
              width="15"
              height="15"
              unoptimized={true}
            />
          </div>
          <span>{reply.user.nickname}✨</span>
          <span className="text-[#B7B7B7]">{transformCreatedDate(reply.createdAt)}</span>
        </span>
        {reply.user.nickname === user.nickname && (
          <span className="flex gap-2">
            <button onClick={handleUpdateMode}>수정</button>
            <button onClick={() => handleReplyDelete(reply.id)}>삭제</button>
          </span>
        )}
      </div>
      {isEditMode ? (
        <div>
          <textarea value={text} onChange={handleTextchange} />
          <button onClick={handleUpdateMode}>취소</button>
          <button onClick={() => handleReplyUpdate(reply.id)}>수정</button>
        </div>
      ) : (
        <div className="pl-6 py-2">{reply.text}</div>
      )}
      {user.email && (
        <button className="pl-6 text-[#B7B7B7] text-[9px]" onClick={handleReplySave}>
          답글달기
        </button>
      )}

      {nestedReplies.length > 0 && (
        <div>
          {!isVisiableNestedReply && (
            <button onClick={handleNestedReplyToggle} className="px-6 py-2 text-[#B7B7B7]">
              ---- 답글 {nestedReplies.length}개 더 보기
            </button>
          )}
          {isVisiableNestedReply && (
            <div>
              {nestedReplies.map(nestedReply => (
                <NestedReplyItem key={nestedReply.id} nestedReply={nestedReply} />
              ))}
              <button onClick={handleNestedReplyToggle} className="px-6 text-[#B7B7B7]">
                답글 접기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;
