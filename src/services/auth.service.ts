import Cookies from "js-cookie";

export async function fetchData() {
  const accessToken = Cookies.get("accessToken"); // 쿠키에서 access 토큰 가져오기

  try {
    const response = await fetch("http://localhost:8000/api/v1/auth/profile", {
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
    const response = await fetch("http://localhost:8000/api/v1/auth/refresh", {
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
