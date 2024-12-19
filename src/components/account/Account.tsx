"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { getUser } from "@/services/account.service";
import { setUser } from "@/stores/accountSlice";

const Account = () => {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.account.user);

  useEffect(() => {
    const fetchAccount = async () => {
      const data = await getUser();
      if (data) {
        dispatch(
          setUser({
            email: data.email,
            nickname: data.nickname,
            bio: data.bio,
            profileImage: data.image_url,
          }),
        );
      }
    };
    fetchAccount();
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="">계정 관리</h2>
      <div className="border-2 flex flex-col items-center rounded-xl">
        <Image src={account.profileImage || "/profile.png"} alt="프로필 이미지" width="100" height="100" unoptimized={true} />
        <p>
          🎉<span className="font-bold">{account.nickname}</span>님, 환영합니다.
        </p>
        <div>{account.bio}</div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">계정정보 {account.email}</div>
          <Link href="/account-edit" className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">
            회원 정보 수정
            <FaChevronRight />
          </Link>
          <Link href="/password-edit" className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">
            비밀번호 수정
            <FaChevronRight />
          </Link>
          <button className="w-[240px] h-[45px] bg-[#FBFFA9] rounded-xl flex items-center">
            회원탈퇴
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
