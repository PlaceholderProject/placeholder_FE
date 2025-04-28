import { useQuery } from "@tanstack/react-query";
import { getMyProposalStatus, getOrganizedMeetups, getReceivedProposals, getSentProposal } from "@/services/proposal.service";

// 내가 방장인 모임 목록 가져오기
export const useOrganizedMeetups = () => {
  return useQuery({
    queryKey: ["myMeetups", "organizer"],
    queryFn: getOrganizedMeetups,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: 1,
  });
};

// 모임Id로 검색한 내가 방장인 신청서 목록 가져오기
export const useProposalsByMeetupId = (meetupId: number) => {
  return useQuery({
    queryKey: ["proposal", meetupId],
    queryFn: () => getReceivedProposals(meetupId!),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!meetupId,
  });
};

// 신청서의 상태 가져오기
export const useMyProposalStatus = (meetupId: number) => {
  return useQuery({
    queryKey: ["status", meetupId],
    queryFn: () => getMyProposalStatus(meetupId!),
    enabled: !!meetupId,
  });
};

// 내가 보낸 신청서들 가져오기
export const useSentProposal = () => {
  return useQuery({
    queryKey: ["sentProposals"],
    queryFn: getSentProposal,
  });
};
