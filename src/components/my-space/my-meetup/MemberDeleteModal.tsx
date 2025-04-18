"use client";
import { toggleMemberDeleteModal } from "@/stores/modalSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { RootState } from "@/stores/store";

const token = Cookies.get("accessToken");

const MemberDeleteModal = () => {
  const dispatch = useDispatch();
  const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isMemberDeleteModalOpen);

  const queryClient = useQueryClient();

  // 배경 누르면 모달 닫히는 그거인듯
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      dispatch(toggleMemberDeleteModal());
    }
  };

  // 삭제 뮤테이션

  // const deleteMutation = useMutation({
  //   mutationFn: deleteMemberApi,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
  //   },
  // });

  // const handleDeleteClick = () => {
  //   const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
  //   if (confirmed) deleteMutation.mutate({ meetupId, memberId });
  // };

  if (!isMemberDeleteModalOpen) return null;
  return (
    <>
      <div className="fixed inset-0 w-50 h-50 bg-black bg-opacity-10 flex items-center justify-center z-50" onClick={handleOverlayClick}>
        <div className="bg-white w-50 p-6 mb-4 items-center">
          <h3 className="text-lg font-medium">멤버 강퇴</h3>

          <button>모달!!!!!!!</button>
        </div>
      </div>
    </>
  );
};

export default MemberDeleteModal;
