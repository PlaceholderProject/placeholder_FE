"use client";

import { useQuery } from "@tanstack/react-query";
import { getSchedules } from "@/services/schedule.service";
import { Schedule } from "@/types/scheduleType";

export const useSchedules = (meetupId: number) => {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedules", meetupId],
    queryFn: () => getSchedules(meetupId),
    enabled: !!meetupId,
    select: data => {
      if (!data) return [];
      return [...data].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    },
  });
};
