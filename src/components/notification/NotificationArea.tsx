"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notification.service";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "@/stores/authSlice";
import NotificationItem from "@/components/notification/NotificationItem";

const NotificationArea = () => {
  const dispatch = useDispatch();

  const { data: notifications, isPending, Error } = useQuery({
    queryKey: ["notifications"], queryFn: getNotifications,
  });

  useEffect(() => {
    if (notifications) {
      const hasUnread = notifications.some(notification => !notification.is_read);
      dispatch(setIsAuthenticated(hasUnread));
    }
  }, [notifications, dispatch]);

  if (isPending) return <div>Loading...</div>;
  if (Error) return <div>Error</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold p-4">알림</h1>

      {notifications && notifications.length > 0 ? (
        <div className="divide-y">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              message={notification.message}
              url={notification.url}
              is_read={notification.is_read}
              created_at={notification.created_at}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          알림이 없습니다
        </div>
      )}
    </div>
  );
};

export default NotificationArea;