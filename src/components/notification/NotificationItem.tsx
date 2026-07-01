"use client";

import { Notification } from "@/types/NotificationType";
import { useRouter } from "next/navigation";
import { formatNotificationDate } from "@/utils/NotificationdateUtils";
import { useNotificationRead } from "@/hooks/useNotification";
import { getNotificationMeta, getNotificationTitle } from "@/utils/notificationUtils";

const NotificationItem = (notification: Notification) => {
  const { id, url, is_read, created_at } = notification;
  const router = useRouter();

  const { markAsRead } = useNotificationRead(id);
  const formattedDate = created_at ? formatNotificationDate(created_at) : "";
  const { icon: Icon, label, iconClassName, pillClassName } = getNotificationMeta(notification);
  const title = getNotificationTitle(notification);

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
    <button
      type="button"
      className={`hover:border-primary/30 relative flex w-full cursor-pointer items-start gap-[1.2rem] rounded-[1.4rem] border px-[1.6rem] py-[1.5rem] text-left transition hover:-translate-y-[0.1rem] md:px-[1.8rem] md:py-[1.7rem] ${
        is_read ? "border-border bg-card shadow-none" : "border-[#d8c5ff] bg-[#f7f2ff]"
      }`}
      onClick={handleNotificationClick}
    >
      <span className={`grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-full ${iconClassName}`}>
        <Icon className="h-[2rem] w-[2rem] stroke-[2]" />
      </span>

      <div className="min-w-0 flex-1 pt-[0.1rem]">
        <div className="flex flex-wrap items-center gap-[0.7rem]">
          <span className={`rounded-full px-[0.8rem] py-[0.25rem] text-[1rem] leading-[1.4rem] font-bold ${pillClassName}`}>{label}</span>
          {formattedDate && <span className="text-muted-foreground text-xs font-semibold">{formattedDate}</span>}
        </div>
        <p className="text-foreground mt-[0.6rem] text-sm leading-snug font-bold break-keep">{title}</p>
      </div>

      {!is_read && <span className="bg-primary mt-[1rem] h-[0.8rem] w-[0.8rem] shrink-0 rounded-full" />}
    </button>
  );
};

export default NotificationItem;
