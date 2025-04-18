import { useQuery } from "@tanstack/react-query";
import { getSchedule, getSchedules } from "@/services/schedule.service";
import { Member, Schedule } from "@/types/scheduleType";
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

export const useScheduleDetail = (scheduleId: number) => {
  return useQuery<Schedule, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: () => getSchedule(Number(scheduleId)),
    enabled: !!scheduleId,
  });
};