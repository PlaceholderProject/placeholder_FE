import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "@/services/notification.service";

export const useNotificationList = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: options?.enabled,
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
