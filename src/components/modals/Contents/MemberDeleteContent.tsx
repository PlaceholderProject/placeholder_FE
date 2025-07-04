"use client";

import React from "react";
import MyMeetupMembers from "@/components/my-space/my-meetup/MyMeetupMembers";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
// import { clearChosenMeetupId } from "@/stores/memberOutSlice";

// const MemberDeleteModal: React.FC<{ meetupId: MyMeetupItem["id"] }> = ({ meetupId }) => {
// props 제거
// 아 아래에서 바로 구독?해서 선택된 아이디 값 알 수 있게?

const MemberDeleteContent: React.FC = () => {
  // const dispatch = useDispatch();
  // const { closeModal } = useModal();
  const chosenMeetupId = useSelector((state: RootState) => state.memberOut.chosenMeetupId);

  const modalData = useSelector((state: RootState) => state.modal.modalData);
  const meetupName = modalData?.meetupName || "모임 멤버";
  // const handleClose = () => {
  //   dispatch(clearChosenMeetupId());
  //   closeModal();
  // };

  if (!chosenMeetupId) {
    return <p>모임을 선택해주세요.</p>;
  }
  // --TO DO--
  // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mx-auto mb-[1.5rem] mt-[2rem] w-[22rem] truncate text-center text-lg font-bold">{meetupName}</h2>

      {/* <MemberDeleteModal meetupId={meetupId} /> */}
      {/* 무한재귀 제거 */}
      <MyMeetupMembers meetupId={chosenMeetupId} />
    </div>
  );
};

export default MemberDeleteContent;
