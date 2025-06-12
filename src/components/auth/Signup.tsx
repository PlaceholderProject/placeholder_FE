"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import { useCreateUser } from "@/hooks/useUser";
import { checkEmail, checkNickname } from "@/services/auth.service";
import { setIsCheckedEmail, setIsCheckedNickname } from "@/stores/authSlice";
import { RootState } from "@/stores/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [isVisivlePassword, setIsVisivlePassword] = useState(false);
  const [isVisivlePassworConfirm, setIsVisivlePasswordConfirm] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordConfirmWarning, setPasswordConfirmWarning] = useState("");
  const [nicknameWarning, setNicknameWarning] = useState("");
  const [bioTextLength, setBioTextLength] = useState(0);
  const [bioWarning, setBioWarning] = useState("");

  const router = useRouter();

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
    if (event.target.value.length > 8) {
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
    if (isCheckEmail) dispatch(setIsCheckedEmail(isCheckEmail));
  };

  const handleCheckNickname = async () => {
    const isCheckNickname = await checkNickname(nickname);
    if (isCheckNickname) dispatch(setIsCheckedNickname(isCheckNickname));
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
      alert("이메일을 작성해주세요.");
      return;
    }
    if (!isCheckedEmail) {
      alert("이메일을 중복확인해주세요.");
      return;
    }
    if (!password.trim()) {
      alert("비밀번호를 작성해주세요.");
      return;
    }
    if (!passwordConfirm.trim()) {
      alert("비밀번호 확인란에 비밀번호를 작성해주세요.");
      return;
    }
    if (!nickname.trim()) {
      alert("닉네임을 작성해주세요.");
      return;
    }
    if (!isCheckedNickname) {
      alert("닉네임을 중복확인해주세요.");
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
    if (nickname.length < 2 || nickname.length > 8) {
      alert("닉네임은 최소 2자 최대 8자까지 가능합니다.");
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
        alert(`${newUser.nickname}님 회원가입을 축하드립니다.`);
        router.replace("/login");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-[2rem] text-3xl font-semibold">회원가입</h2>
      <div className="flex h-full w-[80%] min-w-[30rem] flex-col items-center justify-center rounded-[1.5rem] border-[0.1rem] border-gray-medium py-10">
        <form onSubmit={handleSignupFormSubmit} className="flex flex-col items-center justify-center gap-[1.2rem] p-[2rem]">
          <div className="relative flex flex-col">
            <label htmlFor="email" className="text-lg font-semibold">
              이메일 주소
            </label>
            <div>
              <input type="email" value={email} onChange={handleEmailChange} className="h-[4rem] w-[18rem] rounded-l-[1rem] border-[0.1rem] border-gray-medium px-[1rem]" />
              <button type="button" onClick={handleCheckEmail} className="h-[4rem] w-[6rem] rounded-r-[1rem] border-y-[0.1rem] border-r-[0.1rem] border-gray-medium bg-gray-light hover:bg-gray-medium">
                중복확인
              </button>
            </div>
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold">
              비밀번호
            </label>
            <input
              type={isVisivlePassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium pl-[1rem] pr-[5rem]"
            />
            <button type="button" onClick={handleTogglePassword} className="absolute right-[1.3rem] top-[3.2rem] text-[2.3rem]">
              {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{passwordWarning}</p>}
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="passwordConfirm" className="text-lg font-semibold">
              비밀번호 확인
            </label>
            <input
              type={isVisivlePassworConfirm ? "text" : "password"}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              className="h-[4rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium pl-[1rem] pr-[5rem]"
            />
            <button type="button" onClick={handleTogglePasswordConfirm} className="absolute right-[1.3rem] top-[3.2rem] text-[2.3rem]">
              {isVisivlePassworConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordConfirmWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{passwordConfirmWarning}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="nickname" className="text-lg font-semibold">
              닉네임
            </label>
            <div>
              <input type="text" value={nickname} onChange={handleNicknameChange} className="h-[4rem] w-[18rem] rounded-l-[1rem] border-[0.1rem] border-gray-medium px-[1rem]" />
              <button
                type="button"
                onClick={handleCheckNickname}
                className="h-[4rem] w-[6rem] rounded-r-[1rem] border-y-[0.1rem] border-r-[0.1rem] border-gray-medium bg-gray-light hover:bg-gray-medium"
              >
                중복확인
              </button>
            </div>
            {nicknameWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{nicknameWarning}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="bio" className="text-lg font-semibold">
              자기소개
            </label>
            <textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요."
              className="h-[7rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium p-[1rem]"
            />
            {bioWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{bioWarning}</p>}
            <div className="flex w-full justify-end">
              <p className="mt-[0.3rem] text-sm">{bioTextLength}/40</p>
            </div>
          </div>
          <div className="flex flex-col gap-[0.8rem]">
            <button type="submit" className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-secondary-dark text-lg">
              회원가입
            </button>
            <Link href="/login">
              <div className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-gray-light text-lg">로그인하러 가기</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
