import SentProposals from "@/components/my-space/sent-proposal/SentProposals";
import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const SentProposalPage = () => {
  return (
    <div>
      <SentProposals />
    </div>
  );
};

export default SentProposalPage;
