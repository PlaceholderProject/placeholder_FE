import React from "react";
import NotificationArea from "@/components/notification/NotificationArea";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const NotificationPage = () => {
  return <NotificationArea />;
};

export default NotificationPage;
