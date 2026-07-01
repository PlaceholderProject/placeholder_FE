"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import React, { useState, useEffect } from "react";
import { LuArrowLeft, LuEye, LuEyeOff, LuLockKeyhole, LuSave } from "react-icons/lu";
import PasswordRecheck from "../auth/PasswordRecheck";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/stores/store";
import { resetPassword } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setIsPasswordRechecked } from "@/stores/authSlice";
import Link from "next/link";

const PasswordEdit = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);
  const [isVisivlePassworConfirm, setIsVisivlePasswordConfirm] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordConfirmWarning, setPasswordConfirmWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  useEffect(() => {
    dispatch(setIsPasswordRechecked(false));
  }, [dispatch]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextPassword = event.target.value;
    if (!PASSWORD_REGULAR_EXPRESSION.test(nextPassword)) {
      setPasswordWarning("숫자, 영문, 특수문자를 포함해 6~15자로 입력해주세요.");
    } else {
      setPasswordWarning("");
    }
    if (passwordConfirm && nextPassword !== passwordConfirm) {
      setPasswordConfirmWarning("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordConfirmWarning("");
    }
    setPassword(nextPassword);
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
      toast.error("비밀번호를 작성해주세요.");
      return;
    }

    if (!passwordConfirm.trim()) {
      toast.error("비밀번호 확인란에 비밀번호를 작성해주세요.");
      return;
    }

    if (password.trim() !== passwordConfirm.trim()) {
      toast.error("비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.");
      return;
    }

    if (!PASSWORD_REGULAR_EXPRESSION.test(password)) {
      toast.error("비밀번호는 숫자 1개, 특수문자 1개를 포함하여 6~15자리 사이여야 합니다.");
      return;
    }

    setIsSubmitting(true);
    const response = await resetPassword(password);
    setIsSubmitting(false);

    if (response) {
      toast.success("비밀번호가 변경되었습니다.");
      router.replace("/account");
    }
  };

  return (
    <div className="mx-auto w-[95%] max-w-[58rem] space-y-[1.8rem] py-[2.4rem] md:py-[3.2rem]">
      <Link href="/account" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
        <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
        계정 관리
      </Link>

      <div>
        <h1 className="text-foreground text-2xl font-bold">비밀번호 수정</h1>
        <p className="text-muted-foreground mt-[0.5rem] text-sm">현재 비밀번호 확인 후 새 비밀번호를 설정해요.</p>
      </div>

      {!isPasswordRechecked ? (
        <PasswordRecheck />
      ) : (
        <section className="border-border bg-card rounded-[2rem] border p-[1.8rem] md:p-[2rem]">
          <form onSubmit={handlePasswordEditFormSubmit} className="space-y-[1.4rem]">
            <div>
              <label htmlFor="password" className="text-foreground mb-[0.7rem] block text-sm font-semibold">
                새 비밀번호
              </label>
              <div className="border-border focus-within:border-primary flex h-[4.6rem] items-center gap-[0.9rem] rounded-[1.4rem] border px-[1.3rem] transition-colors">
                <LuLockKeyhole className="text-muted-foreground h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
                <input id="password" type={isVisivlePassword ? "text" : "password"} value={password} onChange={handlePasswordChange} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  aria-label={isVisivlePassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                >
                  {isVisivlePassword ? <LuEyeOff className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" /> : <LuEye className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />}
                </button>
              </div>
              {passwordWarning && <p className="text-warning mt-[0.6rem] text-xs font-medium">{passwordWarning}</p>}
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="text-foreground mb-[0.7rem] block text-sm font-semibold">
                새 비밀번호 확인
              </label>
              <div className="border-border focus-within:border-primary flex h-[4.6rem] items-center gap-[0.9rem] rounded-[1.4rem] border px-[1.3rem] transition-colors">
                <LuLockKeyhole className="text-muted-foreground h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
                <input
                  id="passwordConfirm"
                  type={isVisivlePassworConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordConfirm}
                  aria-label={isVisivlePassworConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
                  className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                >
                  {isVisivlePassworConfirm ? <LuEyeOff className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" /> : <LuEye className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />}
                </button>
              </div>
              {passwordConfirmWarning && <p className="text-warning mt-[0.6rem] text-xs font-medium">{passwordConfirmWarning}</p>}
            </div>

            <div className="grid gap-[0.8rem] sm:grid-cols-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground flex h-[4.6rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <LuSave className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
                {isSubmitting ? "변경 중" : "변경하기"}
              </button>
              <Link
                href="/account"
                className="border-border text-muted-foreground hover:bg-muted flex h-[4.6rem] items-center justify-center rounded-[1.4rem] border text-sm font-semibold transition-colors"
              >
                취소
              </Link>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default PasswordEdit;
