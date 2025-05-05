"use client";

import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import ProposalPostcard from "../modals/ProposalPostcard";
import { toggleProposalPostcardModal } from "@/stores/modalSlice";
import { useMyProposalStatus } from "@/hooks/useProposal";
import { useAdItem } from "@/hooks/useAdItem";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const { isProposalPostcardModalOpen } = useSelector((state: RootState) => state.modal);
  const user = useSelector((state: RootState) => state.user.user);

  const { data: proposal, isLoading } = useMyProposalStatus(meetupId);
  const { adData } = useAdItem(meetupId);

  if (isLoading) return <p>로딩 중...</p>;

  console.log(proposal);

  const handleProposalModal = () => {
    dispatch(toggleProposalPostcardModal());
  };

  return (
    <div className="flex flex-col gap-2">
      {user.nickname === adData?.organizer.nickname ? (
        <button>입장하기</button>
      ) : proposal ? (
        proposal.status === "pending" ? (
          <div>
            <button>취소하기</button>
            <div>수락 대기 중</div>
          </div>
        ) : proposal.status === "acceptance" ? (
          <div>
            <div>수락 완료</div>
            <button>입장하기</button>
          </div>
        ) : (
          <div>
            <div>거절됨</div>
            <div>입장하기</div>
          </div>
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
