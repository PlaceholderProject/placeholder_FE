import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/services/notification.service";


export const useNotification = (id: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { markAsRead: mutate };
};