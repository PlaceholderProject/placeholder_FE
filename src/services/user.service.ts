import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { refreshToken } from "./auth.service";
import { EditedUserProps, PresignedUrlProps, User } from "@/types/userType";
import { NewUserProps } from "@/types/authType";
import { toast } from "sonner";
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
    toast.error("회원가입을 실패했습니다. 다시 시도해주세요.");
    return;
  }
};
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
        await refreshToken();
        return getUser(retryCount + 1);
      }
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
};
export const editUser = async (editedUser: EditedUserProps, retryCount: number = 0): Promise<User | null> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return null;

  let profileImageUrl = "";
  if (editedUser.profileImage) {
    const filetype = editedUser.profileImage.type;
    const response = await fetch(`${BASE_URL}/api/v1/user/presigned-url?filetype=${encodeURIComponent(filetype)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("presigned URL 요청 실패");
    const presignedResult = (await response.json()).result[0];
    profileImageUrl = await uploadToS3WithForm(editedUser.profileImage, presignedResult);
  }
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
export const deleteUser = async () => {
  try {
    const accessToken = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/user/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const contentLength = response.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      console.warn("서버에서 빈 응답을 반환했습니다.");
      return { message: "User delete successfully." };
    }

    toast.success("탈퇴되었습니다.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("사용자 데이터 삭제 중 오류", error);
  }
};

const uploadToS3WithForm = async (file: File, presignedData: PresignedUrlProps) => {
  const { url, fields } = presignedData;
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("S3 업로드 실패");
  }
  return `${url}${fields.key}`;
};
