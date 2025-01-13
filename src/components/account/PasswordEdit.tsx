"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
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
    <div className="relative z-10">
      {!isPasswordRechecked && (
        <div className="fixed inset-20 z-50">
          <PasswordRecheck />
        </div>
      )}
      <div className="flex flex-col items-center">
        <h2>비밀번호 수정</h2>
        <div className="border-2 flex flex-col items-center rounded-xl">
          <form onSubmit={handlePasswordEditFormSubmit}>
            <div className="relative flex flex-col">
              <label htmlFor="password">새 비밀번호</label>
              <input type={isVisivlePassword ? "text" : "password"} value={password} onChange={handlePasswordChange} className="border-2 rounded-md" />
              <button type="button" onClick={handleTogglePassword} className="absolute bottom-1 right-2">
                {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordWarning && <p>{passwordWarning}</p>}
            </div>
            <div className="relative flex flex-col">
              <label htmlFor="passwordConfirm">새 비밀번호 확인</label>
              <input type={isVisivlePassworConfirm ? "text" : "password"} value={passwordConfirm} onChange={handlePasswordConfirmChange} className="border-2 rounded-md" />
              <button type="button" onClick={handleTogglePasswordConfirm} className="absolute bottom-1 right-2">
                {isVisivlePassworConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordConfirmWarning && <p>{passwordConfirmWarning}</p>}
            </div>
            <button className="bg-slate-200">변경하기</button>
          </form>
          <Link href="/account">
            <div className="bg-slate-100">취소하기</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordEdit;
