"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { refreshToken } from "@/services/auth.service";

export function useAuth() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    setIsLogged(!!accessToken);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsLogged(false);
  };

  return {
    isLogged,
    handleLogout,
    refreshToken, // refreshToken 함수를 필요로 하는 다른 컴포넌트에서 사용할 수 있도록 반환
  };
}
