import React from "react";

interface MeetupSignBoardProps {
  meetupId: number;
}

const MeetupSignboard = ({ meetupId }: MeetupSignBoardProps) => {
  return <div className="h-11 bg-orange-300">MeetupSignboard</div>;
};

export default MeetupSignboard;
