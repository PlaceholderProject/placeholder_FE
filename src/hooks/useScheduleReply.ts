import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newReplyProps } from "@/types/replyType";
import { createScheduleNestedReply, createScheduleReply, deleteScheduleReply, getScheduleReply, updateScheduleReply } from "@/services/scheduleReply.service";

export const useScheduleReply = (scheduleId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["scheduleReply", scheduleId],
    queryFn: () => getScheduleReply(scheduleId),
    enabled: options?.enabled,
  });
};

export const useCreateScheduleReply = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: newReplyProps) => createScheduleReply(data, scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleReply", scheduleId] });
      queryClient.invalidateQueries({ queryKey: ["schedule", scheduleId] });
    },
  });
};

export const useCreateScheduleNestedReply = (replyId: number, scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: newReplyProps) => createScheduleNestedReply(data, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleReply", scheduleId] });
      queryClient.invalidateQueries({ queryKey: ["schedule", scheduleId] });
    },
  });
};

export const useUpdateScheduleReply = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, replyId }: { text: string; replyId: number }) => updateScheduleReply(text, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleReply", scheduleId] });
    },
  });
};

export const useDeleteScheduleReply = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: number) => deleteScheduleReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleReply", scheduleId] });
      queryClient.invalidateQueries({ queryKey: ["schedule", scheduleId] });
    },
  });
};
