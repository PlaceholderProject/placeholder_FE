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
      toast.success("비밀번호가 일치합니다.");
      dispatch(setIsPasswordRechecked(!isPasswordRechecked));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-[1.5rem] py-[4rem]">
      <div className="border-border bg-card w-full max-w-[36rem] rounded-[2rem] border p-[2.5rem] shadow-sm">
        <form onSubmit={handlePasswordRecheckFormSubmit} className="flex w-full flex-col items-center gap-[2rem]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">비밀번호 재확인</h1>
            <p className="text-muted-foreground mt-[0.6rem] text-sm">
              회원정보 보호를 위해
              <br />
              비밀번호를 다시 한 번 확인합니다.
            </p>
          </div>
          <div className="border-border focus-within:border-primary relative flex w-full items-center rounded-[1rem] border bg-white transition-colors">
            <input
              type={isVisivlePassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요."
              className="h-[4rem] w-full bg-transparent px-[1rem] outline-none"
            />
            <button type="button" onClick={handleTogglePassword} className="text-muted-foreground hover:text-foreground mr-[1rem] shrink-0 text-[1.9rem] transition-colors">
              {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex w-full flex-col gap-[0.8rem]">
            <button type="submit" className="bg-primary text-primary-foreground h-[4rem] w-full rounded-[1rem] text-lg font-semibold transition hover:opacity-90">
              입력완료
            </button>
            <Link href="/account">
              <div className="border-primary text-primary hover:bg-primary-soft flex h-[4rem] w-full items-center justify-center rounded-[1rem] border text-lg font-semibold transition-colors">
                돌아가기
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecheck;
