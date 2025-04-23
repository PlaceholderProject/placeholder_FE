"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import Image from "next/image";
import { BASE_URL } from "@/constants/baseURL";
import { useParams } from "next/navigation";
import { useCreateReply } from "@/hooks/useReply";

const ReplyForm = () => {
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  const { meetupId } = useParams();

  const createReplyMutation = useCreateReply(meetupId!);

  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    if (user.email) {
      setIsLoggedIn(true);
    }

    if (user.profileImage) {
      const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`;
      setProfileImage(imagePath);
    } else {
      setProfileImage("/profile.png");
    }
  }, [user, user.profileImage]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 300) {
      return;
    }
    setContent(event.target.value);
  };

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.trim().length === 0) return;
    createReplyMutation.mutate({ text: content });
    setContent("");
  };

  return (
    <div className="border-y-[1px] border-[#CFCFCF] w-full flex justify-center items-center p-[20px]">
      <form className="flex flex-col gap-2" onSubmit={handleReplySubmit}>
        <div className="border-[1px] border-[#CFCFCF] w-[263px] h-[92px] flex flex-col justify-center items-center rounded-lg p-[10px] gap-2">
          <div className="flex flex-row w-full items-center gap-1">
            <div className="w-[15px] h-[15px] rounded-full overflow-hidden">
              <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="15" height="15" unoptimized={true} />
            </div>
            <div className="text-[7px]">{user.nickname && `${user.nickname}✨`}</div>
          </div>
          <textarea
            className="h-[50px] w-full text-[8px]"
            placeholder={isLoggedIn ? "댓글을 남겨보세요" : "로그인한 이후에 댓글을 작성할 수 있습니다."}
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
