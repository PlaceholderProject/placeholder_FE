import Cookies from "js-cookie";
import { BASE_URL } from "@/constants/baseURL";
import { Notification, NotificationResponse } from "@/types/NotificationType";

// 알림 목록 가져오기
export const getNotifications = async (): Promise<Notification[]> => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/notification`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("알림 목록을 가져오는데 실패했습니다");
  }

  const data: NotificationResponse = await response.json();
  return data.result;
};


// 알림 읽음 여부
export const markNotificationAsRead = async (notificationId: number) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(`${BASE_URL}/api/v1/notification/${notificationId}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("알림 읽음 처리 실패");
  }
};