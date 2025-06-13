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
    if (organizedMeetups && organizedMeetups.length > 0 && !organizedMeetups.some((m: OrganizedMeetup) => m.id === selectedMeetupId)) {
      dispatch(setSelectedMeetupId(organizedMeetups[0].id));
    }
  }, [organizedMeetups, dispatch, selectedMeetupId]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;
  if (!organizedMeetups || organizedMeetups.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <ul className="my-[3rem] flex h-fit w-[90%] flex-wrap items-center gap-2 md:max-w-[80rem]">
        {organizedMeetups.map((meetup: OrganizedMeetup) => (
          <li
            key={meetup.id}
            onClick={() => dispatch(setSelectedMeetupId(meetup.id))}
            className={`w-fit cursor-pointer whitespace-nowrap rounded-full border-[0.1rem] border-primary px-4 py-1 ${selectedMeetupId === meetup.id ? "bg-primary text-white" : ""}`}
          >
            {meetup.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetupNames;
