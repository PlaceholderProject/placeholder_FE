"use client";

import { recheckPassword } from "@/services/auth.service";
import { setIsPasswordRechecked } from "@/stores/authSlice";
import { RootState } from "@/stores/store";

import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const PasswordRecheck = () => {
  const [password, setPassword] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);

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
      alert("비밀번호를 입력해주세요");
      return;
    }

    const response = await recheckPassword(password);
    if (response) {
      dispatch(setIsPasswordRechecked(!isPasswordRechecked));
    }
  };

  return (
    <div className="bg-red-200 w-[500px] h-[500px]">
      <form onSubmit={handlePasswordRecheckFormSubmit}>
        <h3>비밀번호 재확인</h3>
        <p>회원정보 보호를 위해 비밀번호를 다시 한 번 확인합니다.</p>
        <div className="relative flex flex-col">
          <label htmlFor="password">비밀번호</label>
          <input type={isVisivlePassword ? "text" : "password"} value={password} onChange={handlePasswordChange} className="border-2 rounded-md" />
          <button type="button" onClick={handleTogglePassword} className="absolute bottom-1 right-2">
            {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button type="submit">입력완료</button>
      </form>
      <Link href="/account">돌아가기</Link>
    </div>
  );
};

export default PasswordRecheck;
