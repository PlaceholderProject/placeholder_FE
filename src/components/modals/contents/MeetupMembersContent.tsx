"use client";

import React from "react";
import { useMeetupMembers } from "@/hooks/useSchedule";
import Image from "next/image";
import { getImageURL } from "@/utils/getImageURL";
import { useModal } from "@/hooks/useModal";
import { useMemberDelete } from "@/hooks/useMemberDelete";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

interface MeetupMembersContentProps {
  meetupId: number;
  meetupName: string;
}

const MeetupMembersContent = ({ meetupId, meetupName }: MeetupMembersContentProps) => {
  const { closeModal } = useModal();
  const { data: members, isPending, error } = useMeetupMembers(meetupId);

  // 강퇴 기능을 위한 훅과 현재 유저 정보 가져오기
  const deleteMutation = useMemberDelete();
  const currentUser = useSelector((state: RootState) => state.user.user);

  // 현재 유저가 방장인지 확인
  const isCurrentUserOrganizer = members?.find(m => m.user.nickname === currentUser.nickname)?.role === "organizer";

  // 강퇴 버튼 클릭 핸들러
  const handleKickOut = (memberId: number, memberNickname: string) => {
    if (window.confirm(`정말로 '${memberNickname}' 님을 강퇴하시겠습니까?`)) {
      deleteMutation.mutate(memberId);
    }
  };

  return (
    <div className="w-full text-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{meetupName} 멤버</h2>
      </div>

      <div className="max-h-80 overflow-y-auto pr-2">
        {isPending ? (
          <div className="py-4 text-center">멤버 정보를 불러오는 중...</div>
        ) : error ? (
          <div className="py-4 text-center text-error">멤버 정보를 불러오는데 실패했습니다.</div>
        ) : !members || members.length === 0 ? (
          <div className="py-4 text-center">모임에 등록된 멤버가 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex items-center border-b border-gray-100 py-3">
                <div className="flex flex-1 items-center gap-3">
                  {member.role === "organizer" && <span className="text-xl">👑</span>}
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    <Image src={getImageURL(member.user.image)} alt={member.user.nickname} fill className="object-cover" />
                  </div>
                  <span className="font-semibold">{member.user.nickname}</span>
                </div>

                {isCurrentUserOrganizer && member.role !== "organizer" && (
                  <button
                    onClick={() => handleKickOut(member.id, member.user.nickname)}
                    disabled={deleteMutation.isPending}
                    className="rounded-md bg-error px-3 py-1 text-sm font-bold text-white transition hover:bg-opacity-80 disabled:opacity-50"
                  >
                    강퇴
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={closeModal} className="rounded-lg bg-gray-200 px-5 py-2 hover:bg-gray-300">
          닫기
        </button>
      </div>
    </div>
  );
};

export default MeetupMembersContent;
