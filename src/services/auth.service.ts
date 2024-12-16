import { BASE_URL } from "@/constants/baseURL";
import { LoginProps, NewUserProps } from "@/types/authType";
import Cookies from "js-cookie";

// sign-up
export const register = async (newUser: NewUserProps) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
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

// sign-in
export const login = async ({ email, password }: LoginProps) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error("이메일 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.");
    }

    const { access, refresh } = await response.json();

    Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });

    return { access, refresh };
  } catch (error) {
    console.error("네트워크 오류:", error);
    alert("로그인 처리 중 문제가 발생했습니다.");
    return;
  }
};

// refreshToken
export const refreshToken = async () => {
  const refreshToken = Cookies.get("refreshToken"); // 쿠키에서 refresh 토큰 가져오기
  if (!refreshToken) {
    console.error("No refreshToken available.");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { access, refresh } = await response.json();
    Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });

    // console.log("토큰 갱신 성공");
  } catch (error) {
    console.error("토큰 갱신 요청 실패:", error);
    return null;
  }
};
