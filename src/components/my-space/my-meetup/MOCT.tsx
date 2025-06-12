"use client";

import { deleteMeetupMemberApi } from "@/services/my.space.service";
import { setSelectedMeetupId, toggleMemberDeleteModal } from "@/stores/modalSlice";
import { RootState } from "@/stores/store";
import { MyMeetupItem } from "@/types/mySpaceType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import OutButton from "./OutButton";

const MOCT: React.FC<{ meetupId: MyMeetupItem["id"]; isOrganizer: MyMeetupItem["is_organizer"] }> = (meetupId, isOrganizer) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isMemberDeleteModalOpen);

  const handleMemberButtonClick = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
    dispatch(setSelectedMeetupId(meetupId));
    dispatch(toggleMemberDeleteModal());
  };

  useEffect(() => {
    console.log("받은 meetupId:", meetupId);
  }, [meetupId]);

  // 삭제 뮤테

  const deleteMutation = useMutation({
    mutationFn: (member_id: number) => deleteMeetupMemberApi(member_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
    },
  });

  const handleOutButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isOrganizer) {
      const confirm = window.confirm("정말 이 모임에서 퇴장하시겠습니까?");
      if (confirm) {
        alert("내 발로 내가 퇴장");
        deleteMutation.mutate(meetupId);
      }
    }
  };
  return (
    <>
      <div>
        {isOrganizer ? (
          <button onClick={handleMemberButtonClick}>
            <FaRegUserCircle size={20} />
          </button>
        ) : (
          <OutButton isOrganizer={isOrganizer} isInMemberDeleteModal={false} />
        )}
      </div>
      ;
    </>
  );
};

export default MOCT;
