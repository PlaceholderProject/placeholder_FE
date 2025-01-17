"use client";

import { RootState } from "@/stores/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordRecheck from "../auth/PasswordRecheck";
import Link from "next/link";
import { deleteUser } from "@/services/user.service";
import { setIsAuthenticated } from "@/stores/authSlice";
import Cookies from "js-cookie";

const AccountDelete = () => {
  const [isDeletedAccount, setIsDeletedAccount] = useState(false);
  const isPasswordRechecked = useSelector((state: RootState) => state.auth.isPasswordRechecked);

  const dispatch = useDispatch();

  const handleDeleteUserButton = async () => {
    const response = await deleteUser();
    if (response) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(setIsAuthenticated(false));
      setIsDeletedAccount(true);
    }
  };

  return (
    <div>
      {!isPasswordRechecked && (
        <div className="fixed inset-20 z-50">
          <PasswordRecheck />
        </div>
      )}
      {isDeletedAccount ? (
        <div>
          <p>탈퇴되었습니다.</p>
          <Link href="/">메인페이지로 이동하기</Link>
        </div>
      ) : (
        <div>
          <p>정말로 탈퇴 하시겠습니까?</p>
          <Link href="/account">아니요</Link>
          <button onClick={handleDeleteUserButton} className="bg-slate-400">
            네
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDelete;
