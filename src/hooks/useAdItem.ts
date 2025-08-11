import { useQuery } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { getMeetupByIdApi } from "@/services/meetup.service";

export const useAdItem = (id: number, initialData?: Meetup) => {
  const {
    data: adData,
    error,
    isPending,
  } = useQuery<Meetup, Error>({
    queryKey: ["ad", id],
    queryFn: () => getMeetupByIdApi(id),
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  return {
    adData,
    error,
    isPending,
  };
};
