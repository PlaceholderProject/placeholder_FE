"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import ModalContainer from "@/components/modals/ModalContainer";
import { Toaster } from "sonner";

const AUTH_PATHS = ["/login", "/signup"];

const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? "min-h-screen" : "pt-[6rem] pb-[6rem] md:pt-[6.4rem] md:pb-[0rem]"}>{children}</main>
      <ModalContainer />
      {!isAuthPage && <NavigationBar />}
      <Toaster position="top-center" />
    </>
  );
};

export default AppShell;
