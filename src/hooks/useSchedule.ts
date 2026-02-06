
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSchedule, deleteSchedule, getSchedule, getSchedules, updateSchedule } from "@/services/schedule.service";
import { Member, Schedule, SchedulePayload } from "@/types/scheduleType";
import { getMeetupMembers } from "@/services/member.service";
export const useSchedules = (meetupId: number) => {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedules", meetupId],
    queryFn: () => getSchedules(Number(meetupId)),
  });
};
export const useMeetupMembers = (meetupId: number) => {
  return useQuery<Member[], Error>({
    queryKey: ["members", meetupId],
    queryFn: () => getMeetupMembers(Number(meetupId)),
  });
};
export const useCreateSchedule = (meetupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SchedulePayload) => createSchedule(meetupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", meetupId] });
    },
  });
};
export const useScheduleDetail = (scheduleId: number | undefined, options?: { enabled?: boolean }) => {
  return useQuery<Schedule, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: () => getSchedule(scheduleId as number),
    enabled: options?.enabled !== undefined ? options.enabled : !!scheduleId,
  });
};
export const useUpdateSchedule = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, payload }: { scheduleId: number; payload: SchedulePayload }) => updateSchedule(scheduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", scheduleId] });
      queryClient.invalidateQueries({ queryKey: ["schedule", scheduleId] });
    },
  });
};
export const useDeleteSchedule = (meetupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) => deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", meetupId] });
    },
  });
};
