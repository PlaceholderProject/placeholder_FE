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
import { setUser } from "@/stores/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import HamburgerMenu from "@/components/common/HamburgerMenu";
import { useNotificationList } from "@/hooks/useNotification";
import { resetSelectedMeetupId } from "@/stores/proposalSlice";
import { getUser } from "@/services/user.service";
import { toast } from "sonner";

const Header = () => {
  const hasUnreadNotifications = useSelector((state: RootState) => state.notification.hasUnread);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications } = useNotificationList({ enabled: isAuthenticated });

  useEffect(() => {
    if (notifications) {
      const hasUnread = notifications.some(notification => !notification.is_read);
      dispatch(setHasUnreadNotifications(hasUnread));
    }
  }, [notifications, dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      dispatch(setIsAuthenticated(false));
      dispatch(setHasUnreadNotifications(false));
      dispatch(resetSelectedMeetupId());
      persistor.purge();

      queryClient.invalidateQueries({ queryKey: ["myMeetups", "organizer"] });
      queryClient.invalidateQueries({ queryKey: ["receivedProposals"] });
      queryClient.invalidateQueries({ queryKey: ["sentProposals"] });

      queryClient.clear();
      router.replace("/");
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  }, [dispatch, queryClient, router]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      dispatch(setIsAuthenticated(true));
      if (!user.nickname) {
        const fetchUser = async () => {
          const data = await getUser();
          if (data) {
            dispatch(
              setUser({
                email: data.email,
                nickname: data.nickname,
                bio: data.bio,
                profileImage: data.image,
              }),
            );
          }
        };
        fetchUser();
      }
    } else {
      dispatch(setIsAuthenticated(false));
    }
  }, [dispatch, user.nickname]);

  const handleNotificationPage = () => {
    router.replace("/notification");
  };

  return (
    <header className="bg-primary fixed top-0 right-0 left-0 z-50 flex h-[6rem] items-center justify-center md:h-[7.5rem]">
      <div className="flex w-[95%] justify-between">
        <Link href="/">
          <Image unoptimized={true} src="/smallLogo.png" alt="작은 로고" width={30} height={30} priority className="block transition-all duration-300 md:hidden" />
          <Image unoptimized={true} src="/logo.png" alt="큰 로고" width={175} height={60} priority className="hidden transition-all duration-300 md:block" />
        </Link>

        <div className="flex items-center justify-center gap-[1rem]">
          {isAuthenticated ? (
            <div className="flex flex-row items-center gap-[1rem]">
              <p className="hidden text-base text-white md:block">
                🍋 <span className="font-bold">{user.nickname}</span> 님 안녕하세요!
              </p>
              <div className="relative flex items-center">
                <button onClick={handleNotificationPage} className="text-[2.3rem] text-white transition-colors hover:text-white/80">
                  <FaRegBell />
                  {hasUnreadNotifications && <div className="bg-accent absolute top-0 right-0 h-[0.8rem] w-[0.8rem] rounded-full md:h-[1rem] md:w-[1rem]"></div>}
                </button>
              </div>
              <button onClick={handleLogout} className="text-primary h-[2.3rem] w-[7rem] rounded-full bg-white leading-none font-semibold transition hover:bg-white/90 md:h-[2.6rem] md:w-[11rem]">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex gap-[2rem]">
              <Link href="/login">
                <button className="text-primary h-[2.3rem] w-[7rem] rounded-full bg-white font-semibold transition hover:bg-white/90 md:h-[2.6rem] md:w-[11rem]">로그인</button>
              </Link>
              <Link href="/signup">
                <button className="text-primary h-[2.3rem] w-[7rem] rounded-full bg-white font-semibold transition hover:bg-white/90 md:h-[2.6rem] md:w-[11rem]">회원가입</button>
              </Link>
            </div>
          )}
          <div className="hidden items-center md:flex">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
