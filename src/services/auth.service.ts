import { BASE_URL } from "@/constants/baseURL";
import { LoginProps } from "@/types/authType";
import Cookies from "js-cookie";
import { toast } from "sonner";

// 회원가입페이지 : 이메일 중복확인
export const checkEmail = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (response.ok) {
      toast.success("사용 가능한 이메일입니다.");
      return true;
    }

    const errorData = await response.json();

    const errorMessage = errorData?.detail?.[0]?.ctx?.error || errorData?.detail?.[0]?.msg || "알 수 없는 오류가 발생했습니다.";
    toast.error(errorMessage);
    return false;
  } catch (error) {
    console.error("네트워크 오류:", error);
    toast.error("네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    return false;
  }
};

// 회원가입페이지, 회원정보수정페이지 : 닉네임 중복확인
export const checkNickname = async (nickname: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/nickname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
      }),
    });

    if (response.ok) {
      toast.success("사용 가능한 닉네임입니다.");
      return true;
    }

    const errorData = await response.json();
    const errorMessage = errorData?.detail?.[0]?.ctx?.error || errorData?.detail?.[0]?.msg || "알 수 없는 오류가 발생했습니다.";
    toast.error(errorMessage);
    return false;
  } catch (error) {
    console.error("네트워크 오류:", error);
    return false;
  }
};

// 로그인페이지 : 로그인
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

    if (response.ok) {
      const { access, refresh } = await response.json();

      Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });

      return { access, refresh };
    }
    const errorData = await response.json();
    const errorMessage = errorData?.detail || "알 수 없는 오류가 발생했습니다.";
    toast.error(errorMessage);

    return false;
  } catch (error) {
    console.error("네트워크 오류:", error);
    toast.error("네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    return false;
  }
};

// refreshToken
export const refreshToken = async () => {
  const refreshToken = Cookies.get("refreshToken"); // 쿠키에서 refresh 토큰 가져오기
  if (!refreshToken) {
    console.error("refressToken이 없습니다. 다시 로그인 해주세요.");
    toast.error("다시 로그인해주세요.");
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
      console.error("refressToken이 없습니다. 다시 로그인 해주세요.");
      toast.error("다시 로그인해주세요.");
    }

    const { access, refresh } = await response.json();
    Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });
  } catch (error) {
    console.error("토큰 갱신 요청 실패:", error);
    return null;
  }
};

// 비밀번호수정페이지, 회원탈퇴페이지 : 비밀번호 재확인
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

    if (response.ok) {
      toast.success("비밀번호가 일치합니다.");
      return true;
    }

    const errorData = await response.json();
    const errorMessage = errorData?.message || "알 수 없는 오류가 발생했습니다.";
    toast.error(errorMessage);
  } catch (error) {
    console.error("네트워크 오류:", error);
    toast.error("네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    return false;
  }
};

// 비밀번호수정페이지 : 비밀번호 재설정
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

    if (response.ok) {
      const { access, refresh } = await response.json();
      Cookies.set("accessToken", access, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("refreshToken", refresh, { expires: 7, secure: true, sameSite: "Strict" });
      toast.success("비밀번호를 재설정했습니다.");
      return { access, refresh };
    }

    toast("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
  } catch (error) {
    console.error("네트워크 오류:", error);
    toast.error("네트워크에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    return false;
  }
};
