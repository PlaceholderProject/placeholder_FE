"use client";

import React from "react";
import NotificationItem from "@/components/notification/NotificationItem";
import { useNotificationList } from "@/hooks/useNotification";
import Loading from "@/components/common/Loading";

const NotificationArea = () => {
  const { data: notifications, isPending, error } = useNotificationList();

  if (isPending) return <Loading />;
  if (error) return <div className="p-8 text-center text-error">Error</div>;

  return (
    <div className="px-4 pb-8 lg:bg-gray-50 lg:px-0 lg:py-12">
      <div className="mx-auto max-w-3xl lg:rounded-lg lg:bg-white lg:shadow-sm">
        <h1 className="p-4 py-6 text-center text-2xl font-bold text-gray-800">알림</h1>

        {notifications && notifications.length > 0 ? (
          <div>
            {notifications.map(notification => (
              <NotificationItem key={notification.id} id={notification.id} message={notification.message} url={notification.url} is_read={notification.is_read} created_at={notification.created_at} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">알림이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default NotificationArea;
