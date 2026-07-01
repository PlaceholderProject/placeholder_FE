"use client";

import React from "react";
import MyMeetupMembers from "@/components/my-space/my-meetup/MyMeetupMembers";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { LuUsersRound } from "react-icons/lu";
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
    return (
      <div className="py-[3rem] text-center">
        <p className="text-foreground text-base font-semibold">모임을 선택해주세요.</p>
        <p className="text-muted-foreground mt-[0.5rem] text-sm">멤버 목록을 불러오려면 모임 정보가 필요해요.</p>
      </div>
    );
  }
  // --TO DO--
  // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링

  return (
    <div className="space-y-[1.6rem] pr-[0.2rem]">
      <div className="flex items-start gap-[1rem] pr-[3.2rem]">
        <span className="bg-primary-soft text-primary grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-[1.3rem]">
          <LuUsersRound className="h-[2rem] w-[2rem] stroke-[1.9]" />
        </span>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-semibold">모임 멤버 관리</p>
          <h2 className="text-foreground mt-[0.2rem] truncate text-lg font-bold">{meetupName}</h2>
          <p className="text-muted-foreground mt-[0.4rem] text-sm leading-relaxed">참여 중인 멤버를 확인하고 필요한 경우 내보낼 수 있어요.</p>
        </div>
      </div>

      {/* <MemberDeleteModal meetupId={meetupId} /> */}
      {/* 무한재귀 제거 */}
      <MyMeetupMembers meetupId={chosenMeetupId} />
    </div>
  );
};

export default MemberDeleteContent;
