import MeetupNames from "@/components/my-space/received-proposal/MeetupNames";
import ReceivedProposals from "@/components/my-space/received-proposal/ReceivedProposals";
import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const ReceivedProposalPage = () => {
  return (
    <div>
      <MeetupNames />
      <ReceivedProposals />
    </div>
  );
};

export default ReceivedProposalPage;
