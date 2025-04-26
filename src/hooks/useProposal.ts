import { useQuery } from "@tanstack/react-query";
import { getMyProposalStatus, getOrganizedMeetups, getReceivedProposals } from "@/services/proposal.service";

// 내가 방장인 모임 목록
export const useOrganizedMeetups = () => {
  return useQuery({
    queryKey: ["myMeetups", "organizer", "ongoing"],
    queryFn: getOrganizedMeetups,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: 1,
  });
};

// 모임Id로 검색한 신청서들
export const useProposalsByMeetupId = (meetupId: number) => {
  return useQuery({
    queryKey: ["proposal", meetupId],
    queryFn: () => getReceivedProposals(meetupId!),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!meetupId,
  });
};

// 신청서의 상태
export const useMyProposalStatus = (meetupId: number) => {
  return useQuery({
    queryKey: ["proposal", meetupId],
    queryFn: () => getMyProposalStatus(meetupId!),
    enabled: !!meetupId,
  });
};
