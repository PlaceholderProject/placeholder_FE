"use client";

import { recheckPassword } from "@/services/auth.service";
import { setIsPasswordRechecked } from "@/stores/authSlice";
import { RootState } from "@/stores/store";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

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
      toast.error("비밀번호를 입력해주세요");
      return;
    }

    const response = await recheckPassword(password);
    if (response) {
      dispatch(setIsPasswordRechecked(!isPasswordRechecked));
    }
  };

  return (
    <div>
      <form onSubmit={handlePasswordRecheckFormSubmit} className="flex w-full flex-col items-center gap-[3rem]">
        <h1 className="text-lg font-bold">비밀번호 재확인</h1>
        <div className="flex flex-col items-center">
          <div>회원정보 보호를 위해</div>
          <div>비밀번호를 다시 한 번 확인합니다.</div>
        </div>
        <div className="relative flex flex-col">
          <input
            type={isVisivlePassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요."
            className="h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium pl-[1rem] pr-[5rem]"
          />
          <button type="button" onClick={handleTogglePassword} className="absolute right-[1.3rem] top-[0.8rem] text-[2.3rem]">
            {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="flex flex-col gap-[0.8rem]">
          <button type="submit" className="text-l h-[4rem] w-[24rem] rounded-[1rem] bg-secondary-dark">
            입력완료
          </button>
          <Link href="/account">
            <div className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-gray-light text-lg">돌아가기</div>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PasswordRecheck;
