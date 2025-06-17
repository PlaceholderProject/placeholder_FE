"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordRecheck from "../auth/PasswordRecheck";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetPassword } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const PasswordEdit = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);
  const [isVisivlePassworConfirm, setIsVisivlePasswordConfirm] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordConfirmWarning, setPasswordConfirmWarning] = useState("");

  const router = useRouter();
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!PASSWORD_REGULAR_EXPRESSION.test(event.target.value)) {
      setPasswordWarning("비밀번호는 숫자 1개, 특수문자 1개를 포함하여 6~15자리 사이여야 합니다.");
    } else {
      setPasswordWarning("");
    }
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (password !== event.target.value) {
      setPasswordConfirmWarning("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordConfirmWarning("");
    }

    setPasswordConfirm(event.target.value);
  };

  const handleTogglePassword = () => {
    setIsVisivlePassword(!isVisivlePassword);
  };

  const handleTogglePasswordConfirm = () => {
    setIsVisivlePasswordConfirm(!isVisivlePassworConfirm);
  };

  const handlePasswordEditFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      alert("비밀번호를 작성해주세요.");
      return;
    }

    if (!passwordConfirm.trim()) {
      alert("비밀번호 확인란에 비밀번호를 작성해주세요.");
      return;
    }

    if (password.trim() !== passwordConfirm.trim()) {
      alert("비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.");
      return;
    }

    if (!PASSWORD_REGULAR_EXPRESSION.test(password)) {
      alert("비밀번호는 숫자 1개, 특수문자 1개를 포함하여 6~15자리 사이여야 합니다.");
      return;
    }

    const response = await resetPassword(password);
    if (response) {
      alert("비밀번호가 변경되었습니다.");
      router.replace("/");
    }
  };

  return (
    <div className="my-[4rem] flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center md:min-h-[calc(100vh-13.5rem)]">
      <h2 className="mb-[2rem] text-3xl font-semibold">비밀번호 수정</h2>
      <div className="relative z-10 flex min-h-[54rem] w-[80%] min-w-[30rem] flex-col items-center justify-center gap-[3rem] rounded-[1.5rem] border-[0.1rem] border-gray-medium py-[3rem] md:max-w-[80rem]">
        {!isPasswordRechecked && (
          <div className="absolute inset-5 z-50 flex items-center justify-center bg-[#f9f9f9]">
            <PasswordRecheck />
          </div>
        )}
        <form onSubmit={handlePasswordEditFormSubmit} className="flex flex-col justify-center gap-[1.5rem] p-[2rem]">
          <div className="relative flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold">
              새 비밀번호
            </label>
            <input
              type={isVisivlePassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium px-[1rem]"
            />
            <button type="button" onClick={handleTogglePassword} className="absolute right-[1.3rem] top-[3.2rem] text-[2.3rem]">
              {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{passwordWarning}</p>}
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="passwordConfirm" className="text-lg font-semibold">
              새 비밀번호 확인
            </label>
            <input
              type={isVisivlePassworConfirm ? "text" : "password"}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              className="h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium px-[1rem]"
            />
            <button type="button" onClick={handleTogglePasswordConfirm} className="absolute right-[1.3rem] top-[3.2rem] text-[2.3rem]">
              {isVisivlePassworConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordConfirmWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{passwordConfirmWarning}</p>}
          </div>
          <div className="flex flex-col gap-[0.8rem]">
            <button className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-secondary-dark text-lg">변경하기</button>
            <Link href="/account">
              <div className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-gray-light text-lg">취소하기</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordEdit;
