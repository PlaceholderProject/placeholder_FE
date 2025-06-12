// @/hooks/useNotification.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "@/services/notification.service";

export const useNotificationList = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

export const useNotificationRead = (id: number | null) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => {
      if (!id) {
        return Promise.resolve();
      }
      return markNotificationAsRead(id);
    },
    onSuccess: () => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
  });

  return {
    markAsRead: () => {
      if (id) {
        mutate();
      }
    },
  };
};
