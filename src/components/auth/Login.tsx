"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";

const Login = () => {
  const [isLogged, setIsLogged] = useState(false);
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

  const handleLoginFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        alert("이메일 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.");
        return;
      }

      const { access, refresh } = await res.json();

      Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });
      setIsLogged(true);

      console.log(access, refresh);
    } catch (error) {
      console.error("네트워크 오류:", error);
      alert("로그인 처리 중 문제가 발생했습니다.");
      return;
    }

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
