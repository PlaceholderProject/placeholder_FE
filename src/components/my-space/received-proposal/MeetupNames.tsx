"use client";

import { useOrganizedMeetups } from "@/hooks/useProposal";
import { setSelectedMeetupId } from "@/stores/proposalSlice";
import { RootState } from "@/stores/store";
import { OrganizedMeetup } from "@/types/proposalType";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MeetupNames = () => {
  const [page, setPage] = useState(1);

  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);
  const dispatch = useDispatch();

  const { data: organizedMeetups, isLoading, isError, error } = useOrganizedMeetups();

  const total = organizedMeetups?.total ?? 0;

  const size = 5;
  const groupSize = 5;
  const totalPages = Math.ceil(total / size);
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  useEffect(() => {
    if (organizedMeetups && organizedMeetups.length > 0 && !organizedMeetups.some((m: OrganizedMeetup) => m.id === selectedMeetupId)) {
      dispatch(setSelectedMeetupId(organizedMeetups[0].id));
    }
  }, [organizedMeetups, dispatch, selectedMeetupId]);

  // console.log("1", organizedMeetups[0]);
  console.log("2", selectedMeetupId);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;
  if (!organizedMeetups || organizedMeetups.length === 0) return null;

  return (
    <div>
      <ul className="mx-[1.5rem] my-[3rem] flex h-fit flex-wrap items-center gap-2">
        {organizedMeetups.map((meetup: OrganizedMeetup) => (
          <li
            key={meetup.id}
            onClick={() => dispatch(setSelectedMeetupId(meetup.id))}
            className={`border-primary w-fit cursor-pointer whitespace-nowrap rounded-full border-[0.1rem] px-4 py-1 ${selectedMeetupId === meetup.id ? "bg-primary text-white" : ""}`}
          >
            {meetup.name}
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

export default MeetupNames;
