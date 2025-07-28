import { useQuery } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { getMeetupByIdApi } from "@/services/meetup.service";

export const useAdItem = (id: number) => {
  const {
    data: adData,
    error,
    isPending,
  } = useQuery<Meetup, Error>({
    queryKey: ["ad", id],
    queryFn: () => getMeetupByIdApi(id),
  });

  return {
    adData,
    error,
    isPending,
  };
};
