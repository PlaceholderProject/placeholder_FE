"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

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

  const PASSWORDREGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*{}[\]\/?.,;:|)~`!^_+<>="#%&\\=('-])[a-zA-Z0-9!@#$%^&*{}[\]\/?.,;:|)~`!^_+<>="#%&\\=('-]{6,15}$/;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!PASSWORDREGEX.test(event.target.value)) {
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

    if (password.trim() !== passwordConfirm.trim()) {
      alert("비밀번호가 일치하지 않습니다. 비밀번호를 다시 입력해주세요.");
      return;
    }

    if (!PASSWORDREGEX.test(password)) {
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
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorResult = await res.json();
        alert(errorResult.detail);
        return;
      }

      const result = await res.json();

      console.log(result);

      alert(`${newUser.nickname}님 회원가입을 축하드립니다.`);
    } catch (error) {
      console.log(error);
      alert("회원가입을 실패했습니다. 다시 시도해주세요.");
      return;
    }

    router.replace("/login");
  };

  return (
    <div className="w-[400px] h-[500px] flex flex-col items-center justify-center">
      <h2>회원가입</h2>
      <div className="border-[#CFCFCF] border-2 w-10/12 rounded-2xl flex flex-col items-center justify-center">
        <form onSubmit={handleSignupFormSubmit} className="flex flex-col items-center justify-center">
          <div className="flex flex-col">
            <label htmlFor="email">이메일 주소</label>
            <input type="email" value={email} onChange={handleEmailChange} className="border-2 rounded-md" />
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
            <input type="text" value={nickname} onChange={handleNicknameChange} className="border-2 rounded-md" />
            {nicknameWarning && <p>{nicknameWarning}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="bio">자기소개</label>
            <textarea value={bio} onChange={handleBioChange} placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요." className="border-2 rounded-md" />
            {bioWarning && <p>{bioWarning}</p>}
            <p>{bioTextLength}/40</p>
          </div>
          <button className="bg-gray-200">회원가입</button>
        </form>
        <Link href="/login">
          <div className="bg-slate-100">로그인하러 가기</div>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
