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

  // 모달 내부 클릭시 이벤트 전파 방지

  const handleModalLayerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event?.stopPropagation();
  };

  // 삭제 뮤테이션

  // const deleteMutation = useMutation({
  //   mutationFn: deleteMemberApi,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
  //   },
  // });

  // const handleDeleteClick = (a) => {
  //   const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
  //   if (confirmed) deleteMutation.mutate({ meetupId, memberId });
  // };

  if (!isMemberDeleteModalOpen) return null;

  // --TO DO--
  // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링

  return (
    <>
      <div className="fixed inset-0 w-50 h-50 bg-black bg-opacity-5 flex items-center justify-center z-50" onClick={handleOverlayClick}>
        <div onClick={handleOverlayClick}>
          <div className="bg-white p-6 rounded-md shadow-sm" onClick={handleModalLayerClick}>
            <h3>강ㅌ퇴냐 탈퇴냐</h3>
            <p>이 멤버 진짜 쫓아내?</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => dispatch(toggleMemberDeleteModal())}>
                취소
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">강퇴하기</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDeleteModal;
