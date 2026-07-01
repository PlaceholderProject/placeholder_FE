"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import Image from "next/image";
import { BASE_URL } from "@/constants/baseURL";
import { useParams } from "next/navigation";
import { useCreateReply } from "@/hooks/useReply";
import { useCreateScheduleReply } from "@/hooks/useScheduleReply";
import Link from "next/link";
import { toast } from "sonner";
import { LuLoaderCircle, LuLockKeyhole, LuSendHorizontal } from "react-icons/lu";

const MAX_REPLY_LENGTH = 300;

const getProfileImage = (profileImage?: string | null) => {
  if (!profileImage) return "/profile.png";
  return profileImage.startsWith("http") ? profileImage : `${BASE_URL}/${profileImage}`;
};

const ReplyForm = ({ variant = "default", canWrite = true, disabledReason }: { variant?: "default" | "card"; canWrite?: boolean; disabledReason?: string }) => {
  const [content, setContent] = useState("");
  const { meetupId, scheduleId } = useParams();

  const meetupNumberId = Number(meetupId);
  const scheduleNumberId = Number(scheduleId);

  const user = useSelector((state: RootState) => state.user.user);

  const createReplyMutation = useCreateReply(meetupNumberId);
  const createScheduleMutation = useCreateScheduleReply(scheduleNumberId);
  const isCard = variant === "card";
  const isDisabled = isCard ? !canWrite : !user.email;
  const isSubmitting = createReplyMutation.isPending || createScheduleMutation.isPending;
  const profileImage = getProfileImage(user.profileImage);

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value.slice(0, MAX_REPLY_LENGTH));
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isDisabled) {
      toast.info(disabledReason ?? "로그인 후 댓글을 작성할 수 있어요.");
      return;
    }

    const text = content.trim();
    if (!text || isSubmitting) return;

    try {
      if (scheduleId) {
        await createScheduleMutation.mutateAsync({ text });
      } else {
        await createReplyMutation.mutateAsync({ text });
      }
      setContent("");
    } catch {
      toast.error("댓글 등록 중 문제가 발생했습니다.");
    }
  };

  if (isCard && isDisabled) {
    return (
      <div className="border-border border-t p-[1.8rem] md:p-[2rem]">
        <div className="border-border bg-muted/45 flex flex-col gap-[1.2rem] rounded-[1.6rem] border px-[1.4rem] py-[1.5rem] md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-[1rem]">
            <span className="bg-card text-muted-foreground grid h-[3.6rem] w-[3.6rem] shrink-0 place-items-center rounded-full">
              <LuLockKeyhole className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-sm font-bold">댓글 작성 권한이 필요해요</p>
              <p className="text-muted-foreground mt-[0.3rem] text-sm leading-relaxed break-keep">{disabledReason}</p>
            </div>
          </div>
          {!user.email && (
            <Link
              href="/login"
              className="bg-foreground text-background inline-flex h-[3.6rem] shrink-0 items-center justify-center rounded-full px-[1.4rem] text-sm font-semibold transition hover:opacity-90"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={isCard ? "border-border border-t p-[1.8rem] md:p-[2rem]" : "border-border bg-card rounded-[2rem] border p-[1.8rem] md:p-[2rem]"}>
      <form onSubmit={handleReplySubmit} className="flex flex-col gap-[0.9rem]">
        <div className="border-border bg-input-background focus-within:border-primary/40 flex items-start gap-[1rem] rounded-[1.8rem] border px-[1rem] py-[1rem] transition-colors">
          <div className="bg-muted relative mt-[0.2rem] h-[3.8rem] w-[3.8rem] shrink-0 overflow-hidden rounded-full">
            <Image unoptimized src={profileImage} alt={user.nickname ?? "방문자"} fill sizes="3.8rem" className="object-cover" />
          </div>
          <textarea
            className="placeholder:text-muted-foreground/75 min-h-[6.6rem] flex-1 resize-none bg-transparent py-[0.5rem] text-sm leading-relaxed outline-none"
            placeholder={isDisabled ? (disabledReason ?? "로그인 후 댓글을 작성할 수 있어요.") : "댓글을 남겨보세요"}
            onChange={handleContentChange}
            value={content}
            disabled={isDisabled}
          />
          <button
            type="submit"
            disabled={isDisabled || isSubmitting || content.trim().length === 0}
            className="bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground mt-auto grid h-[3.8rem] w-[3.8rem] shrink-0 place-items-center rounded-full transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-100"
            aria-label="댓글 등록"
          >
            {isSubmitting ? <LuLoaderCircle className="h-[1.7rem] w-[1.7rem] animate-spin stroke-[2]" /> : <LuSendHorizontal className="h-[1.7rem] w-[1.7rem] stroke-[2]" />}
          </button>
        </div>

        <div className="flex items-center justify-between px-[0.3rem] text-xs">
          <p className="text-muted-foreground">{user.nickname ? `${user.nickname}님으로 작성` : "방문자"}</p>
          <p className={content.length >= MAX_REPLY_LENGTH ? "text-primary font-semibold" : "text-muted-foreground"}>
            {content.length}/{MAX_REPLY_LENGTH}
          </p>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
