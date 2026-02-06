"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { FaInfoCircle, FaUserFriends } from "react-icons/fa";
import { useModal } from "@/hooks/useModal";
import { useAdItem } from "@/hooks/useAdItem";

interface MeetupSignboardProps {
  meetupId: number;
}

const MeetupSignboard = ({ meetupId }: MeetupSignboardProps) => {
  const { openModal } = useModal();
  const userFromRedux = useSelector((state: RootState) => state.user.user);

  const { adData: meetupData, isPending, error } = useAdItem(meetupId);

  const isOrganizer = React.useMemo(() => {
    if (!meetupData || !userFromRedux) return false;
    return meetupData.organizer?.nickname === userFromRedux?.nickname;
  }, [meetupData, userFromRedux]);
  const handleMembersModalToggle = () => {
    if (meetupData) {
      openModal("MEETUP_MEMBERS", {
        meetupId,
        meetupName: meetupData.name,
      });
    }
  };
  const handleInfoModalToggle = () => {
    if (meetupData) {
      openModal("MEETUP_INFO", {
        meetupData,
        isOrganizer,
        meetupId,
      });
    }
  };
  if (isPending) return <div className="h-11 animate-pulse bg-gray-300">로딩 중...</div>;
  if (error) return <div className="h-11 bg-red-300">{error.message}</div>;
  if (!meetupData) return <div className="h-11 bg-orange-300">모임 데이터를 찾을 수 없습니다</div>;

  return (
    <div className="relative flex h-16 items-center justify-between gap-2 bg-[#FBFFA9] px-4 text-black md:mt-9 md:rounded-[50px]">
      { }
      <button onClick={handleMembersModalToggle} className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-white" aria-label="모임 멤버 보기">
        <FaUserFriends size={24} className="text-black" />
      </button>

      { }
      <h1 className="min-w-0 flex-1 truncate text-center text-xl font-bold">{meetupData.name}</h1>

      { }
      <button onClick={handleInfoModalToggle} className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-white" aria-label="모임 정보 보기">
        <FaInfoCircle size={24} />
      </button>
    </div>
  );
};

export default MeetupSignboard;
