"use client";

import { PASSWORD_REGULAR_EXPRESSION } from "@/constants/regularExpressionConstants";
import { checkEmail, checkNickname } from "@/services/auth.service";
import { createUser } from "@/services/user.service";
import { setIsCheckedEmail, setIsCheckedNickname } from "@/stores/authSlice";
import { RootState } from "@/stores/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
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

    const result = await createUser(newUser);

    if (result) {
      alert(`${newUser.nickname}님 회원가입을 축하드립니다.`);
      router.replace("/login");
    }
  };

  return (
    <div className="w-[400px] h-[500px] flex flex-col items-center justify-center">
      <h2>회원가입</h2>
      <div className="border-[#CFCFCF] border-2 w-10/12 rounded-2xl flex flex-col items-center justify-center">
        <form onSubmit={handleSignupFormSubmit} className="flex flex-col items-center justify-center">
          <div className="flex flex-col">
            <label htmlFor="email">이메일 주소</label>
            <div>
              <input type="email" value={email} onChange={handleEmailChange} className="border-2 rounded-md" />
              <button type="button" onClick={handleCheckEmail} className="bg-slate-200">
                중복확인
              </button>
            </div>
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="password">비밀번호</label>
            <input type={isVisivlePassword ? "text" : "password"} value={password} onChange={handlePasswordChange} className="border-2 rounded-md" />
            <button type="button" onClick={handleTogglePassword} className="absolute bottom-1 right-2">
              {isVisivlePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordWarning && <p>{passwordWarning}</p>}
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input type={isVisivlePassworConfirm ? "text" : "password"} value={passwordConfirm} onChange={handlePasswordConfirmChange} className="border-2 rounded-md" />
            <button type="button" onClick={handleTogglePasswordConfirm} className="absolute bottom-1 right-2">
              {isVisivlePassworConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordConfirmWarning && <p>{passwordConfirmWarning}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="nickname">닉네임</label>
            <div>
              <input type="text" value={nickname} onChange={handleNicknameChange} className="border-2 rounded-md" />
              <button type="button" onClick={handleCheckNickname} className="bg-slate-200">
                중복확인
              </button>
            </div>
            {nicknameWarning && <p>{nicknameWarning}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="bio">자기소개</label>
            <textarea value={bio} onChange={handleBioChange} placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요." className="border-2 rounded-md" />
            {bioWarning && <p>{bioWarning}</p>}
            <p>{bioTextLength}/40</p>
          </div>
          <button type="submit" className="bg-gray-200">
            회원가입
          </button>
        </form>
        <Link href="/login">
          <div className="bg-slate-100">로그인하러 가기</div>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
