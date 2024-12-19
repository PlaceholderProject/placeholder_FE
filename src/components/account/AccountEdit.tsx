"use client";

import { RootState } from "@/stores/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";

const AccountEdit = () => {
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>("");
  const [nickname, setNickname] = useState("");
  const [nicknameWarning, setNicknameWarning] = useState("");
  const [bio, setBio] = useState("");
  const [bioTextLength, setBioTextLength] = useState(0);
  const [bioWarning, setBioWarning] = useState("");
  const account = useSelector((state: RootState) => state.account.user);

  useEffect(() => {
    if (account) {
      setProfileImage(account.profileImage || "");
      setNickname(account.nickname || "");
      setBio(account.bio || "");
    }
  }, [account]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // 미리보기 이미지 URL 설정
      };
      reader.readAsDataURL(file);
    }
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
  return (
    <div>
      <div className="flex flex-col items-center">
        <h2 className="">회원 정보 수정</h2>
        <div className="border-2 flex flex-col items-center rounded-xl">
          <form onSubmit={() => {}}>
            <div>
              <div className="w-[200px] h-[200px] rounded-full relative bg-slate-300 overflow-hidden">
                <Image src={profileImage ? String(profileImage) : "/profile.png"} alt="프로필 이미지" fill className="object-cover" />
              </div>

              <label htmlFor="profileImage" className="cursor-pointer rounded-full">
                <FaCog size={20} />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden" // 숨김 처리
                />
              </label>
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
            <button type="submit">변경하기</button>
          </form>
          <div>
            <Link href="/account">취소하기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountEdit;
