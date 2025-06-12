import { deleteMeetupMemberApi } from "@/services/my.space.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMemberDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => deleteMeetupMemberApi(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
      queryClient.invalidateQueries({ queryKey: ["myMeetupMembers"] });
    },
    onError: error => {
      console.error("멤버 삭제 실패", error);
      alert("멤버 삭제 중 오류가 발생했습니다.");
    },
  });
};
