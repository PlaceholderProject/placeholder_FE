"use client";

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
    if (organizedMeetups && organizedMeetups.length > 0 && !selectedMeetupId) {
      dispatch(setSelectedMeetupId(organizedMeetups[0].id));
    }
  }, [organizedMeetups, dispatch, selectedMeetupId]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;
  if (!organizedMeetups || organizedMeetups.length === 0) return null;

  return (
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
  );
};

export default MeetupNames;
