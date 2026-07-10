"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import ModalContainer from "@/components/modals/ModalContainer";
import { Toaster } from "sonner";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

const AUTH_PATHS = ["/login", "/signup"];

const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname);
  const showCreateMeetupFab = pathname === "/" || pathname.startsWith("/search") || pathname === "/my-space/my-ad";

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? "min-h-screen" : "pt-[6.8rem] pb-[10rem] md:pt-[7.2rem] md:pb-0"}>{children}</main>
      <ModalContainer />
      {!isAuthPage && showCreateMeetupFab && (
        <Link
          href="/meetup/create"
          aria-label="모임 만들기"
          className="bg-primary text-primary-foreground hover:bg-primary-hover fixed right-[2.4rem] bottom-[2.4rem] z-40 hidden h-[4.8rem] items-center gap-[0.6rem] rounded-full px-[1.5rem] text-sm font-black shadow-[0_1.4rem_3rem_-1.2rem_rgba(108,77,255,0.65)] transition-all hover:-translate-y-[0.15rem] md:inline-flex"
        >
          <LuPlus className="h-[1.8rem] w-[1.8rem] stroke-[2.4]" />
          모임 만들기
        </Link>
      )}
      {!isAuthPage && <NavigationBar />}
      <Toaster position="top-center" />
    </>
  );
};

export default AppShell;
