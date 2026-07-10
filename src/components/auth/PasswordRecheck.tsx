"use client";

import { recheckPassword } from "@/services/auth.service";
import { setIsPasswordRechecked } from "@/stores/authSlice";
import { RootState } from "@/stores/store";

import Link from "next/link";
import { useState } from "react";
import { LuEye, LuEyeOff, LuLockKeyhole } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const PasswordRecheck = () => {
  const [password, setPassword] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setIsVisivlePassword(!isVisivlePassword);
  };

  const handlePasswordRecheckFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await recheckPassword(password);
      if (response) {
        toast.success("비밀번호가 일치합니다.");
        dispatch(setIsPasswordRechecked(!isPasswordRechecked));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-border bg-card rounded-[2rem] border p-[1.8rem] md:p-[2rem]">
      <form onSubmit={handlePasswordRecheckFormSubmit} className="space-y-[1.4rem]">
        <div>
          <h2 className="text-foreground text-lg font-bold">비밀번호 재확인</h2>
          <p className="text-muted-foreground mt-[0.5rem] text-sm leading-relaxed">회원정보 보호를 위해 비밀번호를 다시 확인합니다.</p>
        </div>

        <div className="border-border focus-within:border-primary focus-within:ring-primary/10 flex h-[4.6rem] items-center gap-[0.9rem] rounded-[1.4rem] border px-[1.3rem] transition-all focus-within:ring-4">
          <LuLockKeyhole className="text-muted-foreground h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
          <input
            type={isVisivlePassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            aria-label={isVisivlePassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {isVisivlePassword ? <LuEyeOff className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" /> : <LuEye className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />}
          </button>
        </div>

        <div className="grid gap-[0.8rem] sm:grid-cols-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground h-[4.4rem] rounded-[1.4rem] text-sm font-semibold transition hover:opacity-90 disabled:cursor-wait disabled:opacity-55"
          >
            {isSubmitting ? "확인 중" : "확인"}
          </button>
          <Link
            href="/account"
            className="border-border text-muted-foreground hover:bg-muted flex h-[4.4rem] items-center justify-center rounded-[1.4rem] border text-sm font-semibold transition-colors"
          >
            돌아가기
          </Link>
        </div>
      </form>
    </section>
  );
};

export default PasswordRecheck;
