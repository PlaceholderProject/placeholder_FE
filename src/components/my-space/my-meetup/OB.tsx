"use client";

import { deleteMeetupMemberApi } from "@/services/my.space.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

// isOrganizer냐에 따라 강퇴, 퇴장으로 나눠서 재사용
interface OutButtonProps {
  isOrganizer?: boolean;
  isInMemberDeleteModal?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  memberId?: number;
}

const OB: React.FC<OutButtonProps> = ({ isOrganizer = false, isInMemberDeleteModal = false, onClick, memberId }) => {
  const queryClient = useQueryClient();
  const buttonText = isInMemberDeleteModal ? "강퇴" : "퇴장";

  // 삭제 뮤테

  const deleteMutation = useMutation({
    mutationFn: (member_id: number) => deleteMeetupMemberApi(member_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
    },
  });

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (onClick) {
      onClick(event);
    } else if (memberId && isInMemberDeleteModal) {
      alert("멤버 강퇴 눌림");
      const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
      if (confirmed) deleteMutation.mutate(memberId);
    }
  };
  return (
    <div>
      <button onClick={handleDeleteClick}> {buttonText}</button>
    </div>
  );
};

export default OB;
