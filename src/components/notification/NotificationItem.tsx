"use client";

import { useNotificationRead } from "@/hooks/useNotification";
import { Notification } from "@/types/NotificationType";
import { formatNotificationDate } from "@/utils/NotificationdateUtils";
import { getNotificationMeta, getNotificationTitle } from "@/utils/notificationUtils";
import { useRouter } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";

const NotificationItem = (notification: Notification) => {
  const { id, url, is_read, created_at } = notification;
  const router = useRouter();
  const { markAsRead } = useNotificationRead(id);
  const formattedDate = created_at ? formatNotificationDate(created_at) : "";
  const { icon: Icon, label, iconClassName, pillClassName } = getNotificationMeta(notification);
  const title = getNotificationTitle(notification);

  if (!id) return null;

  const handleNotificationClick = () => {
    if (!is_read) markAsRead();
    if (url) router.push(url);
  };

  return (
    <button
      type="button"
      className={`group relative flex w-full cursor-pointer items-center gap-[1.1rem] px-[1.4rem] py-[1.35rem] text-left transition-colors md:px-[1.8rem] md:py-[1.55rem] ${
        is_read ? "bg-card hover:bg-muted/45" : "bg-destructive/[0.035] hover:bg-destructive/[0.06]"
      }`}
      onClick={handleNotificationClick}
      aria-label={`${is_read ? "읽은" : "읽지 않은"} 알림: ${title}`}
    >
      <span className={`grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-[1.35rem] ${iconClassName}`}>
        <Icon className="h-[2rem] w-[2rem] stroke-[2]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-[0.65rem]">
          <span className={`rounded-full px-[0.75rem] py-[0.2rem] text-[1rem] leading-[1.4rem] font-bold ${pillClassName}`}>{label}</span>
          {formattedDate && <span className="text-muted-foreground text-xs font-medium">{formattedDate}</span>}
        </span>
        <span className={`text-foreground mt-[0.55rem] block text-sm leading-snug break-keep ${is_read ? "font-medium" : "font-bold"}`}>{title}</span>
      </span>

      <span className="flex shrink-0 items-center gap-[0.8rem]">
        {!is_read && <span className="bg-destructive ring-card h-[0.8rem] w-[0.8rem] rounded-full ring-[0.25rem]" aria-hidden="true" />}
        {url && <LuChevronRight className="text-muted-foreground group-hover:text-foreground h-[1.7rem] w-[1.7rem] transition-colors" aria-hidden="true" />}
      </span>
    </button>
  );
};

export default NotificationItem;
