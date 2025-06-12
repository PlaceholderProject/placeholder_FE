import { useQuery } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { getMeetupByIdApi } from "@/services/meetup.service";

export const useAdItem = (meetupId: number) => {
  const {
    data: adData,
    error,
    isPending,
  } = useQuery<Meetup, Error>({
    queryKey: ["ad", meetupId],
    queryFn: () => getMeetupByIdApi(meetupId),
  });

  return {
    adData,
    error,
    isPending,
  };
};
