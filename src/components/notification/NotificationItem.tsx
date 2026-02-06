"use client";

import { Notification } from "@/types/NotificationType";
import { useRouter } from "next/navigation";
import { formatNotificationDate } from "@/utils/NotificationdateUtils";
import { useNotificationRead } from "@/hooks/useNotification";

const NotificationItem = ({ id, message, url, is_read, created_at }: Notification) => {
  const router = useRouter();

  const { markAsRead } = useNotificationRead(id);
  const formattedDate = created_at ? formatNotificationDate(created_at) : "";

  if (!id) {
    return null;
  }

  const handleNotificationClick = () => {
    if (!is_read) {
      markAsRead();
    }
    if (url) {
      router.push(url);
    }
  };

  return (
    <div className={`flex cursor-pointer items-start gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-100 ${!is_read ? "bg-white" : "bg-gray-50"}`} onClick={handleNotificationClick}>
      {}
      <div className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${!is_read ? "bg-error" : "bg-gray-300"}`}></div>

      {}
      <div className="flex-1">
        <p className="text-base text-gray-800">{message}</p>
      </div>

      {}
      {created_at && <div className="ml-auto whitespace-nowrap pl-3 text-sm text-gray-400">{formattedDate}</div>}
    </div>
  );
};

export default NotificationItem;
