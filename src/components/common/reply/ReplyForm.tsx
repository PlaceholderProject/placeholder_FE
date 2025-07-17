"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import Image from "next/image";
import { BASE_URL } from "@/constants/baseURL";
import { useParams } from "next/navigation";
import { useCreateReply } from "@/hooks/useReply";
import { useCreateScheduleReply } from "@/hooks/useScheduleReply";
import SubmitLoader from "../SubmitLoader";

const ReplyForm = () => {
  const [content, setContent] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");

  const { meetupId, scheduleId } = useParams();

  const user = useSelector((state: RootState) => state.user.user);

  const createReplyMutation = useCreateReply(meetupId!);
  const createScheduleMutation = useCreateScheduleReply(Number(scheduleId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user.profileImage) {
      const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}/${user.profileImage}`;
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

    if (isSubmitting) return;
    setIsSubmitting(true);
    // 🔍 개발 환경에서만 지연 시간 추가
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 지연
    }
    setIsSubmitting(false);
    setContent("");
  };

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}
      <div className="flex w-full items-center justify-center border-y-[1px] border-gray-medium p-[2rem]">
        <form onSubmit={handleReplySubmit} className="flex w-[80%] flex-col gap-[0.5rem] md:max-w-[80rem]">
          <div className="flex w-full flex-col items-center justify-center gap-[1rem] rounded-[1rem] border-[0.1rem] border-gray-medium bg-white p-[1.5rem]">
            <div className="flex w-full flex-row items-center gap-[0.5rem]">
              <div className="h-[2rem] w-[2rem] overflow-hidden rounded-full">
                <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="25" height="25" unoptimized={true} />
              </div>
              <span>{user.nickname && `${user.nickname} ✨`}</span>
            </div>
            <textarea
              className="min-h-[10rem] w-full"
              placeholder={user.email ? "댓글을 남겨보세요" : "로그인한 이후에 댓글을 작성할 수 있습니다."}
              onChange={handleContentChange}
              value={content}
              disabled={!user.email}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{content.length}/ 300</span>
            <button className="h-[2.5rem] w-[6rem] rounded-[0.5rem] bg-secondary-dark text-sm">등록</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReplyForm;
