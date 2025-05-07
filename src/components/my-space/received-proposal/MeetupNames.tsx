"use client";

import { useOrganizedMeetups } from "@/hooks/useProposal";
import { setSelectedMeetupId } from "@/stores/proposalSlice";
import { RootState } from "@/stores/store";
import { OrganizedMeetup } from "@/types/proposalType";
import { useDispatch, useSelector } from "react-redux";

const MeetupNames = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);

  const dispatch = useDispatch();

  const { data: organizedMeetups, isLoading, isError, error } = useOrganizedMeetups();

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;
  if (!organizedMeetups || organizedMeetups.length === 0) return null;

  return (
    <ul className="flex flex-row gap-2 mx-4 mt-6 mb-4">
      {organizedMeetups.map((meetup: OrganizedMeetup) => (
        <li
          key={meetup.id}
          onClick={() => dispatch(setSelectedMeetupId(meetup.id))}
          className={`w-fit px-4 py-1 border-[2px] rounded-full border-[#006B8B] cursor-pointer text-[13px] ${selectedMeetupId === meetup.id ? "bg-[#006B8B] text-white" : ""}`}
        >
          {meetup.name}
        </li>
      ))}
    </ul>
  );
};

export default MeetupNames;
