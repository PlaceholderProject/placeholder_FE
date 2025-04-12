"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import Image from "next/image";
import { BASE_URL } from "@/constants/baseURL";
import { createNestedReply, createReply } from "@/services/reply.service";
import { useParams } from "next/navigation";

const ReplyForm = () => {
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parent, setParent] = useState<number | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const parentReply = useSelector((state: RootState) => state.reply);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const params = useParams();

  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    if (user.email) {
      setIsLoggedIn(true);
    }

    if (parentReply.reply.user.nickname && textareaRef.current) {
      setRecipient(`@${parentReply.reply.user.nickname}`);
      setParent(parentReply.reply.id);
      textareaRef.current.focus();
    }

    if (user.profileImage) {
      const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`;
      setProfileImage(imagePath);
    } else {
      setProfileImage("/profile.png");
    }
  }, [user, user.profileImage, parentReply]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 300) {
      return;
    }
    setContent(event.target.value);
  };

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (params.meetupId) {
      await createReply({ text: content }, params.meetupId);
    }
    setContent("");
  };

  const handleNestedReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (parent) {
      await createNestedReply({ text: content }, parent);
    }
  };

  const cancelNestedReply = () => {
    setParent(null);
    setRecipient(null);
  };

  return (
    <div className="border-y-[1px] border-[#CFCFCF] w-full flex justify-center items-center p-[20px]">
      <form className="flex flex-col gap-2" onSubmit={parent ? handleNestedReplySubmit : handleReplySubmit}>
        <div className="border-[1px] border-[#CFCFCF] w-[263px] h-[92px] flex flex-col justify-center items-center rounded-lg p-[10px] gap-2">
          <div className="flex flex-row w-full items-center gap-1">
            <div className="w-[15px] h-[15px] rounded-full overflow-hidden">
              <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="15" height="15" unoptimized={true} />
            </div>
            <div className="text-[7px]">{user.nickname && `${user.nickname}✨`}</div>
          </div>
          {recipient && (
            <div className="text-[8px] w-full flex justify-between">
              {recipient}
              <button type="button" onClick={cancelNestedReply} className="">
                x
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="h-[50px] w-full text-[8px]"
            placeholder={isLoggedIn ? (recipient ? `${recipient}님에게 답글 다는 중` : "댓글을 남겨보세요") : "로그인한 이후에 댓글을 작성할 수 있습니다."}
            onChange={handleContentChange}
            value={content}
            disabled={!isLoggedIn}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[6px]">{content.length}/ 300</span>
          <button className="bg-[#FBFFA9] w-[38px] h-[14px] text-[6px] rounded-md ">등록</button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
