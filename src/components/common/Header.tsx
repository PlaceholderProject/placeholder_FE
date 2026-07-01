"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuBell, LuChevronRight, LuCompass, LuLogOut, LuPlus, LuSearch, LuSettings, LuUserRound, LuUsers } from "react-icons/lu";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "@/stores/store";
import { setIsAuthenticated } from "@/stores/authSlice";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";
import { setUser } from "@/stores/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationList } from "@/hooks/useNotification";
import { resetSelectedMeetupId } from "@/stores/proposalSlice";
import { getUser } from "@/services/user.service";
import { markNotificationAsRead } from "@/services/notification.service";
import { getImageURL } from "@/utils/getImageURL";
import { formatNotificationDate } from "@/utils/NotificationdateUtils";
import { getNotificationMeta, getNotificationTitle } from "@/utils/notificationUtils";
import { toast } from "sonner";

const Header = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useNotificationList({ enabled: isAuthenticated });
  const unreadCount = notifications?.filter(notification => !notification.is_read).length ?? 0;
  const previewNotifications = notifications?.slice(0, 3) ?? [];

  useEffect(() => {
    if (notifications) {
      const hasUnread = notifications.some(notification => !notification.is_read);
      dispatch(setHasUnreadNotifications(hasUnread));
    }
  }, [notifications, dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      setMenuOpen(false);
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

  // 아바타 드롭다운: 바깥 클릭 / ESC 로 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [menuOpen]);

  const handleNotificationPreviewClick = (notificationId: number | null, isRead: boolean) => {
    setMenuOpen(false);
    if (notificationId && !isRead) {
      markNotificationAsRead(notificationId).finally(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    }
  };

  // 가운데 네비 (로그인 필요 항목은 인증 시에만 노출)
  const navItems = [
    { href: "/", icon: LuCompass, label: "둘러보기", isActive: pathname === "/", requireAuth: false },
    { href: "/search", icon: LuSearch, label: "검색", isActive: pathname.startsWith("/search"), requireAuth: false },
    { href: "/my-space/my-meetup", icon: LuUserRound, label: "내 공간", isActive: pathname.startsWith("/my-space"), requireAuth: true },
  ];
  const visibleNavItems = navItems.filter(item => !item.requireAuth || isAuthenticated);

  return (
    <header className="border-border fixed top-0 right-0 left-0 z-50 flex h-[6rem] items-center justify-center border-b bg-white/80 backdrop-blur-md md:h-[6.4rem]">
      <div className="mx-auto flex w-[95%] max-w-[100rem] items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center">
          <Image unoptimized src="/logo.png" alt="placeholder 로고" width={175} height={60} priority className="h-[2.4rem] w-auto md:h-[2.8rem]" />
        </Link>

        {/* 가운데 네비 (데스크탑) */}
        <nav className="hidden items-center gap-[0.3rem] md:flex">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center gap-[0.5rem] rounded-full px-[1.2rem] py-[0.7rem] text-sm font-medium transition-colors ${
                  item.isActive ? "bg-primary-soft text-primary font-semibold" : "text-foreground/75 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} strokeWidth={1.9} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측: CTA + 인증 영역 */}
        <div className="flex items-center gap-[0.8rem]">
          <Link
            href="/meetup/create"
            className="bg-foreground text-background hidden items-center gap-[0.5rem] rounded-full px-[1.4rem] py-[0.8rem] text-sm font-semibold transition hover:opacity-90 md:inline-flex"
          >
            <LuPlus size={15} strokeWidth={2.2} />
            모임 만들기
          </Link>

          {isAuthenticated ? (
            <>
              {/* 아바타 드롭다운 */}
              <div ref={dropdownRef} className="relative">
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="내 계정 메뉴"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="border-border hover:border-primary/40 block h-[3.4rem] w-[3.4rem] overflow-hidden rounded-full border transition-colors"
                  >
                    <Image src={getImageURL(user.profileImage)} alt="프로필" width={34} height={34} className="h-full w-full object-cover" />
                  </button>
                  {unreadCount > 0 && <span aria-label="읽지 않은 알림" className="bg-destructive ring-card absolute -top-[0.1rem] -right-[0.1rem] h-[1rem] w-[1rem] rounded-full ring-[0.2rem]" />}
                </div>

                {menuOpen && (
                  <div className="border-border absolute right-0 mt-[0.9rem] w-[29rem] overflow-hidden rounded-[1.6rem] border bg-white shadow-[0_22px_50px_-24px_rgba(22,21,15,0.45)]" role="menu">
                    <div className="border-border flex items-center gap-[1rem] border-b px-[1.4rem] py-[1.3rem]">
                      <div className="relative h-[4.2rem] w-[4.2rem] shrink-0 overflow-hidden rounded-full">
                        <Image src={getImageURL(user.profileImage)} alt="프로필" fill sizes="4.2rem" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-semibold">{user.nickname ?? "사용자"}</p>
                        {user.email && <p className="text-muted-foreground mt-[0.2rem] truncate text-xs">{user.email}</p>}
                      </div>
                    </div>

                    <div className="border-border border-b px-[1.1rem] py-[1rem]">
                      <Link
                        href="/notification"
                        onClick={() => setMenuOpen(false)}
                        className="hover:bg-muted flex items-center justify-between rounded-[1rem] px-[0.8rem] py-[0.7rem] transition-colors"
                        role="menuitem"
                      >
                        <span className="text-foreground flex items-center gap-[0.7rem] text-sm font-semibold">
                          <LuBell className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
                          알림
                        </span>
                        <span className="text-muted-foreground inline-flex items-center gap-[0.5rem] text-xs">
                          {unreadCount > 0 ? `${unreadCount}개 안 읽음` : "모두 읽음"}
                          <LuChevronRight className="h-[1.4rem] w-[1.4rem]" />
                        </span>
                      </Link>

                      <div className="mt-[0.5rem] space-y-[0.3rem]">
                        {previewNotifications.length > 0 ? (
                          previewNotifications.map(notification => {
                            const { icon: NotificationIcon, iconClassName } = getNotificationMeta(notification);
                            const title = getNotificationTitle(notification);

                            return (
                              <Link
                                key={notification.id}
                                href={notification.url ?? "/notification"}
                                onClick={() => handleNotificationPreviewClick(notification.id, notification.is_read)}
                                className={`hover:bg-muted relative flex gap-[0.8rem] rounded-[1rem] px-[0.8rem] py-[0.8rem] transition-colors ${notification.is_read ? "" : "bg-[#f7f2ff]"}`}
                              >
                                <span className={`grid h-[2.8rem] w-[2.8rem] shrink-0 place-items-center rounded-full ${iconClassName}`}>
                                  <NotificationIcon className="h-[1.4rem] w-[1.4rem] stroke-[2]" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="text-foreground line-clamp-1 text-xs leading-relaxed font-semibold">{title}</span>
                                  {notification.created_at && (
                                    <span className="text-muted-foreground mt-[0.15rem] block text-[1rem] leading-[1.4rem]">{formatNotificationDate(notification.created_at)}</span>
                                  )}
                                </span>
                                {!notification.is_read && <span className="bg-primary mt-[0.3rem] h-[0.65rem] w-[0.65rem] shrink-0 rounded-full" />}
                              </Link>
                            );
                          })
                        ) : (
                          <p className="text-muted-foreground px-[0.8rem] py-[0.7rem] text-xs">새 알림이 없어요.</p>
                        )}
                      </div>
                    </div>

                    <div className="p-[1.1rem]">
                      <Link
                        href="/my-space/my-meetup"
                        onClick={() => setMenuOpen(false)}
                        className="text-foreground hover:bg-muted flex items-center justify-between rounded-[1rem] px-[0.8rem] py-[0.9rem] text-sm transition-colors"
                        role="menuitem"
                      >
                        <span className="flex items-center gap-[0.7rem] font-semibold">
                          <LuUsers className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />내 공간
                        </span>
                        <LuChevronRight className="text-muted-foreground h-[1.4rem] w-[1.4rem]" />
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className="text-foreground hover:bg-muted flex items-center justify-between rounded-[1rem] px-[0.8rem] py-[0.9rem] text-sm transition-colors"
                        role="menuitem"
                      >
                        <span className="flex items-center gap-[0.7rem] font-semibold">
                          <LuSettings className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
                          계정 관리
                        </span>
                        <LuChevronRight className="text-muted-foreground h-[1.4rem] w-[1.4rem]" />
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-destructive hover:bg-destructive/5 flex w-full items-center gap-[0.7rem] rounded-[1rem] px-[0.8rem] py-[0.9rem] text-left text-sm font-semibold transition-colors"
                        role="menuitem"
                      >
                        <LuLogOut className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-[0.6rem]">
              <Link href="/login" className="text-foreground hover:bg-muted rounded-full px-[1.2rem] py-[0.8rem] text-sm font-semibold transition-colors">
                로그인
              </Link>
              <Link href="/signup" className="bg-primary rounded-full px-[1.4rem] py-[0.8rem] text-sm font-semibold text-white transition hover:opacity-90">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
