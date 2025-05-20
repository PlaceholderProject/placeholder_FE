export interface Notification {
  id: number | null;
  message: string | null;
  url: string | null;
  is_read: boolean;
  created_at?: string;
}

export interface NotificationResponse {
  result: Notification[];
}
