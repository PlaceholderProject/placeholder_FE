"use client";

import { RootState } from "@/stores/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordRecheck from "../auth/PasswordRecheck";
import Link from "next/link";
import { deleteUser } from "@/services/user.service";
import { setIsAuthenticated } from "@/stores/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AccountDelete = () => {
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleDeleteUserButton = async () => {
    const response = await deleteUser();
    if (response) {
      router.replace("/");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(setIsAuthenticated(false));
    }
  };

  return (
    <div>
      {!isPasswordRechecked && (
        <div className="fixed inset-20 z-50">
          <PasswordRecheck />
        </div>
      )}
      <p>정말로 탈퇴 하시겠습니까?</p>
      <Link href="/account">아니요</Link>
      <button onClick={handleDeleteUserButton} className="bg-slate-400">
        네
      </button>
    </div>
  );
};

export default AccountDelete;
