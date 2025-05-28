"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { BASE_URL } from "@/constants/baseURL";

const Account = () => {
  const [profileImage, setProfileImage] = useState<string>("");

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user.profileImage) {
      const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`;
      setProfileImage(imagePath);
    } else {
      setProfileImage("/profile.png");
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-[10rem]">
      <h2 className="mb-[2rem] text-3xl font-semibold">계정 관리</h2>
      <div className="border-gray-medium flex h-full w-[80%] min-w-[30rem] flex-col items-center justify-center gap-[3rem] rounded-[1.5rem] border-[0.1rem] py-[3rem]">
        <div className="flex w-full flex-col items-center justify-center gap-[1rem]">
          <div className="mb-[2rem] h-[15rem] w-[15rem] overflow-hidden rounded-full">
            <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="150" height="150" unoptimized={true} />
          </div>
          <p className="text-lg">
            🎉 <span className="font-semibold">{user.nickname}</span>님, 환영합니다.
          </p>
          <div className="w-[70%] text-center">{user.bio}</div>
        </div>
        <div className="flex w-[80%] flex-col items-center gap-[1rem]">
          <div className="bg-secondary-dark flex h-[4.5rem] w-full items-center justify-between rounded-xl px-[2rem] shadow-md">
            <span className="font-semibold">계정정보</span>
            <span>{user.email}</span>
          </div>
          <Link href="/account-edit" className="bg-secondary-dark flex h-[4.5rem] w-full items-center justify-between rounded-xl px-[2rem] shadow-md">
            <span className="font-semibold">회원 정보 수정</span>
            <FaChevronRight size={16} />
          </Link>
          <Link href="/password-edit" className="bg-secondary-dark flex h-[4.5rem] w-full items-center justify-between rounded-xl px-[2rem] shadow-md">
            <span className="font-semibold">비밀번호 수정</span>
            <FaChevronRight size={16} />
          </Link>
          <Link href="/account-delete" className="bg-secondary-dark flex h-[4.5rem] w-full items-center justify-between rounded-xl px-[2rem] shadow-md">
            <span className="font-semibold">회원탈퇴</span>
            <FaChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
