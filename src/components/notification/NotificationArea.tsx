"use client";

import NotificationItem from "@/components/notification/NotificationItem";
import { useNotificationList } from "@/hooks/useNotification";
import { markNotificationAsRead } from "@/services/notification.service";
import { Notification } from "@/types/NotificationType";
import { getNotificationTimeGroup } from "@/utils/notificationUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuBell, LuBellOff, LuCheckCheck, LuRefreshCw } from "react-icons/lu";
import { toast } from "sonner";

const NotificationArea = () => {
  const { data: notifications, isPending, error, refetch } = useNotificationList();
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<Notification[]>(["notifications"]);

      queryClient.setQueryData<Notification[]>(["notifications"], currentNotifications => currentNotifications?.map(notification => ({ ...notification, is_read: true })));

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["notifications"], context?.previousNotifications);
      toast.error("알림을 읽음 처리하지 못했어요.");
    },
    onSuccess: () => {
      toast.success("모든 알림을 확인했어요.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const renderSection = (title: string, items: Notification[], sectionId: string) => {
    if (items.length === 0) return null;

    return (
      <section aria-labelledby={sectionId}>
        <div className="mb-[0.9rem] px-[0.2rem]">
          <h2 id={sectionId} className="text-foreground text-sm font-black">
            {title}
          </h2>
        </div>
        <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-[2rem] border shadow-[0_1.8rem_4rem_-3.4rem_rgba(24,23,29,0.28)]">
          {items.map(notification => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="mx-auto w-[calc(100%-3.2rem)] max-w-[72rem] space-y-[2.8rem] py-[2.8rem] pb-[11rem] md:py-[4rem] md:pb-[5rem]">
      <header className="flex items-end justify-between gap-[1.6rem]">
        <div>
          <p className="text-primary mb-[0.45rem] text-xs font-black tracking-[0.08em]">내 소식</p>
          <h1 className="text-foreground text-[2.6rem] leading-tight font-black tracking-[-0.035em] md:text-[3.2rem]">알림</h1>
          <p className="text-muted-foreground mt-[0.7rem] text-sm">
            {unreadCount > 0 ? (
              <>
                아직 확인하지 않은 알림이 <strong className="text-foreground font-black tabular-nums">{unreadCount}</strong>개 있어요.
              </>
            ) : (
              "새로 확인할 알림이 없어요."
            )}
          </p>
        </div>

        {unreadCount > 0 && !isPending && (
          <button
            type="button"
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
            className="text-primary hover:bg-primary-soft inline-flex h-[3.8rem] shrink-0 items-center gap-[0.55rem] rounded-full px-[1.1rem] text-sm font-bold transition-colors disabled:cursor-wait disabled:opacity-55"
          >
            <LuCheckCheck className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
            모두 읽음
          </button>
        )}
      </header>

      {isPending ? (
        <div className="space-y-[2.2rem]" aria-label="알림을 불러오는 중">
          {[2, 3].map((itemCount, sectionIndex) => (
            <section key={sectionIndex}>
              <div className="bg-muted mb-[0.9rem] h-[1.3rem] w-[5rem] animate-pulse rounded-full" />
              <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-[2rem] border">
                {Array.from({ length: itemCount }).map((_, index) => (
                  <div key={index} className="flex items-center gap-[1.2rem] px-[1.5rem] py-[1.4rem] md:px-[1.8rem]">
                    <div className="bg-muted h-[4.4rem] w-[4.4rem] shrink-0 animate-pulse rounded-[1.3rem]" />
                    <div className="flex-1 space-y-[0.7rem]">
                      <div className="bg-muted h-[1rem] w-[7rem] animate-pulse rounded-full" />
                      <div className="bg-muted h-[1.3rem] w-[75%] animate-pulse rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : error ? (
        <div className="border-border bg-card flex min-h-[22rem] flex-col items-center justify-center rounded-[2rem] border border-dashed px-[2rem] text-center">
          <span className="bg-destructive/10 text-destructive mb-[1rem] grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full">
            <LuBell className="h-[2rem] w-[2rem] stroke-[1.9]" />
          </span>
          <h2 className="text-foreground text-base font-black">알림을 불러오지 못했어요</h2>
          <p className="text-muted-foreground mt-[0.45rem] text-sm">잠시 후 다시 시도해주세요.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="border-border text-foreground hover:bg-muted mt-[1.4rem] inline-flex h-[3.8rem] items-center gap-[0.5rem] rounded-full border px-[1.3rem] text-sm font-bold transition-colors"
          >
            <LuRefreshCw className="h-[1.5rem] w-[1.5rem]" />
            다시 시도
          </button>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-[2.6rem]">
          {renderSection("오늘", todayNotifications, "notifications-today")}
          {renderSection("이번 주", weekNotifications, "notifications-week")}
          {renderSection("이전 알림", olderNotifications, "notifications-older")}
        </div>
      ) : (
        <div className="border-border bg-card flex min-h-[24rem] flex-col items-center justify-center rounded-[2rem] border border-dashed px-[2rem] text-center">
          <span className="bg-muted text-muted-foreground mb-[1rem] grid h-[4.8rem] w-[4.8rem] place-items-center rounded-full">
            <LuBellOff className="h-[2.1rem] w-[2.1rem] stroke-[1.8]" />
          </span>
          <h2 className="text-foreground text-base font-black">아직 도착한 알림이 없어요</h2>
          <p className="text-muted-foreground mt-[0.45rem] text-sm">새로운 활동이 생기면 이곳에서 알려드릴게요.</p>
        </div>
      )}
    </main>
  );
};

export default NotificationArea;
