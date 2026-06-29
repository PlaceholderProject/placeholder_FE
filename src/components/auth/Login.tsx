"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { login } from "@/services/auth.service";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setIsVisivlePassword(!isVisivlePassword);
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

    const response = await login({ email, password });
    if (response) {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-[1.5rem] py-[4rem]">
      <div className="border-border bg-card w-full max-w-[36rem] rounded-[2rem] border p-[2.5rem] shadow-sm">
        <div className="mb-[2rem] text-center">
          <h1 className="text-2xl font-bold">다시 오신 걸 환영해요</h1>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">계정에 로그인하세요</p>
        </div>

        <form onSubmit={handleLoginFormSubmit} className="flex flex-col gap-[1.2rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email" className="text-sm font-semibold">
              이메일 주소
            </label>
            <div className="border-border focus-within:border-primary relative flex items-center rounded-[1rem] border bg-white transition-colors">
              <FaEnvelope className="text-muted-foreground ml-[1rem] shrink-0" />
              <input id="email" type="email" value={email} onChange={handleEmailChange} className="h-[4rem] w-full bg-transparent px-[0.8rem] outline-none" />
              {email && (
                <button type="button" onClick={() => setEmail("")} className="text-muted-foreground hover:text-foreground mr-[0.8rem] shrink-0 text-[2.2rem] transition-colors">
                  <TiDelete />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="password" className="text-sm font-semibold">
              비밀번호
            </label>
            <div className="border-border focus-within:border-primary relative flex items-center rounded-[1rem] border bg-white transition-colors">
              <FaLock className="text-muted-foreground ml-[1rem] shrink-0" />
              <input
                id="password"
                type={isVisivlePassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className="h-[4rem] w-full bg-transparent px-[0.8rem] outline-none"
              />
              <button type="button" onClick={handleTogglePassword} className="text-muted-foreground hover:text-foreground mr-[1rem] shrink-0 text-[1.9rem] transition-colors">
                {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="bg-primary text-primary-foreground mt-[1rem] h-[4rem] w-full rounded-[1rem] text-lg font-semibold transition hover:opacity-90">
            로그인
          </button>
          <Link href="/signup">
            <div className="border-primary text-primary hover:bg-primary-soft flex h-[4rem] w-full items-center justify-center rounded-[1rem] border text-lg font-semibold transition-colors">
              회원가입
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
