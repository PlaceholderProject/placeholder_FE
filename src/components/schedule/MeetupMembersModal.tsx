"use client";

import React from "react";
import { useMeetupMembers } from "@/hooks/useSchedule";
import Image from "next/image";
import { getImageURL } from "@/utils/getImageURL";

interface MeetupMembersModalProps {
  meetupId: number;
  meetupName: string;
  onClose: () => void;
}

const MeetupMembersModal = ({ meetupId, onClose, meetupName }: MeetupMembersModalProps) => {
  // 멤버 데이터 가져오기
  const { data: members, isPending, error } = useMeetupMembers(meetupId);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{meetupName}</h2>

        <div className="max-h-96 overflow-y-auto">
          {isPending ? (
            <div className="text-center py-4">멤버 정보를 불러오는 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              멤버 정보를 불러오는데 실패했습니다: {error.message}
            </div>
          ) : !members || members.length === 0 ? (
            <div className="text-center py-4">모임에 등록된 멤버가 없습니다.</div>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.id} className="flex items-center py-2 border-b">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full mr-3">
                    {member.user.image ? (
                      <Image
                        src={getImageURL(member.user.image)}
                        alt={member.user.nickname}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                        {member.user.nickname.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {member.role === "organizer" && "👑 "}
                      {member.user.nickname}
                    </div>
                    {member.role === "organizer" && (
                      <div className="text-sm text-gray-500">방장</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetupMembersModal;