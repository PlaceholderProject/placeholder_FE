import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";

// get-account
export const getAccount = async (retryCount: number = 0) => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) return null;
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      //   console.error("API 요청 실패");
      if (response.status === 401 && retryCount < 3) {
        await refreshToken(); // 토큰 갱신
        return getAccount(retryCount + 1); // 데이터 다시 요청
      }
      return null;
    }

    console.log(response);

    return await response.json();
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};
