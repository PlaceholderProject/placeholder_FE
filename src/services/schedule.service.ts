import { Schedule } from "@/types/scheduleType";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

interface ScheduleResponse {
  result: Schedule[];
}

//스케줄 리스트 가져오기
export const getSchedules = async (meetupId: number): Promise<Schedule[]> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/schedule`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("스케줄 패치 실패");
  const data: ScheduleResponse = await response.json();
  return data.result;
};

// 단일 스케줄 가져오기
export const getSchedule = async (scheduleId: number): Promise<Schedule> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/schedule/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("스케줄 조회 실패");
  return response.json();
};

//스케줄 생성
export const createSchedule = async (meetupId: number, formData: FormData): Promise<Schedule> => {
  const token = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/schedule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("서버 에러 응답:", errorData);
      throw new Error(errorData.message || "스케줄 생성 실패");
    }

    return response.json();
  } catch (error) {
    console.error("스케줄 생성 실패:", error);
    throw error;
  }
};
