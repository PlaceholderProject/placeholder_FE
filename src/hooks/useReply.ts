import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNestedReply, createReply, deleteReply, editReply, getReply } from "@/services/reply.service"; // 파일 경로는 상황에 맞게 수정
import { newReplyProps } from "@/types/replyType";

// 댓글 목록 조회
export const useReplyList = (meetupId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["replyList", meetupId],
    queryFn: () => getReply(meetupId),
    enabled: options?.enabled,
  });
};

// 댓글 생성
export const useCreateReply = (meetupId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReply: newReplyProps) => createReply(newReply, meetupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replyList", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
    },
  });
};

// 답글 생성
export const useCreateNestedReply = (replyId: number, meetupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newReply: newReplyProps) => createNestedReply(newReply, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replyList", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
    },
  });
};

// 댓글 수정
export const useEditReply = (meetupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, replyId }: { text: string; replyId: number }) => editReply(text, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replyList", meetupId] });
    },
  });
};

// 댓글 삭제
export const useDeleteReply = (meetupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: number) => deleteReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replyList", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
    },
  });
};
