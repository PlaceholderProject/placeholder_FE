"use client";

import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@/types/scheduleType";
import { getSchedules } from "@/services/schedule.service";

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
