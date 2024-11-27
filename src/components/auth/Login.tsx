"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);

  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setIsVisivlePassword(!isVisivlePassword);
  };

  const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요");
      return;
    }
    event.preventDefault();
    console.log(`아이디:${email} 비밀번호:${password}`);
    router.replace("/");
  };

  return (
    <div className="w-[400px] h-[500px] flex flex-col items-center justify-center">
      <h2>로그인</h2>
      <div className="border-[#CFCFCF] border-2 w-10/12 rounded-2xl flex flex-col items-center justify-center">
        <form onSubmit={handleLoginFormSubmit} className="flex flex-col items-center justify-center">
          <div className="relative flex flex-col">
            <label htmlFor="email">이메일 주소</label>
            <input type="email" value={email} onChange={handleEmailChange} className="border-2 rounded-md" />
            <button type="button" onClick={() => setEmail("")} className="absolute bottom-1 right-2">
              <TiDelete size={20} />
            </button>
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="password">비밀번호</label>
            <input type={isVisivlePassword ? "text" : "password"} value={password} onChange={handlePasswordChange} className="border-2 rounded-md" />
            <button type="button" onClick={handleTogglePassword} className="absolute bottom-1 right-2">
              {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="bg-gray-200">
            로그인
          </button>
        </form>
        <Link href="/signup">
          <div className="bg-slate-100">회원가입</div>
        </Link>
      </div>
    </div>
  );
};

export default Login;
