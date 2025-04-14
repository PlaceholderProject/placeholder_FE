import { BASE_URL } from "@/constants/baseURL";
import { Reply } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import React from "react";

const NestedReplyItem = ({ nestedReply }: { nestedReply: Reply }) => {
  return (
    <div className="mx-4 my-2">
      <div className="flex flex-row gap-1 items-center">
        <div className="w-[15px] h-[15px] rounded-full overflow-hidden">
          <Image
            src={nestedReply.user.image ? (nestedReply.user.image.startsWith("http") ? nestedReply.user.image : `${BASE_URL}${nestedReply.user.image}`) : "/profile.png"}
            alt="프로필 이미지"
            width="15"
            height="15"
            unoptimized={true}
          />
        </div>
        <span>{nestedReply.user.nickname}✨</span>
        <span>{transformCreatedDate(nestedReply.createdAt)}</span>
      </div>
      <div className="pl-6">{nestedReply.text}</div>
    </div>
  );
};

export default NestedReplyItem;
