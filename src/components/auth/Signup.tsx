"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import { useCreateUser } from "@/hooks/useUser";
import { checkEmail, checkNickname, login } from "@/services/auth.service";
import { setIsCheckedEmail, setIsCheckedNickname } from "@/stores/authSlice";
import { RootState } from "@/stores/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LuArrowRight, LuEye, LuEyeOff, LuLockKeyhole, LuMail, LuPenLine, LuUserRound } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AuthModeTabs = () => {
  return (
    <div className="border-border bg-card mb-[2rem] flex rounded-full border p-[0.4rem]">
      <Link href="/login" className="text-muted-foreground hover:text-foreground flex-1 rounded-full py-[0.9rem] text-center text-sm font-semibold transition-colors">
        로그인
      </Link>
      <Link href="/signup" className="bg-foreground text-background flex-1 rounded-full py-[0.9rem] text-center text-sm font-semibold transition-colors">
        회원가입
      </Link>
    </div>
  );
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisiblePasswordConfirm, setIsVisiblePasswordConfirm] = useState(false);

  const [emailWarning, setEmailWarning] = useState("");
  const [emailWarningColor, setEmailWarningColor] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordConfirmWarning, setPasswordConfirmWarning] = useState("");
  const [nicknameWarning, setNicknameWarning] = useState("");
  const [nicknameWarningColor, setNicknameWarningColor] = useState("");
  const [bioWarning, setBioWarning] = useState("");

  const [bioTextLength, setBioTextLength] = useState(0);
  const [checkedEmail, setCheckedEmail] = useState("");
  const [checkedNickname, setCheckedNickname] = useState("");

  const dispatch = useDispatch();
  const { isCheckedEmail, isCheckedNickname } = useSelector((state: RootState) => state.auth);

  const createUserMutation = useCreateUser();

  useEffect(() => {
    dispatch(setIsCheckedEmail(false));
    dispatch(setIsCheckedNickname(false));
  }, [dispatch]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;
    setEmail(nextEmail);
    if (nextEmail !== checkedEmail) {
      dispatch(setIsCheckedEmail(false));
      setEmailWarning("");
      setEmailWarningColor("");
    }
  };

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

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextNickname = event.target.value;
    const nicknameLength = nextNickname.length;
    setNickname(nextNickname);

    if (nextNickname !== checkedNickname) {
      dispatch(setIsCheckedNickname(false));
    }

    if (nicknameLength > 8 || (nicknameLength > 0 && nicknameLength < 2)) {
      setNicknameWarning("닉네임은 2자 이상 8자 이하로 입력해주세요.");
      setNicknameWarningColor("text-warning");
    } else {
      setNicknameWarning("");
      setNicknameWarningColor("");
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 40) {
      setBioWarning("자기소개는 최대 40자까지 작성할 수 있어요.");
      return;
    }
    setBioWarning("");
    setBio(event.target.value);
    setBioTextLength(event.target.value.length);
  };

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      toast.error("이메일을 작성해주세요.");
      return;
    }
    const isCheckEmail = await checkEmail(email);
    if (isCheckEmail) {
      setCheckedEmail(email);
      dispatch(setIsCheckedEmail(isCheckEmail));
      setEmailWarning("사용 가능한 이메일입니다.");
      setEmailWarningColor("text-primary");
    } else {
      setEmailWarning("사용할 수 없는 이메일입니다.");
      setEmailWarningColor("text-warning");
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      toast.error("닉네임을 작성해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 8) {
      toast.error("닉네임은 최소 2자 최대 8자까지 가능합니다.");
      return;
    }
    const isCheckNickname = await checkNickname(nickname);
    if (isCheckNickname) {
      setCheckedNickname(nickname);
      dispatch(setIsCheckedNickname(isCheckNickname));
      setNicknameWarning("사용 가능한 닉네임입니다.");
      setNicknameWarningColor("text-primary");
    } else {
      setNicknameWarning("사용할 수 없는 닉네임입니다.");
      setNicknameWarningColor("text-warning");
    }
  };

  const handleTogglePassword = () => {
    setIsVisiblePassword(prev => !prev);
  };

  const handleTogglePasswordConfirm = () => {
    setIsVisiblePasswordConfirm(prev => !prev);
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
    <div className="w-full">
      <div className="mb-[2.4rem]">
        <h1 className="text-foreground text-3xl leading-tight font-bold">함께 시작해볼까요?</h1>
        <p className="text-muted-foreground mt-[0.6rem] text-sm">몇 가지만 입력하면 끝나요</p>
      </div>

      <AuthModeTabs />

      <form onSubmit={handleSignupFormSubmit} className="space-y-[1.2rem]">
        <div>
          <div className="flex gap-[0.7rem]">
            <div className="border-border bg-card focus-within:border-primary flex h-[4.8rem] min-w-0 flex-1 items-center gap-[1rem] rounded-[1.4rem] border px-[1.4rem] transition-colors">
              <LuMail className="text-muted-foreground h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.8]" />
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                placeholder="이메일"
                className="text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleCheckEmail}
              className="bg-primary-soft text-primary hover:bg-primary-soft/70 h-[4.8rem] w-[7.2rem] shrink-0 rounded-[1.4rem] text-sm font-semibold transition-colors"
            >
              확인
            </button>
          </div>
          {emailWarning && <p className={`mt-[0.6rem] text-xs font-medium ${emailWarningColor}`}>{emailWarning}</p>}
        </div>

        <div className="border-border bg-card focus-within:border-primary flex h-[4.8rem] items-center gap-[1rem] rounded-[1.4rem] border px-[1.4rem] transition-colors">
          <LuLockKeyhole className="text-muted-foreground h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.8]" />
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <input
            id="password"
            type={isVisiblePassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            placeholder="비밀번호"
            className="text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            aria-label={isVisiblePassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {isVisiblePassword ? <LuEyeOff className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" /> : <LuEye className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />}
          </button>
        </div>
        {passwordWarning && <p className="text-warning text-xs font-medium">{passwordWarning}</p>}

        <div className="border-border bg-card focus-within:border-primary flex h-[4.8rem] items-center gap-[1rem] rounded-[1.4rem] border px-[1.4rem] transition-colors">
          <LuLockKeyhole className="text-muted-foreground h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.8]" />
          <label htmlFor="passwordConfirm" className="sr-only">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type={isVisiblePasswordConfirm ? "text" : "password"}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            autoComplete="new-password"
            placeholder="비밀번호 확인"
            className="text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleTogglePasswordConfirm}
            aria-label={isVisiblePasswordConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {isVisiblePasswordConfirm ? <LuEyeOff className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" /> : <LuEye className="h-[1.8rem] w-[1.8rem] stroke-[1.8]" />}
          </button>
        </div>
        {passwordConfirmWarning && <p className="text-warning text-xs font-medium">{passwordConfirmWarning}</p>}

        <div>
          <div className="flex gap-[0.7rem]">
            <div className="border-border bg-card focus-within:border-primary flex h-[4.8rem] min-w-0 flex-1 items-center gap-[1rem] rounded-[1.4rem] border px-[1.4rem] transition-colors">
              <LuUserRound className="text-muted-foreground h-[1.7rem] w-[1.7rem] shrink-0 stroke-[1.8]" />
              <label htmlFor="nickname" className="sr-only">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                autoComplete="nickname"
                placeholder="닉네임"
                className="text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleCheckNickname}
              className="bg-primary-soft text-primary hover:bg-primary-soft/70 h-[4.8rem] w-[7.2rem] shrink-0 rounded-[1.4rem] text-sm font-semibold transition-colors"
            >
              확인
            </button>
          </div>
          {nicknameWarning && <p className={`mt-[0.6rem] text-xs font-medium ${nicknameWarningColor}`}>{nicknameWarning}</p>}
        </div>

        <div>
          <div className="border-border bg-card focus-within:border-primary flex min-h-[8.8rem] items-start gap-[1rem] rounded-[1.4rem] border px-[1.4rem] py-[1.3rem] transition-colors">
            <LuPenLine className="text-muted-foreground mt-[0.2rem] h-[1.6rem] w-[1.6rem] shrink-0 stroke-[1.8]" />
            <label htmlFor="bio" className="sr-only">
              자기소개
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요."
              className="text-foreground placeholder:text-muted-foreground min-h-[6rem] min-w-0 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none"
            />
          </div>
          <div className="mt-[0.6rem] flex items-center justify-between gap-[1rem]">
            {bioWarning ? <p className="text-warning text-xs font-medium">{bioWarning}</p> : <span />}
            <p className="text-muted-foreground text-xs">{bioTextLength}/40</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={createUserMutation.isPending}
          className="bg-primary text-primary-foreground flex h-[4.8rem] w-full items-center justify-center gap-[0.7rem] rounded-[1.4rem] text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createUserMutation.isPending ? "가입 중" : "가입하고 시작하기"}
          <LuArrowRight className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
        </button>
      </form>
    </div>
  );
};

export default Signup;
