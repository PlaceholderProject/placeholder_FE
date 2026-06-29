"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import { useCreateUser } from "@/hooks/useUser";
import { checkEmail, checkNickname, login } from "@/services/auth.service";
import { setIsCheckedEmail, setIsCheckedNickname } from "@/stores/authSlice";
import { RootState } from "@/stores/store";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const [isVisivlePassword, setIsVisivlePassword] = useState(false);
  const [isVisivlePassworConfirm, setIsVisivlePasswordConfirm] = useState(false);

  const [emailWarning, setEmailWarning] = useState("");
  const [emailWarningColor, setEmailWarningColor] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordConfirmWarning, setPasswordConfirmWarning] = useState("");
  const [nicknameWarning, setNicknameWarning] = useState("");
  const [bioWarning, setBioWarning] = useState("");

  const [bioTextLength, setBioTextLength] = useState(0);
  const [checkedEmail, setCheckedEmail] = useState("");
  const [checkedNickname, setCheckedNickname] = useState("");

  const dispatch = useDispatch();
  const { isCheckedEmail, isCheckedNickname } = useSelector((state: RootState) => state.auth);

  const createUserMutation = useCreateUser();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

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

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nicknameLength = event.target.value.length;
    if (nicknameLength > 8 || nicknameLength < 2) {
      setNicknameWarning("닉네임은 최소 2자 최대 8자까지 가능합니다.");
    } else {
      setNicknameWarning("");
    }
    setNickname(event.target.value);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 40) {
      setBioWarning("자기소개는 최대 40자까지 작성이 가능합니다.");
      return;
    } else {
      setBioWarning("");
    }
    setBio(event.target.value);
    setBioTextLength(event.target.value.length);
  };

  const handleCheckEmail = async () => {
    const isCheckEmail = await checkEmail(email);
    if (isCheckEmail) {
      setCheckedEmail(email);
      dispatch(setIsCheckedEmail(isCheckEmail));
      setEmailWarning("✓ 사용 가능한 이메일");
      setEmailWarningColor("text-primary");
    } else {
      setEmailWarning("✕ 사용할 수 없는 이메일입니다.");
      setEmailWarningColor("text-warning");
    }
  };

  const handleCheckNickname = async () => {
    const isCheckNickname = await checkNickname(nickname);
    if (isCheckNickname) {
      setCheckedNickname(nickname);
      dispatch(setIsCheckedNickname(isCheckNickname));
    }
  };

  const handleTogglePassword = () => {
    setIsVisivlePassword(!isVisivlePassword);
  };

  const handleTogglePasswordConfirm = () => {
    setIsVisivlePasswordConfirm(!isVisivlePassworConfirm);
  };

  const handleSignupFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("이메일을 작성해주세요.");
      return;
    }
    if (!isCheckedEmail) {
      toast.error("이메일을 중복확인해주세요.");
      return;
    }
    if (!password.trim()) {
      toast.error("비밀번호를 작성해주세요.");
      return;
    }
    if (!passwordConfirm.trim()) {
      toast.error("비밀번호 확인란에 비밀번호를 작성해주세요.");
      return;
    }
    if (!nickname.trim()) {
      toast.error("닉네임을 작성해주세요.");
      return;
    }
    if (!isCheckedNickname) {
      toast.error("닉네임을 중복확인해주세요.");
      return;
    }
    if (password.trim() !== passwordConfirm.trim()) {
      toast.error("비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.");
      return;
    }
    if (!PASSWORD_REGULAR_EXPRESSION.test(password)) {
      toast.error("비밀번호는 숫자 1개, 특수문자 1개, 알파벳 1개를 포함하여 6~15자리 사이여야 합니다. 대소문자 주의");
      return;
    }
    if (nickname.length < 2 || nickname.length > 8) {
      toast.error("닉네임은 최소 2자 최대 8자까지 가능합니다.");
      return;
    }
    if (checkedEmail !== email) {
      toast.error("이메일을 중복확인해주세요.");
      return;
    }
    if (checkedNickname !== nickname) {
      toast.error("닉네임을 중복확인해주세요.");
      return;
    }

    const newUser = {
      email,
      password,
      nickname,
      bio,
    };

    try {
      const result = await createUserMutation.mutateAsync(newUser);

      if (result) {
        await login({ email, password });

        toast.success(`${newUser.nickname}님 회원가입을 축하드립니다.`);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-[1.5rem] py-[4rem]">
      <div className="border-border bg-card w-full max-w-[36rem] rounded-[2rem] border p-[2.5rem] shadow-sm">
        <div className="mb-[2rem] text-center">
          <h2 className="text-2xl font-bold">함께 시작해볼까요?</h2>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">몇 가지만 입력하면 끝나요</p>
        </div>
        <form onSubmit={handleSignupFormSubmit} className="flex flex-col gap-[1.2rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="email" className="text-sm font-semibold">
              이메일 주소
            </label>
            <div className="flex gap-[0.6rem]">
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="border-border focus:border-primary h-[4rem] flex-1 rounded-[1rem] border bg-white px-[1rem] transition-colors outline-none"
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                className="bg-primary-soft text-primary hover:bg-primary-soft/70 h-[4rem] w-[6rem] shrink-0 rounded-[1rem] text-sm font-medium transition-colors"
              >
                중복확인
              </button>
            </div>
            {emailWarning && <p className={`mt-[0.3rem] text-sm ${emailWarningColor}`}>{emailWarning}</p>}
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="password" className="text-sm font-semibold">
              비밀번호
            </label>
            <div className="border-border focus-within:border-primary relative flex items-center rounded-[1rem] border bg-white transition-colors">
              <input id="password" type={isVisivlePassword ? "text" : "password"} value={password} onChange={handlePasswordChange} className="h-[4rem] w-full bg-transparent px-[1rem] outline-none" />
              <button type="button" onClick={handleTogglePassword} className="text-muted-foreground hover:text-foreground mr-[1rem] shrink-0 text-[1.9rem] transition-colors">
                {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordWarning && <p className="text-warning mt-[0.3rem] text-sm">{passwordWarning}</p>}
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="passwordConfirm" className="text-sm font-semibold">
              비밀번호 확인
            </label>
            <div className="border-border focus-within:border-primary relative flex items-center rounded-[1rem] border bg-white transition-colors">
              <input
                id="passwordConfirm"
                type={isVisivlePassworConfirm ? "text" : "password"}
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                className="h-[4rem] w-full bg-transparent px-[1rem] outline-none"
              />
              <button type="button" onClick={handleTogglePasswordConfirm} className="text-muted-foreground hover:text-foreground mr-[1rem] shrink-0 text-[1.9rem] transition-colors">
                {isVisivlePassworConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordConfirmWarning && <p className="text-warning mt-[0.3rem] text-sm">{passwordConfirmWarning}</p>}
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="nickname" className="text-sm font-semibold">
              닉네임
            </label>
            <div className="flex gap-[0.6rem]">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                className="border-border focus:border-primary h-[4rem] flex-1 rounded-[1rem] border bg-white px-[1rem] transition-colors outline-none"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                className="bg-primary-soft text-primary hover:bg-primary-soft/70 h-[4rem] w-[6rem] shrink-0 rounded-[1rem] text-sm font-medium transition-colors"
              >
                중복확인
              </button>
            </div>
            {nicknameWarning && <p className="text-warning mt-[0.3rem] text-sm">{nicknameWarning}</p>}
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label htmlFor="bio" className="text-sm font-semibold">
              자기소개
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요."
              className="border-border focus:border-primary h-[7rem] w-full resize-none rounded-[1rem] border bg-white p-[1rem] transition-colors outline-none"
            />
            {bioWarning && <p className="text-warning mt-[0.3rem] text-sm">{bioWarning}</p>}
            <div className="flex w-full justify-end">
              <p className="text-muted-foreground text-sm">{bioTextLength}/40</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="bg-primary text-primary-foreground mt-[0.5rem] flex h-[4rem] w-full items-center justify-center rounded-[1rem] text-lg font-semibold transition hover:opacity-90 disabled:opacity-60"
          >
            회원가입
          </button>
          <Link href="/login">
            <div className="border-primary text-primary hover:bg-primary-soft flex h-[4rem] w-full items-center justify-center rounded-[1rem] border text-lg font-semibold transition-colors">
              로그인하러 가기
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
