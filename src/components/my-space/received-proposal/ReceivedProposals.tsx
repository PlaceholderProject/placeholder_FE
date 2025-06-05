"use client";

import { useProposalsByMeetupId } from "@/hooks/useProposal";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import ReceivedProposalItem from "./ReceivedProposalItem";
import { ReceivedProposal } from "@/types/proposalType";
import { useEffect, useState } from "react";

const ReceivedProposals = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useProposalsByMeetupId(selectedMeetupId!, page);

  useEffect(() => {
    setPage(1);
  }, [selectedMeetupId]);

  const receivedProposals = data?.proposals ?? [];
  const total = data?.total ?? 0;

  const size = 2;
  const groupSize = 2;
  const totalPages = Math.ceil(total / size);
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;

  // const receivedProposals = data?.filter((proposal: ReceivedProposal) => proposal.status === "pending");

  if (!receivedProposals || receivedProposals.length === 0) {
    return <p className="mt-24 flex justify-center">받은 신청서가 없습니다.</p>;
  }

  return (
    <div>
      <ul className="flex flex-col gap-[1.5rem] px-[2rem]">
        {receivedProposals.map((proposal: ReceivedProposal) => (
          <li key={proposal.id}>
            <ReceivedProposalItem proposal={proposal} />
          </li>
        ))}
      </ul>
      {/* ✅ 페이지네이션 UI */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {/* 이전 그룹 버튼 */}
        {startPage > 1 && (
          <button onClick={() => setPage(startPage - 1)} className="rounded border bg-gray-200 px-2 py-1">
            이전
          </button>
        )}
        {/* 페이지 번호 버튼들 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
          <button key={p} onClick={() => setPage(p)} className={`rounded border px-3 py-1 text-sm font-medium ${page === p ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            {p}
          </button>
        ))}
        {/* 다음 그룹 버튼 */}
        {endPage < totalPages && (
          <button onClick={() => setPage(endPage + 1)} className="rounded border bg-gray-200 px-2 py-1">
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default ReceivedProposals;
