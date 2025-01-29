import { useQuery } from "@tanstack/react-query";
import { getAdByIdApi } from "@/services/ad.service";
import { Meetup } from "@/types/meetupType";

export const useAdItem = (meetupId: number) => {
  const {
    data: adData,
    error,
    isPending,
  } = useQuery<Meetup, Error>({
    queryKey: ["ad", meetupId],
    queryFn: () => getAdByIdApi(meetupId),
  });

  return {
    adData,
    error,
    isPending,
  };
};
