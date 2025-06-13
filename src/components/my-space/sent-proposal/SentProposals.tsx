"use client";

import { useSentProposal } from "@/hooks/useProposal";
import React, { useState } from "react";
import SentProposalItem from "./SentProposalItem";
import { SentProposal } from "@/types/proposalType";

const SentProposals = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSentProposal(page);

  console.log(data);

  const sentProposals = data ? data.proposals : [];
  const total = data ? data.total : 0;

  const size = 5;
  const groupSize = 5;
  const totalPages = Math.ceil(total / size);
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  if (isLoading) return <div>로딩중</div>;

  if (!sentProposals || sentProposals.length === 0) {
    return <p className="mt-24 flex justify-center">보낸 신청서가 없습니다.</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <ul className="flex w-[90%] flex-col gap-[1.5rem] py-[3rem] md:max-w-[80rem]">
        {sentProposals.map((proposal: SentProposal) => (
          <li key={proposal.id}>
            <SentProposalItem proposal={proposal} />
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

export default SentProposals;
