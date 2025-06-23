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
    // 읽음 상태에 따라 배경색을 다르게 적용합니다.
    <div className={`flex cursor-pointer items-start gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-100 ${!is_read ? "bg-white" : "bg-gray-50"}`} onClick={handleNotificationClick}>
      {/* 읽음 여부 표시 점 */}
      <div className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${!is_read ? "bg-error" : "bg-gray-300"}`}></div>

      {/* 메시지와 날짜 텍스트 영역 */}
      <div className="flex-1">
        <p className="text-base text-gray-800">{message}</p>
      </div>

      {/* 시간(Timestamp)을 오른쪽으로 이동시켜 가독성 향상 */}
      {created_at && <div className="ml-auto whitespace-nowrap pl-3 text-sm text-gray-400">{formattedDate}</div>}
    </div>
  );
};

export default NotificationItem;
