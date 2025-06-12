"use client";

import { RootState } from "@/stores/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordRecheck from "../auth/PasswordRecheck";
import Link from "next/link";
import { setIsAuthenticated } from "@/stores/authSlice";
import Cookies from "js-cookie";
import { useDeleteUser } from "@/hooks/useUser";

const AccountDelete = () => {
  const [isDeletedAccount, setIsDeletedAccount] = useState(false);
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  const deleteUserMutation = useDeleteUser();

  const dispatch = useDispatch();

  const handleDeleteUserButton = async () => {
    try {
      await deleteUserMutation.mutateAsync(); // ✅ 비동기 호출
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(setIsAuthenticated(false));
      setIsDeletedAccount(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="my-[4rem] flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center md:min-h-[calc(100vh-13.5rem)]">
      <h2 className="mb-[2rem] text-3xl font-semibold">계정 관리</h2>
      <div className="relative z-10 flex min-h-[54rem] w-[80%] min-w-[30rem] flex-col items-center justify-center gap-[3rem] rounded-[1.5rem] border-[0.1rem] border-gray-medium py-[3rem]">
        {!isPasswordRechecked && (
          <div className="absolute inset-5 z-50 flex items-center justify-center bg-[#f9f9f9]">
            <PasswordRecheck />
          </div>
        )}
        {isDeletedAccount ? (
          <div className="flex flex-col items-center">
            <p className="my-[5rem] text-lg font-semibold">탈퇴되었습니다.</p>
            <Link href="/" className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-secondary-dark text-lg">
              메인페이지로 이동하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="my-[5rem] text-lg font-semibold">정말로 탈퇴 하시겠습니까?</p>
            <div className="flex flex-col gap-[0.8rem]">
              <Link href="/account" className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-secondary-dark text-lg">
                아니요
              </Link>
              <button onClick={handleDeleteUserButton} className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-gray-light text-lg">
                네
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDelete;
