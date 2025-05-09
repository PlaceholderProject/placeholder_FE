export interface Notification {
  id: number;
  message: string;
  url: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  result: Notification[];
}