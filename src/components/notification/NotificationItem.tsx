"use client";

import { Notification } from "@/types/NotificationType";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import { formatNotificationDate } from "@/utils/NotificationdateUtils";

const NotificationItem = ({ id, message, url, is_read, created_at }: Notification) => {
  const router = useRouter();
  const { markAsRead } = useNotification(id);

  const formattedDate = created_at ? formatNotificationDate(created_at) : "";

  const handleNotificationClick = () => {
    if (!is_read) {
      markAsRead();
    }
    router.push(url);
  };

  return (
    <div
      className={`p-4 border-b flex items-start cursor-pointer ${!is_read ? "bg-gray-50" : "bg-white"}`}
      onClick={handleNotificationClick}
    >
      <div className="flex-1">
        <div className="flex items-center">
          {!is_read && (
            <div className="w-2 h-2 bg-[#F9617A] rounded-full mr-2"></div>
          )}
          <p className={`${!is_read ? "font-semibold" : "text-gray-700"}`}>{message}</p>
        </div>
        {created_at && (
          <p className="text-gray-400 text-sm mt-1">{formattedDate}</p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;