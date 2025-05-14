"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
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
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(setIsAuthenticated(false));
    dispatch(logout());
    dispatch(setHasUnreadNotifications(false));

    await persistor.purge();
  }, [dispatch]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      dispatch(setIsAuthenticated(true));
    } else {
      handleLogout();
    }
  }, [dispatch, handleLogout]);

  const handleNotificationPage = () => {
    router.replace("/notification");
  };

  return (
    <header className="flex h-[60px] items-center bg-[#006B8B]">
      <div className="flex w-full justify-between px-6">
        <Link href="/">
          <Image src="/logo.png" alt="로고" width={120} height={20} />
        </Link>
        <div className="flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <div className="flex flex-row items-center gap-3">
              <div className="relative h-[17px]">
                <button onClick={handleNotificationPage} className="bg-slate-300">
                  <FaRegBell color="#D9D9D9" size="17" />
                  {hasUnreadNotifications && <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#F9617A]"></div>}
                </button>
              </div>
              <button onClick={handleLogout} className="h-[15px] w-[50px] rounded-sm bg-[#FEFFEC] text-[8px] font-semibold">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="h-[15px] w-[50px] rounded-sm bg-[#FEFFEC] text-[8px] font-semibold">로그인</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
