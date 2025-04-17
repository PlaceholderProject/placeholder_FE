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
  const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isAdDeleteModalOpen);
  const queryClient = useQueryClient();

  // 토글 상태 변화 감지

  React.useEffect(() => {
    console.log("멤버 강퇴 모달 상태 업뎃됨: ", isMemberDeleteModalOpen);
  }, [isMemberDeleteModalOpen]);

  // 이거 AdDeleteModal에서 복붙해서 이름만 수정한건데
  // 고쳐서 재사용 가능할듯?
  const handleCloseButtonClick = () => {
    dispatch(toggleMemberDeleteModal());
    console.log(isMemberDeleteModalOpen);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseButtonClick();
    }
  };

  // 멤버 삭제 함수
  // --TO DO--
  // 이거 나중에 my.meetup.service.ts로 빼야됨
  const deleteMemberApi = async () => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}/${memberId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.log("멤버 강퇴 실패");
      throw new Error("멤버 강퇴에 실패했습니다.");
    }
  };

  // 삭제 뮤테이션

  const deleteMutation = useMutation({
    mutationFn: deleteMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
    },
  });

  const handleDeleteClick = () => {
    const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
    if (confirmed) deleteMutation.mutate({ meetupId, memberId });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
        <div className="bg-white rounded-lg p-6">
          <div className="w-50 h-50 bt-white rounded-lg p-6">
            '삭제하기' 버튼을 클릭하면 멤버가 영구적으로 강퇴됩니다.
            <button type="button" onClick={handleCloseButtonClick}>
              닫기
            </button>
            <button onClick={handleDeleteClick} type="button" disabled={deleteMutation.isPending} className="m-2 w-50 h-10 bg-red-400">
              {deleteMutation.isPending ? "삭제 중.." : "⚠️삭제하기⚠️"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDeleteModal;
