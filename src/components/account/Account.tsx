"use client";

import Link from "next/link";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { BASE_URL } from "@/constants/baseURL";

const Account = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const imagePath = user.profileImage ? (user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}/${user.profileImage}`) : "/profile.png";

  return (
    <div className="my-[4rem] flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center md:min-h-[calc(100vh-13.5rem)]">
      <h2 className="mb-[2rem] text-3xl font-semibold">계정 관리</h2>
      <div className="flex min-h-[54rem] w-[80%] min-w-[30rem] flex-col items-center justify-center gap-[3rem] rounded-[1.5rem] border-[0.1rem] border-gray-medium py-[3rem] md:max-w-[80rem]">
        <div className="flex w-full flex-col items-center justify-center gap-[1rem]">
          <div className="relative h-[15rem] w-[15rem] overflow-hidden rounded-full">
            <Image unoptimized={true} src={imagePath} alt="프로필 이미지" fill className="object-cover" />
          </div>
          <div className="text-lg">
            🎉 <span className="font-semibold">{user.nickname}</span>님, 환영합니다.
          </div>
          <div className="w-[70%] text-center">{user.bio}</div>
        </div>
        <div className="flex w-[80%] flex-col items-center gap-[1rem]">
          <div className="flex h-[4.5rem] w-full items-center justify-between rounded-xl bg-secondary-dark px-[2rem] shadow-md">
            <span className="font-semibold">계정정보</span>
            <span>{user.email}</span>
          </div>
          <Link href="/account/edit" className="flex h-[4.5rem] w-full items-center justify-between rounded-xl bg-secondary-dark px-[2rem] shadow-md">
            <span className="font-semibold">회원 정보 수정</span>
            <FaChevronRight size={16} />
          </Link>
          <Link href="/account/password-edit" className="flex h-[4.5rem] w-full items-center justify-between rounded-xl bg-secondary-dark px-[2rem] shadow-md">
            <span className="font-semibold">비밀번호 수정</span>
            <FaChevronRight size={16} />
          </Link>
          <Link href="/account/delete" className="flex h-[4.5rem] w-full items-center justify-between rounded-xl bg-secondary-dark px-[2rem] shadow-md">
            <span className="font-semibold">회원탈퇴</span>
            <FaChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
