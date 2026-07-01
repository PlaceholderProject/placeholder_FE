"use client";

import Link from "next/link";
import React, { useState } from "react";
import { LuArrowRight, LuCircleX, LuEye, LuEyeOff, LuLockKeyhole, LuMail } from "react-icons/lu";
import { login } from "@/services/auth.service";
import { toast } from "sonner";

const AuthModeTabs = () => {
  return (
    <div className="border-border bg-card mb-[2rem] flex rounded-full border p-[0.4rem]">
      <Link href="/login" className="bg-foreground text-background flex-1 rounded-full py-[0.9rem] text-center text-sm font-semibold transition-colors">
        로그인
      </Link>
      <Link href="/signup" className="text-muted-foreground hover:text-foreground flex-1 rounded-full py-[0.9rem] text-center text-sm font-semibold transition-colors">
        회원가입
      </Link>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setIsVisiblePassword(prev => !prev);
  };

  const handleLoginFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    const response = await login({ email, password });
    setIsSubmitting(false);

    if (response) {
      window.location.href = "/";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-[2.4rem]">
        <h1 className="text-foreground text-3xl leading-tight font-bold">다시 오신 걸 환영해요</h1>
        <p className="text-muted-foreground mt-[0.6rem] text-sm">계정에 로그인하세요</p>
      </div>

      <AuthModeTabs />

      <form onSubmit={handleLoginFormSubmit} className="space-y-[1.2rem]">
        <div className="border-border bg-card focus-within:border-primary flex h-[4.8rem] items-center gap-[1rem] rounded-[1.4rem] border px-[1.4rem] transition-colors">
          <LuMail className="text-muted-foreground h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.8]" />
          <label htmlFor="email" className="sr-only">
            이메일 주소
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            placeholder="이메일"
            className="text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {email && (
            <button type="button" onClick={() => setEmail("")} aria-label="이메일 지우기" className="text-muted-foreground hover:text-foreground shrink-0 transition-colors">
              <LuCircleX className="h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
            </button>
          )}
        </div>

        <div className="border-border bg-card focus-within:border-primary flex h-[4.8rem] items-center gap-[1rem] rounded-[1.4rem] border px-[1.4rem] transition-colors">
          <LuLockKeyhole className="text-muted-foreground h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.8]" />
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <input
            id="password"
            type={isVisiblePassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            placeholder="비밀번호"
            className="text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            aria-label={isVisiblePassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {isVisiblePassword ? <LuEyeOff className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" /> : <LuEye className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground flex h-[4.8rem] w-full items-center justify-center gap-[0.7rem] rounded-[1.4rem] text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
          <LuArrowRight className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
        </button>
      </form>
    </div>
  );
};

export default Login;
