"use client";

import React from "react";
import NotificationItem from "@/components/notification/NotificationItem";
import { useNotificationList } from "@/hooks/useNotification";
import Spinner from "../common/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/services/notification.service";
import { LuCheckCheck } from "react-icons/lu";
import { getNotificationTimeGroup } from "@/utils/notificationUtils";

const NotificationArea = () => {
  const { data: notifications, isPending, error } = useNotificationList();
  const queryClient = useQueryClient();
  const unreadCount = notifications?.filter(notification => !notification.is_read).length ?? 0;
  const todayNotifications = notifications?.filter(notification => getNotificationTimeGroup(notification) === "today") ?? [];
  const weekNotifications = notifications?.filter(notification => getNotificationTimeGroup(notification) === "week") ?? [];
  const olderNotifications = notifications?.filter(notification => getNotificationTimeGroup(notification) === "older") ?? [];

  const readAllMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications?.filter(notification => !notification.is_read && notification.id) ?? [];
      await Promise.all(unreadNotifications.map(notification => markNotificationAsRead(notification.id!)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (isPending) {
    // return <Loading />;
    return <Spinner isLoading={isPending} />;
  }
  if (error) return <div className="text-error p-8 text-center">Error</div>;

  const renderSection = (title: string, items: typeof todayNotifications) => {
    if (items.length === 0) return null;

    return (
      <section className="space-y-[0.9rem]">
        <h2 className="text-muted-foreground px-[0.2rem] text-xs font-bold">{title}</h2>
        <div className="space-y-[0.9rem]">
          {items.map(notification => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="mx-auto w-[95%] max-w-[68rem] space-y-[2.2rem] py-[2.4rem] md:py-[3.2rem]">
      <div className="flex items-center justify-between gap-[1.2rem]">
        <div>
          <h1 className="text-foreground text-2xl font-bold">알림</h1>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">읽지 않은 알림 {unreadCount}개</p>
        </div>
        <button
          type="button"
          onClick={() => readAllMutation.mutate()}
          disabled={unreadCount === 0 || readAllMutation.isPending}
          className="border-border bg-card text-muted-foreground hover:text-foreground inline-flex h-[3.6rem] shrink-0 items-center gap-[0.6rem] rounded-full border px-[1.3rem] text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45"
        >
          <LuCheckCheck className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
          모두 읽음
        </button>
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-[2.2rem]">
          {renderSection("오늘", todayNotifications)}
          {renderSection("이번 주", weekNotifications)}
          {renderSection("이전 알림", olderNotifications)}
        </div>
      ) : (
        <div className="border-border bg-card flex min-h-[18rem] items-center justify-center rounded-[2rem] border text-center">
          <p className="text-muted-foreground text-sm">알림이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default NotificationArea;
