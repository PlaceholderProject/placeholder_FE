"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import NotificationItem from "@/components/notification/NotificationItem";
import { useNotificationList } from "@/hooks/useNotification";
import { setHasUnreadNotifications } from "@/stores/notificationSlice";

const NotificationArea = () => {
  const dispatch = useDispatch();

  const { data: notifications, isPending, error } = useNotificationList();

  useEffect(() => {
    if (notifications) {
      const hasUnread = notifications.some(notification => !notification.is_read);
      dispatch(setHasUnreadNotifications(hasUnread));
    }
  }, [notifications, dispatch]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="p-4 text-xl font-bold">알림</h1>

      {notifications && notifications.length > 0 ? (
        <div className="divide-y">
          {notifications.map(notification => (
            <NotificationItem key={notification.id} id={notification.id} message={notification.message} url={notification.url} is_read={notification.is_read} created_at={notification.created_at} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">알림이 없습니다</div>
      )}
    </div>
  );
};

export default NotificationArea;
