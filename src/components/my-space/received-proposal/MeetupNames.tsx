"use client";

import Spinner from "@/components/common/Spinner";
import { useOrganizedMeetups } from "@/hooks/useProposal";
import { setSelectedMeetupId } from "@/stores/proposalSlice";
import { RootState } from "@/stores/store";
import { OrganizedMeetup } from "@/types/proposalType";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MeetupNames = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);
  const dispatch = useDispatch();

  const { data: organizedMeetups, isLoading, isError, error } = useOrganizedMeetups();

  useEffect(() => {
    if (organizedMeetups && organizedMeetups.length > 0 && !organizedMeetups.some((m: OrganizedMeetup) => m.id === selectedMeetupId)) {
      dispatch(setSelectedMeetupId(organizedMeetups[0].id));
    }
  }, [organizedMeetups, dispatch, selectedMeetupId]);

  //  if (isLoading) return <p>로딩 중...</p>;
  if (isLoading) return <Spinner isLoading={isLoading} />; // 텍스트 대신 스피너
  if (isError) return <p>에러 발생: {error.message}</p>;
  if (!organizedMeetups || organizedMeetups.length === 0) return null;

  return (
    <div>
      <ul className="mb-[1.4rem] flex h-fit flex-wrap items-center gap-[0.7rem]">
        {organizedMeetups.map((meetup: OrganizedMeetup) => (
          <li
            key={meetup.id}
            onClick={() => dispatch(setSelectedMeetupId(meetup.id))}
            className={`border-border w-fit cursor-pointer rounded-full border px-[1.2rem] py-[0.65rem] text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedMeetupId === meetup.id ? "bg-primary text-primary-foreground border-transparent" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {meetup.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetupNames;
