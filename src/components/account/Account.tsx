"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { BASE_URL } from "@/constants/baseURL";

const Account = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    if (user.profileImage) {
      const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`;
      setProfileImage(imagePath);
    } else {
      setProfileImage("/profile.png");
    }
  }, [user]);

  // console.log(user.profileImage);

  return (
    <div className="flex flex-col items-center">
      <h2 className="">계정 관리</h2>
      <div className="border-2 flex flex-col items-center rounded-xl">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
          <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="100" height="100" unoptimized={true} />
        </div>
        <p>
          🎉<span className="font-bold">{user.nickname}</span>님, 환영합니다.
        </p>
        <div>{user.bio}</div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">계정정보 {user.email}</div>
          <Link href="/account-edit" className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">
            회원 정보 수정
            <FaChevronRight />
          </Link>
          <Link href="/password-edit" className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">
            비밀번호 수정
            <FaChevronRight />
          </Link>
          <Link href="/account-delete" className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">
            회원탈퇴
            <FaChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
