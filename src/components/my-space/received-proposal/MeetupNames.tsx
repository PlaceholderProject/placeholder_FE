"use client";

import { useOrganizedMeetups } from "@/hooks/useProposal";
import { setSelectedMeetupId } from "@/stores/proposalSlice";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";

const MeetupNames = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeeupId);

  const dispatch = useDispatch();

  const { data: organizedMeetups, isLoading, isError, error } = useOrganizedMeetups();

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error.message}</p>;

  return (
    <ul className="flex flex-row gap-2">
      {organizedMeetups.map((meetup: any) => (
        <li
          key={meetup.id}
          onClick={() => dispatch(setSelectedMeetupId(meetup.id))}
          className={`w-fit px-4 py-1 border-[1px] rounded-full border-[#006B8B] cursor-pointer ${selectedMeetupId === meetup.id ? "bg-[#006B8B] text-white" : ""}`}
        >
          {meetup.name}
        </li>
      ))}
    </ul>
  );
};

export default MeetupNames;
