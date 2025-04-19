"use client";

import React from "react";
import ProposalPostcard from "../modals/ProposalPostcard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { toggleProposalPostcardModal } from "@/stores/modalSlice";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const { isProposalPostcardModalOpen } = useSelector((state: RootState) => state.modal);

  const handleProposalModal = () => {
    dispatch(toggleProposalPostcardModal());
  };

  return (
    <>
      {isProposalPostcardModalOpen && <ProposalPostcard meetupId={meetupId} />}
      <button onClick={handleProposalModal} className="bg-slate-300">
        신청하기
      </button>
    </>
  );
};

export default AdButton;
