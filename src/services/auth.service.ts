import { BASE_URL } from "@/constants/baseURL";
import { LoginProps } from "@/types/authType";
import Cookies from "js-cookie";

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
      console.log("이메일 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.");
      throw new Error("이메일 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.");
    }

    const { access, refresh } = await response.json();

    Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });

    return { access, refresh };
  } catch (error) {
    console.error("네트워크 오류:", error);
    alert("이메일 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.");
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

// recheck password
export const recheckPassword = async (password: string) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password }),
    });

    console.log("HTTP 상태 코드:", response.status);

    if (!response.ok) {
      throw new Error("비밀번호가 잘못되었습니다. 다시 시도해주세요.");
    }

    // 응답 본문 확인
    const contentLength = response.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      console.warn("서버에서 빈 응답을 반환했습니다.");
      return { message: "Password rechecked successfully." }; // 기본 메시지
    }

    // JSON 형식으로 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("네트워크 오류:", error);
    alert("비밀번호 확인 중 문제가 발생했습니다.");
    return;
  }
};

// reset password
export const resetPassword = async (password: string) => {
  const accessToken = Cookies.get("accessToken");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.detail?.[0]?.msg || "비밀번호 변경 중 오류가 발생했습니다.";

      throw new Error(errorMessage);
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
