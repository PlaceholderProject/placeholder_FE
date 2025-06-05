"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FaRegBell } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "@/stores/store";
import { setIsAuthenticated } from "@/stores/authSlice";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";
import { logout } from "@/stores/userSlice";
import { resetSelectedMeetupId } from "@/stores/proposalSlice";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const hasUnreadNotifications = useSelector((state: RootState) => state.notification.hasUnread);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    dispatch(setIsAuthenticated(false));
    dispatch(logout());
    dispatch(setHasUnreadNotifications(false));
    dispatch(resetSelectedMeetupId());

    queryClient.invalidateQueries({ queryKey: ["myMeetups", "organizer"] });

    await persistor.flush();
    await persistor.pause();
    await persistor.purge();

    await queryClient.clear();
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      dispatch(setIsAuthenticated(true));
    } else {
      handleLogout();
    }
  }, []);

  const handleNotificationPage = () => {
    router.replace("/notification");
  };

  return (
    <header className="bg-primary fixed left-0 right-0 top-0 z-50 flex h-[6rem] items-center">
      <div className="flex w-full justify-between px-6">
        <Link href="/">
          <Image src="/smallLogo.png" alt="로고" width={30} height={30} />
        </Link>
        <div className="flex items-center justify-center">
          {isAuthenticated ? (
            <div className="flex flex-row items-center gap-3">
              <div className="relative flex items-center">
                <button onClick={handleNotificationPage} className="text-gray-light">
                  <FaRegBell size="23" />
                  {hasUnreadNotifications && <div className="bg-error absolute right-0 top-0 h-2 w-2 rounded-full"></div>}
                </button>
              </div>
              <button onClick={handleLogout} className="bg-secondary-light h-[2.3rem] w-[7rem] rounded-[0.3rem] font-semibold leading-none">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-secondary-light h-[2.3rem] w-[7rem] rounded-[0.3rem] font-semibold">로그인</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
