import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";
import { EditedUserProps } from "@/types/userType";
import { NewUserProps } from "@/types/authType";

// create user
export const createUser = async (newUser: NewUserProps) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/user`, {
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

// get user
export const getUser = async (retryCount: number = 0) => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) return null;
  try {
    const response = await fetch(`${BASE_URL}/api/v1/user`, {
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
        return getUser(retryCount + 1); // 데이터 다시 요청
      }
      return null;
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};

// edit-user
export const editUser = async (editedUser: EditedUserProps, retryCount: number = 0) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return null;

  const formData = new FormData();
  formData.append("nickname", editedUser.nickname);
  formData.append("bio", editedUser.bio);
  formData.append("profileImage", editedUser.profileImage);

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify(editedUser),
    });

    if (!response.ok) {
      //   console.error("API 요청 실패");
      if (response.status === 401 && retryCount < 3) {
        await refreshToken(); // 토큰 갱신
        return getUser(retryCount + 1); // 데이터 다시 요청
      }
      return null;
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("사용자 데이터 수정 중 오류", error);
  }
};

// delete-user
export const deleteUser = async () => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 응답 본문 확인
    const contentLength = response.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      console.warn("서버에서 빈 응답을 반환했습니다.");
      return { message: "User delete successfully." }; // 기본 메시지
    }

    alert("탈퇴되었습니다.");
    // JSON 형식으로 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("사용자 데이터 삭제 중 오류", error);
  }
};
