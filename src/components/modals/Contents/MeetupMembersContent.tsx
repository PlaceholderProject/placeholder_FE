"use client";

import React from "react";
import { useMeetupMembers } from "@/hooks/useSchedule";
import Image from "next/image";
import { getImageURL } from "@/utils/getImageURL";
import { useModal } from "@/hooks/useModal";

interface MeetupMembersContentProps {
  meetupId: number;
  meetupName: string;
}

const MeetupMembersContent = ({ meetupId, meetupName }: MeetupMembersContentProps) => {
  const { closeModal } = useModal();
  // 멤버 데이터 가져오기
  const { data: members, isPending, error } = useMeetupMembers(meetupId);

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold">{meetupName}</h2>

      <div className="max-h-96 overflow-y-auto">
        {isPending ? (
          <div className="py-4 text-center">멤버 정보를 불러오는 중...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">멤버 정보를 불러오는데 실패했습니다: {error.message}</div>
        ) : !members || members.length === 0 ? (
          <div className="py-4 text-center">모임에 등록된 멤버가 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex items-center border-b py-2">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  {member.user.image ? (
                    <Image src={getImageURL(member.user.image)} alt={member.user.nickname} width={40} height={40} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-gray-500">{member.user.nickname.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {member.role === "organizer" && "👑 "}
                    {member.user.nickname}
                  </div>
                  {member.role === "organizer" && <div className="text-sm text-gray-500">방장</div>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={closeModal} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
          닫기
        </button>
      </div>
    </div>
  );
};

export default MeetupMembersContent;
