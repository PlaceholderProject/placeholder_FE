import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";
import { EditedUserProps, PresignedUrlProps, User } from "@/types/userType";
import { NewUserProps } from "@/types/authType";
import { toast } from "sonner";

// create user
export const createUser = async (newUser: NewUserProps): Promise<number | undefined> => {
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
      toast.error(errorResult.detail);
      return;
    }

    const result = response.status;

    return result;
  } catch (error) {
    console.log(error);
    toast.error("회원가입을 실패했습니다. 다시 시도해주세요.");
    return;
  }
};

// get user
export const getUser = async (retryCount: number = 0): Promise<User | null> => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) return null;
  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 && retryCount < 3) {
        await refreshToken(); // 토큰 갱신
        return getUser(retryCount + 1); // 데이터 다시 요청
      }
      return null;
    }
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};

// edit-user
export const editUser = async (editedUser: EditedUserProps, retryCount: number = 0): Promise<User | null> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return null;

  let profileImageUrl = "";

  // 이미지 업로드 처리
  if (editedUser.profileImage) {
    // 1. presigned 정보 요청
    const filetype = editedUser.profileImage.type;
    const response = await fetch(`${BASE_URL}/api/v1/user/presigned-url?filetype=${encodeURIComponent(filetype)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("presigned URL 요청 실패");
    const presignedResult = (await response.json()).result[0]; // 첫 presigned entry
    profileImageUrl = await uploadToS3WithForm(editedUser.profileImage, presignedResult);
  }

  // 2. 최종 유저 정보 전달
  const payload = {
    nickname: editedUser.nickname,
    bio: editedUser.bio,
    image: profileImageUrl || null,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401 && retryCount < 3) {
        await refreshToken();
        return editUser(editedUser, retryCount + 1);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("유저 수정 중 오류:", error);
    return null;
  }
};

// delete-user
export const deleteUser = async () => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/user/me`, {
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

    toast.success("탈퇴되었습니다.");
    // JSON 형식으로 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("사용자 데이터 삭제 중 오류", error);
  }
};

const uploadToS3WithForm = async (file: File, presignedData: PresignedUrlProps) => {
  const { url, fields } = presignedData;

  console.log(presignedData);

  const formData = new FormData();

  // presigned 필드들 모두 form에 append
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  // 마지막에 실제 파일을 넣어야 함
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("S3 업로드 실패");
  }

  // 업로드 성공 시 S3 경로는: `${url}${fields.key}`
  return `${url}${fields.key}`;
};
