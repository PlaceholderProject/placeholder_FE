"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FaRegBell } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "@/stores/authSlice";
import { persistor, RootState } from "@/stores/store";
import { logout } from "@/stores/userSlice";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";

const Header = () => {
  const hasUnreadNotifications = useSelector((state: RootState) => state.notification.hasUnread);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      dispatch(setIsAuthenticated(true));
    } else {
      handleLogout();
    }
  }, []);

  console.log("REDUX에 저장된 유저정보", user);

  const handleLogout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(setIsAuthenticated(false));
    dispatch(logout());
    dispatch(setHasUnreadNotifications(false));

    await persistor.purge();
  };

  const handleNotificationPage = () => {
    router.replace("/notification");
  };

  return (
    <header className="bg-[#006B8B] h-[60] flex justify-center items-center">
      <div className="w-11/12 flex justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="로고" width={113} height={20} />
        </Link>
        <div className="flex justify-center items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="relative">
                <button onClick={handleNotificationPage}>
                  <FaRegBell color="#D9D9D9" size="20" />
                </button>
                {hasUnreadNotifications &&
                  <div className="bg-[#F9617A] w-2 h-2 rounded-full absolute right-0 top-0"></div>}
              </div>
              <button onClick={handleLogout} className="w-20 h-8 bg-[#FEFFEC]">
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="w-20 h-8 bg-[#FEFFEC]">로그인</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
