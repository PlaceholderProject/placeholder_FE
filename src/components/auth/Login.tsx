"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaEyeSlash } from "react-icons/fa";
import { login } from "@/services/auth.service";
import { setIsAuthenticated } from "@/stores/authSlice";
import { useDispatch } from "react-redux";
import { getUser } from "@/services/user.service";
import { setUser } from "@/stores/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

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

    const response = await login({ email, password });
    if (response) {
      dispatch(setIsAuthenticated(true));
      const fetchUser = async () => {
        const data = await getUser();
        if (data) {
          dispatch(
            setUser({
              email: data.email,
              nickname: data.nickname,
              bio: data.bio,
              profileImage: data.image,
            }),
          );
        }
      };
      fetchUser();
      router.replace("/");
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-[2rem] text-3xl font-semibold">로그인</h1>
      <div className="border-gray-medium flex h-[40rem] w-[80%] min-w-[30rem] flex-col items-center justify-center rounded-[1.5rem] border-[0.1rem]">
        <form onSubmit={handleLoginFormSubmit} className="flex flex-col items-center justify-center gap-[1.2rem]">
          <div className="relative flex flex-col">
            <label htmlFor="email" className="text-lg font-semibold">
              이메일 주소
            </label>
            <input type="email" value={email} onChange={handleEmailChange} className="border-gray-medium h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] px-[1rem]" />
            <button type="button" onClick={() => setEmail("")} className="absolute right-[1.2rem] top-[3.1rem] text-[2.5rem]">
              <TiDelete />
            </button>
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold">
              비밀번호
            </label>
            <input
              type={isVisivlePassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="border-gray-medium h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] px-[1rem]"
            />
            <button type="button" onClick={handleTogglePassword} className="absolute right-[1.3rem] top-[3.2rem] text-[2.3rem]">
              {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex flex-col gap-[0.8rem]">
            <button type="submit" className="bg-primary mt-[1rem] h-[4rem] w-[24rem] rounded-[1rem] text-lg text-white">
              로그인
            </button>
            <Link href="/signup">
              <div className="bg-secondary-dark flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] text-lg">회원가입</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
