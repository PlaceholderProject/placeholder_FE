"use client";

import Link from "next/link";
import Image from "next/image";
import { LuBell, LuChevronRight, LuLockKeyhole, LuLogOut, LuShieldAlert, LuUserCog } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "@/stores/store";
import { getImageURL } from "@/utils/getImageURL";
import Cookies from "js-cookie";
import { setIsAuthenticated } from "@/stores/authSlice";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";
import { resetSelectedMeetupId } from "@/stores/proposalSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const menuItems = [
  { href: "/account/edit", label: "회원 정보 수정", icon: LuUserCog },
  { href: "/notification", label: "알림", icon: LuBell },
  { href: "/account/password-edit", label: "비밀번호 수정", icon: LuLockKeyhole },
  { href: "/account/delete", label: "회원탈퇴", icon: LuShieldAlert },
];

const Account = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
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
    <div className="mx-auto w-[95%] max-w-[58rem] space-y-[2rem] py-[2.4rem] md:py-[3.2rem]">
      <h1 className="text-foreground text-2xl font-bold">계정 관리</h1>

      <section className="border-border bg-card flex flex-col items-center gap-[1.2rem] rounded-[2rem] border p-[2rem] text-center">
        <div className="relative h-[9.6rem] w-[9.6rem] overflow-hidden rounded-full">
          <Image src={getImageURL(user.profileImage)} alt="프로필 이미지" fill sizes="9.6rem" className="object-cover" />
        </div>
        <div>
          <p className="text-foreground text-lg font-bold">{user.nickname || "사용자"}</p>
          <p className="text-muted-foreground mt-[0.3rem] text-sm">{user.email}</p>
        </div>
        {user.bio && <p className="text-muted-foreground max-w-[34rem] text-sm leading-relaxed break-keep">{user.bio}</p>}
      </section>

      <section className="border-border bg-card overflow-hidden rounded-[2rem] border">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="border-border hover:bg-muted/60 flex items-center gap-[1rem] border-b px-[1.6rem] py-[1.4rem] transition-colors last:border-b-0">
            <span className="bg-muted text-muted-foreground grid h-[3.6rem] w-[3.6rem] place-items-center rounded-[1.1rem]">
              <Icon className="h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
            </span>
            <span className="text-foreground flex-1 text-sm font-semibold">{label}</span>
            <LuChevronRight className="text-muted-foreground h-[1.6rem] w-[1.6rem]" />
          </Link>
        ))}
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="border-border text-destructive hover:bg-destructive/5 bg-card flex h-[4.6rem] w-full items-center justify-center gap-[0.7rem] rounded-[1.4rem] border text-sm font-semibold transition-colors"
      >
        <LuLogOut className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
        로그아웃
      </button>
    </div>
  );
};

export default Account;
