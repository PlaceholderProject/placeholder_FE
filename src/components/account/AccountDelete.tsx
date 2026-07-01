"use client";

import { persistor, RootState } from "@/stores/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordRecheck from "../auth/PasswordRecheck";
import Link from "next/link";
import { setIsAuthenticated, setIsPasswordRechecked } from "@/stores/authSlice";
import Cookies from "js-cookie";
import { useDeleteUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LuArrowLeft, LuShieldAlert, LuTrash2 } from "react-icons/lu";

const AccountDelete = () => {
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  const router = useRouter();
  const deleteUserMutation = useDeleteUser();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsPasswordRechecked(false));
  }, [dispatch]);

  const handleDeleteUserButton = async () => {
    try {
      await deleteUserMutation.mutateAsync();
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(setIsAuthenticated(false));
      persistor.purge();
      router.replace("/");
      toast.success("탈퇴되었습니다.");
    } catch {
      toast.error("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mx-auto w-[95%] max-w-[58rem] space-y-[1.8rem] py-[2.4rem] md:py-[3.2rem]">
      <Link href="/account" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
        <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
        계정 관리
      </Link>

      <div>
        <h1 className="text-foreground text-2xl font-bold">회원탈퇴</h1>
        <p className="text-muted-foreground mt-[0.5rem] text-sm">탈퇴 전 비밀번호를 확인하고 계정 삭제를 진행해요.</p>
      </div>

      {!isPasswordRechecked ? (
        <PasswordRecheck />
      ) : (
        <section className="border-border bg-card rounded-[2rem] border p-[1.8rem] md:p-[2rem]">
          <div className="bg-destructive/10 text-destructive mb-[1.4rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-[1.3rem]">
            <LuShieldAlert className="h-[2.2rem] w-[2.2rem] stroke-[1.9]" />
          </div>
          <h2 className="text-foreground text-lg font-bold">정말 탈퇴하시겠어요?</h2>
          <p className="text-muted-foreground mt-[0.7rem] text-sm leading-relaxed break-keep">탈퇴하면 계정 정보가 삭제되고, 진행 중인 모임 활동을 더 이상 관리할 수 없어요.</p>

          <div className="mt-[1.8rem] grid gap-[0.8rem] sm:grid-cols-2">
            <Link
              href="/account"
              className="border-border text-muted-foreground hover:bg-muted flex h-[4.6rem] items-center justify-center rounded-[1.4rem] border text-sm font-semibold transition-colors"
            >
              유지하기
            </Link>
            <button
              type="button"
              onClick={handleDeleteUserButton}
              disabled={deleteUserMutation.isPending}
              className="bg-destructive text-destructive-foreground flex h-[4.6rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <LuTrash2 className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
              {deleteUserMutation.isPending ? "탈퇴 중" : "탈퇴하기"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AccountDelete;
