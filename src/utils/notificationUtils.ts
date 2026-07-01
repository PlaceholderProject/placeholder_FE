import { Notification } from "@/types/NotificationType";
import { IconType } from "react-icons";
import { LuCalendar, LuCheck, LuHeart, LuMessageCircle, LuUserPlus, LuX } from "react-icons/lu";

type NotificationKind = "proposal_accepted" | "proposal_rejected" | "new_proposal" | "comment" | "schedule" | "like";

type NotificationMeta = {
  icon: IconType;
  label: string;
  iconClassName: string;
  pillClassName: string;
};

const NOTIFICATION_META: Record<NotificationKind, NotificationMeta> = {
  new_proposal: {
    icon: LuUserPlus,
    label: "신규 신청",
    iconClassName: "bg-[#ede5ff] text-primary",
    pillClassName: "bg-[#efe7ff] text-primary",
  },
  proposal_accepted: {
    icon: LuCheck,
    label: "수락됨",
    iconClassName: "bg-[#dff5f2] text-[#13b8a6]",
    pillClassName: "bg-[#e4f7f3] text-[#10a99a]",
  },
  comment: {
    icon: LuMessageCircle,
    label: "댓글",
    iconClassName: "bg-[#edf4ff] text-[#4386ff]",
    pillClassName: "bg-[#e9f1ff] text-[#4386ff]",
  },
  schedule: {
    icon: LuCalendar,
    label: "일정",
    iconClassName: "bg-[#fff1d8] text-[#f3a21b]",
    pillClassName: "bg-[#fff3dc] text-[#f09b14]",
  },
  like: {
    icon: LuHeart,
    label: "좋아요",
    iconClassName: "bg-[#ffe8ed] text-[#ff4058]",
    pillClassName: "bg-[#ffe7ec] text-[#f13f57]",
  },
  proposal_rejected: {
    icon: LuX,
    label: "거절됨",
    iconClassName: "bg-[#ffe8ee] text-[#ef4b67]",
    pillClassName: "bg-[#ffe7ed] text-[#e94a63]",
  },
};

const getNotificationKindFromMessage = (message: string): NotificationKind => {
  if (message.includes("수락")) return "proposal_accepted";
  if (message.includes("거절") || message.includes("함께하지 못")) return "proposal_rejected";
  if (message.includes("댓글")) return "comment";
  if (message.includes("일정") || message.includes("스케줄")) return "schedule";
  if (message.includes("좋아요")) return "like";
  if (message.includes("신청")) return "new_proposal";
  return "new_proposal";
};

export const getNotificationKind = (notification: Notification): NotificationKind => {
  return getNotificationKindFromMessage(notification.message ?? "");
};

export const getNotificationMeta = (notification: Notification) => {
  return NOTIFICATION_META[getNotificationKind(notification)];
};

export const getNotificationTitle = (notification: Notification) => {
  return notification.message ?? "새 알림이 도착했어요.";
};

export const getNotificationTimeGroup = (notification: Notification) => {
  if (!notification.created_at) return "older";

  const elapsed = Date.now() - new Date(notification.created_at).getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  if (elapsed < oneDay) return "today";
  if (elapsed < oneDay * 7) return "week";
  return "older";
};
