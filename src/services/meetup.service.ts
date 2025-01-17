import { Schedule } from "@/types/scheduleType";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

interface ScheduleResponse {
  result: Schedule[];
}

export const getSchedules = async (meetupId: number): Promise<Schedule[]> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/schedule`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch schedules");
  const data: ScheduleResponse = await response.json();
  return data.result; // result 배열만 반환
};

export const getSchedule = async (scheduleId: number): Promise<Schedule> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/schedule/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch schedule");
  return response.json();
};

export const createSchedule = async (meetupId: number, scheduleData: Omit<Schedule, "id">): Promise<Schedule> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/schedule`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) throw new Error("Failed to create schedule");
  return response.json();
};
