import { AUTH_API_HOST } from "@/constants/auth";
import Cookies from "js-cookie";

interface newUser {
  email: string;
  password: string;
  nickname: string;
  bio: string | null;
}

export const register = async (newUser: newUser) => {
  try {
    const response = await fetch(`${AUTH_API_HOST}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      alert(errorResult.detail);
      return;
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
    alert("회원가입을 실패했습니다. 다시 시도해주세요.");
    return;
  }
};

export async function fetchData() {
  const accessToken = Cookies.get("accessToken");

  try {
    const response = await fetch(`${AUTH_API_HOST}/api/v1/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API 요청 실패");
      if (response.status === 401) {
        await refreshToken(); // 토큰 갱신
        return fetchData(); // 데이터 다시 요청
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
}

export async function refreshToken() {
  const refreshToken = Cookies.get("refreshToken"); // 쿠키에서 refresh 토큰 가져오기

  try {
    const response = await fetch(`${AUTH_API_HOST}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.error("토큰 갱신 실패");
      throw new Error("Refresh token failed");
    }

    const { access, refresh } = await response.json();
    Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });

    console.log("토큰 갱신 성공");
  } catch (error) {
    console.error("토큰 갱신 요청 실패:", error);
    throw error;
  }
}
