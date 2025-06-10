"use client";
import { toggleMemberDeleteModal } from "@/stores/modalSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "@/stores/store";
import MyMeetupMembers from "./MyMeetupMembers";

const token = Cookies.get("accessToken");

interface MemberDeleteModalProps {
  onKickMember: (meetupId: number) => void;
  isPending: boolean;
}

// const MemberDeleteModal: React.FC<{ meetupId: MyMeetupItem["id"] }> = ({ meetupId }) => {
// props 제거
// 아 아래에서 바로 구독?해서 선택된 아이디 값 알 수 있게?

const MemberDeleteModal: React.FC<MemberDeleteModalProps> = ({ onKickMember, isPending }) => {
  const dispatch = useDispatch();
  const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isMemberDeleteModalOpen);
  const selectedMeetupId = useSelector((state: RootState) => state.modal.selectedMeetupId);

  useEffect(() => {
    console.log("멤버모달 열렸니?", isMemberDeleteModalOpen);
    console.log("받은 게 아니라 선택된 meetupId:", selectedMeetupId);
  }, [isMemberDeleteModalOpen, selectedMeetupId]);

  // 배경 누르면 모달 닫히는 그거인듯
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      dispatch(toggleMemberDeleteModal());
    }
  };

  // 모달 내부 클릭시 이벤트 전파 방지
  const handleModalLayerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event?.stopPropagation();
  };

  if (!isMemberDeleteModalOpen || !selectedMeetupId) return null;

  // --TO DO--
  // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링

  return (
    <>
      <div className="w-50 h-50 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5" onClick={handleOverlayClick}>
        <div className="rounded-md bg-white p-6 shadow-sm" onClick={handleModalLayerClick}>
          {/* <MemberDeleteModal meetupId={meetupId} /> */}
          {/* 무한재귀 제거 */}

          {selectedMeetupId && <MyMeetupMembers meetupId={selectedMeetupId} onKickMember={onKickMember} isPending={isPending} />}

          <div className="flex justify-end space-x-2">
            <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={() => dispatch(toggleMemberDeleteModal())}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDeleteModal;
