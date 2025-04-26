"use client";

import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import ProposalPostcard from "../modals/ProposalPostcard";
import { toggleProposalPostcardModal } from "@/stores/modalSlice";
import { useMyProposalStatus } from "@/hooks/useProposal";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const { isProposalPostcardModalOpen } = useSelector((state: RootState) => state.modal);
  const user = useSelector((state: RootState) => state.user.user);

  const { data: proposal, isLoading, isError, error } = useMyProposalStatus(meetupId);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생: {error?.message}</p>;

  console.log(proposal);

  const handleProposalModal = () => {
    dispatch(toggleProposalPostcardModal());
  };

  return (
    <div className="flex flex-col gap-2">
      {proposal ? (
        proposal.user.nickname === user.nickname ? (
          <button>입장하기</button>
        ) : proposal.status === "pending" ? (
          <div>
            <button>취소하기</button>
            <div>수락 대기 중</div>
          </div>
        ) : (
          <div>아니</div>
        )
      ) : (
        <div>
          <button onClick={handleProposalModal} className="bg-slate-300">
            신청하기
          </button>
          <button>입장하기</button>
          {isProposalPostcardModalOpen && <ProposalPostcard meetupId={meetupId} />}
        </div>
      )}
    </div>
  );
};

export default AdButton;
