"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FaRegBell } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setIsAuthenticated } from "@/stores/authSlice";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";
import { logout } from "@/stores/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import HamburgerMenu from "@/components/common/HamburgerMenu";
import { resetSelectedMeetupId } from "@/stores/proposalSlice";

const Header = () => {
  const hasUnreadNotifications = useSelector((state: RootState) => state.notification.hasUnread);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("persist:user");

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      dispatch(logout());
      dispatch(setIsAuthenticated(false));
      dispatch(setHasUnreadNotifications(false));
      dispatch(resetSelectedMeetupId());

      queryClient.invalidateQueries({ queryKey: ["myMeetups", "organizer"] });
      queryClient.invalidateQueries({ queryKey: ["receivedProposals"] });
      queryClient.invalidateQueries({ queryKey: ["sentProposals"] });

      await queryClient.clear();

      router.replace("/");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  }, [dispatch, queryClient, router]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      dispatch(setIsAuthenticated(true));
    } else {
      dispatch(setIsAuthenticated(false));
    }
  }, [dispatch]);

  const handleNotificationPage = () => {
    router.replace("/notification");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[6rem] items-center justify-center bg-primary md:h-[7.5rem]">
      <div className="flex w-[95%] justify-between">
        <Link href="/">
          <Image src="/smallLogo.png" alt="작은 로고" width={30} height={30} priority className="block transition-all duration-300 md:hidden" />
          <Image src="/logo.png" alt="큰 로고" width={175} height={60} priority className="hidden transition-all duration-300 md:block" />
        </Link>

        <div className="flex items-center justify-center gap-[1rem]">
          {isAuthenticated ? (
            <div className="flex flex-row items-center gap-[1rem]">
              <p className="hidden text-base text-white md:block">
                🍋 <span className="font-bold">{user.nickname}</span> 님 안녕하세요!
              </p>
              <div className="relative flex items-center">
                <button onClick={handleNotificationPage} className="text-[2.3rem] text-gray-light">
                  <FaRegBell />
                  {hasUnreadNotifications && <div className="absolute right-0 top-0 h-[0.8rem] w-[0.8rem] rounded-full bg-error md:h-[1rem] md:w-[1rem]"></div>}
                </button>
              </div>
              <button onClick={handleLogout} className="h-[2.3rem] w-[7rem] rounded-[0.3rem] bg-secondary-light font-semibold leading-none md:h-[2.6rem] md:w-[11rem] md:rounded-[0.6rem]">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex gap-[2rem]">
              <Link href="/login">
                <button className="h-[2.3rem] w-[7rem] rounded-[0.3rem] bg-secondary-light font-semibold md:h-[2.6rem] md:w-[11rem] md:rounded-[0.6rem]">로그인</button>
              </Link>
              <Link href="/signup">
                <button className="h-[2.3rem] w-[7rem] rounded-[0.3rem] bg-secondary-light font-semibold md:h-[2.6rem] md:w-[11rem] md:rounded-[0.6rem]">회원가입</button>
              </Link>
            </div>
          )}
          <div className="hidden lg:block">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
