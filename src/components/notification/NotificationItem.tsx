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
    <div className={`flex cursor-pointer items-start border-b p-4 ${!is_read ? "bg-gray-50" : "bg-white"}`} onClick={handleNotificationClick}>
      <div className="flex-1">
        <div className="flex items-center">
          {!is_read && <div className="mr-2 h-2 w-2 rounded-full bg-[#F9617A]"></div>}
          <p className={`${!is_read ? "font-semibold" : "text-gray-700"}`}>{message}</p>
        </div>
        {created_at && <p className="mt-1 text-sm text-gray-400">{formattedDate}</p>}
      </div>
    </div>
  );
};

export default NotificationItem;
