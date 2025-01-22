import MeetupNames from "@/components/my-space/received-proposal/MeetupNames";
import ReceivedProposals from "@/components/my-space/received-proposal/ReceivedProposals";
import React from "react";

const page = () => {
  return (
    <div>
      받은 신청서
      <MeetupNames />
      <ReceivedProposals />
    </div>
  );
};

export default page;
