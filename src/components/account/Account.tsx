"use client";

import { setIsAuthenticated } from "@/stores/authSlice";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";
import { resetSelectedMeetupId } from "@/stores/proposalSlice";
import { persistor, RootState } from "@/stores/store";
import { getImageURL } from "@/utils/getImageURL";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { LuChevronRight, LuLockKeyhole, LuLogOut, LuPencil, LuShieldAlert, LuUserCog } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Account = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(setIsAuthenticated(false));
    dispatch(setHasUnreadNotifications(false));
    dispatch(resetSelectedMeetupId());
    persistor.purge();
    queryClient.clear();
    router.replace("/");
    toast.success("로그아웃되었습니다.");
  };

  return (
    <main className="mx-auto w-[calc(100%-3.2rem)] max-w-[64rem] space-y-[2.6rem] py-[2.8rem] pb-[11rem] md:py-[4rem] md:pb-[5rem]">
      <header>
        <h1 className="text-foreground text-[2.6rem] leading-tight font-black tracking-[-0.035em] md:text-[3.2rem]">계정 관리</h1>
        <p className="text-muted-foreground mt-[0.7rem] text-sm">프로필과 계정 보안 정보를 관리해요.</p>
      </header>

      <section className="border-border bg-card flex items-center gap-[1.4rem] rounded-[2.2rem] border p-[1.5rem] shadow-[0_1.8rem_4rem_-3.3rem_rgba(24,23,29,0.3)] md:p-[1.8rem]">
        <div className="bg-muted relative h-[7.2rem] w-[7.2rem] shrink-0 overflow-hidden rounded-full">
          <Image src={getImageURL(user.profileImage)} alt="프로필 이미지" fill sizes="7.2rem" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-lg font-black">{user.nickname || "사용자"}</p>
          <p className="text-muted-foreground mt-[0.25rem] truncate text-sm">{user.email}</p>
          {user.bio && <p className="text-muted-foreground mt-[0.55rem] line-clamp-1 text-xs break-keep">{user.bio}</p>}
        </div>
        <Link
          href="/account/edit"
          aria-label="프로필 수정"
          className="bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground grid h-[4rem] w-[4rem] shrink-0 place-items-center rounded-full transition-colors"
        >
          <LuPencil className="h-[1.7rem] w-[1.7rem] stroke-[2]" />
        </Link>
      </section>

      <section aria-label="계정 설정">
        <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-[2rem] border">
          <SettingsRow href="/account/edit" label="회원 정보 수정" icon={LuUserCog} />
          <SettingsRow href="/account/password-edit" label="비밀번호 수정" icon={LuLockKeyhole} />
        </div>
      </section>

      <section aria-label="로그인 관리">
        <button
          type="button"
          onClick={handleLogout}
          className="border-border bg-card text-foreground hover:bg-muted/55 flex h-[6rem] w-full items-center gap-[1.1rem] rounded-[2rem] border px-[1.5rem] text-left transition-colors"
        >
          <span className="bg-muted text-muted-foreground grid h-[3.8rem] w-[3.8rem] shrink-0 place-items-center rounded-[1.2rem]">
            <LuLogOut className="h-[1.7rem] w-[1.7rem] stroke-[1.9]" />
          </span>
          <span className="flex-1 text-sm font-bold">로그아웃</span>
          <LuChevronRight className="text-muted-foreground h-[1.6rem] w-[1.6rem]" />
        </button>
      </section>

      <section aria-label="회원탈퇴">
        <div className="border-border bg-card overflow-hidden rounded-[2rem] border">
          <SettingsRow href="/account/delete" label="회원탈퇴" icon={LuShieldAlert} destructive />
        </div>
      </section>
    </main>
  );
};

const SettingsRow = ({ href, label, icon: Icon, destructive = false }: { href: string; label: string; icon: IconType; destructive?: boolean }) => (
  <Link
    href={href}
    className={`border-border bg-card flex h-[6rem] items-center gap-[1.1rem] px-[1.5rem] transition-colors first:rounded-t-[2rem] last:rounded-b-[2rem] ${destructive ? "hover:bg-destructive/5" : "hover:bg-muted/55"}`}
  >
    <span className={`grid h-[3.8rem] w-[3.8rem] shrink-0 place-items-center rounded-[1.2rem] ${destructive ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
      <Icon className="h-[1.8rem] w-[1.8rem] stroke-[1.9]" />
    </span>
    <span className={`min-w-0 flex-1 text-sm font-bold ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</span>
    <LuChevronRight className="text-muted-foreground h-[1.6rem] w-[1.6rem] shrink-0" />
  </Link>
);

export default Account;
