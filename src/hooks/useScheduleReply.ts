import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newReplyProps } from "@/types/replyType";
import {
  createScheduleNestedReply,
  createScheduleReply,
  deleteScheduleReply,
  getScheduleReply,
  updateScheduleReply,
} from "@/services/scheduleReply.service";

export const useScheduleReply = (scheduleId: number) => {
  return useQuery({
    queryKey: ["scheduleComments", scheduleId],
    queryFn: () => getScheduleReply(scheduleId),
    enabled: !!scheduleId,
  });
};

export const useCreateScheduleReply = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: newReplyProps) => createScheduleReply(data, scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleComments", scheduleId] });
    },
  });
};

export const useCreateScheduleNestedReply = (replyId: number, scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: newReplyProps) => createScheduleNestedReply(data, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleComments", scheduleId] });
    },
  });
};

export const useUpdateScheduleReply = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, commentId }: { text: string; commentId: number }) =>
      updateScheduleReply(text, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleComments", scheduleId] });
    },
  });
};

export const useDeleteScheduleReply = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteScheduleReply(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleComments", scheduleId] });
    },
  });
};