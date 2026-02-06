import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNestedReply, createReply, deleteReply, editReply, getReply } from "@/services/reply.service";
import { newReplyProps } from "@/types/replyType";
export const useReplyList = (meetupId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["replyList", meetupId],
    queryFn: () => getReply(meetupId),
    enabled: options?.enabled,
  });
};
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
export const useEditReply = (meetupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, replyId }: { text: string; replyId: number }) => editReply(text, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replyList", meetupId] });
    },
  });
};
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
