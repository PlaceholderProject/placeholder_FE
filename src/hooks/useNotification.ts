import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "@/services/notification.service";

export const useNotificationList = () => {

  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

export const useNotificationRead = (id: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { markAsRead: mutate };
};