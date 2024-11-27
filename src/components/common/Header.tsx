"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa6";

const Header = () => {
  const [isRead, setIsRead] = useState(true);
  const router = useRouter();

  const handleNotificationPage = () => {
    router.replace("/notification");
    setIsRead(false);
  };

  return (
    <header className="bg-[#006B8B] h-[60] flex justify-center items-center">
      <div className="w-11/12 flex justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="로고" width={113} height={20} />
        </Link>
        <div className="flex justify-center items-center gap-3">
          <div className="flex relative">
            <button onClick={handleNotificationPage}>
              <FaRegBell color="#D9D9D9" size="20" />
            </button>
            {isRead && <div className="bg-[#F9617A] w-2 h-2 rounded-full absolute right-0 top-0"></div>}
          </div>
          <Link href="/login">
            <button className="w-[50] h-[20] bg-[#FEFFEC]">로그인</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
