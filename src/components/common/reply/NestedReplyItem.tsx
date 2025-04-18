import { BASE_URL } from "@/constants/baseURL";
import { deleteReply } from "@/services/reply.service";
import { RootState } from "@/stores/store";
import { Reply } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const NestedReplyItem = ({ nestedReply }: { nestedReply: Reply }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const handleReplyDelete = async (replyId: number) => {
    if (confirm("정말로 답글을 삭제하시겠습니까?")) {
      await deleteReply(replyId);
      alert("정상적으로 삭제되었습니다.");
    }
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
            <button>수정</button>
            <button onClick={() => handleReplyDelete(nestedReply.id)}>삭제</button>
          </span>
        )}
      </div>
      <div className="pl-6">
        <span>@{nestedReply.recipient}</span> {nestedReply.text}
      </div>
    </div>
  );
};

export default NestedReplyItem;
