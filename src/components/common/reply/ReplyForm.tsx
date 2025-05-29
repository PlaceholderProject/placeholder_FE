"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import Image from "next/image";
import { BASE_URL } from "@/constants/baseURL";
import { useParams } from "next/navigation";
import { useCreateReply } from "@/hooks/useReply";
import { useCreateScheduleReply } from "@/hooks/useScheduleReply";

const ReplyForm = () => {
  const [content, setContent] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");

  const { meetupId, scheduleId } = useParams();

  const user = useSelector((state: RootState) => state.user.user);

  const createReplyMutation = useCreateReply(meetupId!);
  const createScheduleMutation = useCreateScheduleReply(Number(scheduleId));

  useEffect(() => {
    if (user.profileImage) {
      const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`;
      setProfileImage(imagePath);
    } else {
      setProfileImage("/profile.png");
    }
  }, [user.profileImage]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 300) {
      return;
    }
    setContent(event.target.value);
  };

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.trim().length === 0) return;
    if (scheduleId) {
      createScheduleMutation.mutate({ text: content });
    } else {
      createReplyMutation.mutate({ text: content });
    }
    setContent("");
  };

  return (
    <div className="flex w-full items-center justify-center border-y-[1px] border-[#CFCFCF] p-[20px]">
      <form className="flex flex-col gap-2" onSubmit={handleReplySubmit}>
        <div className="flex h-[92px] w-[263px] flex-col items-center justify-center gap-2 rounded-lg border-[1px] border-[#CFCFCF] p-[10px]">
          <div className="flex w-full flex-row items-center gap-1">
            <div className="h-[15px] w-[15px] overflow-hidden rounded-full">
              <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="15" height="15" unoptimized={true} />
            </div>
            <div className="text-[7px]">{user.nickname && `${user.nickname}✨`}</div>
          </div>
          <textarea
            className="h-[50px] w-full text-[8px]"
            placeholder={user.email ? "댓글을 남겨보세요" : "로그인한 이후에 댓글을 작성할 수 있습니다."}
            onChange={handleContentChange}
            value={content}
            disabled={!user.email}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[6px]">{content.length}/ 300</span>
          <button className="h-[14px] w-[38px] rounded-md bg-[#FBFFA9] text-[6px]">등록</button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
