// @/hooks/useNotification.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "@/services/notification.service";
import { Notification } from "@/types/NotificationType";

export const useNotificationList = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: options?.enabled, // 로그인 되었을 때만 true
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
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
    onMutate: async () => {
      if (!id) return;

      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<Notification[]>(["notifications"]);
      queryClient.setQueryData<Notification[]>(["notifications"], currentNotifications =>
        currentNotifications?.map(notification => (notification.id === id ? { ...notification, is_read: true } : notification)),
      );

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["notifications"], context?.previousNotifications);
    },
    onSettled: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
