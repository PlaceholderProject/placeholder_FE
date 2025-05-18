import { acceptProposal, cancelProposal, getMyProposalStatus, getOrganizedMeetups, getReceivedProposals, getSentProposal, hideProposal, refuseProposal } from "@/services/proposal.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 신청서 수락
export const useAcceptProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: number) => acceptProposal(proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedProposals"] });
    },
  });
};
// 신청서 거절
export const useRefuseProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: number) => refuseProposal(proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedProposals"] });
    },
  });
};

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
    queryKey: ["receivedProposals", meetupId],
    queryFn: () => getReceivedProposals(meetupId!),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!meetupId,
    select: data => data ?? [],
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
export const useSentProposal = (page: number) => {
  return useQuery({
    queryKey: ["sentProposals", page],
    queryFn: () => getSentProposal(page),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    select: data => data ?? [],
  });
};

// 신청서 취소
export const useCancelProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: number) => cancelProposal(proposalId),
    onSuccess: () => {
      alert("신청서가 성공적으로 취소되었습니다.");
      // 필요하면 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["myMeetups", "organizer", "ongoing"] });
      queryClient.invalidateQueries({ queryKey: ["sentProposals"] });
    },
    onError: error => {
      alert(error.message || "신청서 취소 중 오류가 발생했습니다.");
    },
  });
};

// 신청서 숨김
export const useHideProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: number) => hideProposal(proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentProposals"] });
    },
  });
};
