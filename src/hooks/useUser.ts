import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, editUser, deleteUser } from "@/services/user.service";
import { NewUserProps } from "@/types/authType";
import { EditedUserProps } from "@/types/userType";

// 사용자 정보 가져오기
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });
};

// 회원가입
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (newUser: NewUserProps) => createUser(newUser),
    onError: (error: any) => {
      console.error("회원가입 실패:", error);
      alert("회원가입을 실패했습니다. 다시 시도해주세요.");
    },
  });
};

// 사용자 정보 수정
export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (editedUser: EditedUserProps) => editUser(editedUser), // File 포함된 formData
    onSuccess: response => {
      // 여기에선 바로 작업하지 않음 → 컴포넌트에서 처리
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      alert("사용자 정보 수정 실패: " + error?.message || "알 수 없는 오류");
      console.error(error);
    },
  });
};

// 사용자 삭제 (탈퇴)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("탈퇴 중 오류:", error);
      alert("사용자 탈퇴에 실패했습니다.");
    },
  });
};
