"use client";

import React from "react"; // useEffect, useState 제거
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { FaInfoCircle, FaUserFriends } from "react-icons/fa";
import { useModal } from "@/hooks/useModal";
import { useAdItem } from "@/hooks/useAdItem"; // ✨ useAdItem 훅 가져오기

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

  // 모달 토글 핸들러 함수들
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

  // 로딩 및 에러 상태 처리
  if (isPending) return <div className="h-11 animate-pulse bg-gray-300">로딩 중...</div>;
  if (error) return <div className="h-11 bg-red-300">{error.message}</div>;
  if (!meetupData) return <div className="h-11 bg-orange-300">모임 데이터를 찾을 수 없습니다</div>;

  return (
    <div className="relative flex h-16 items-center justify-between bg-[#FBFFA9] px-4 text-black lg:mt-9 lg:rounded-[50px]">
      {/* 좌측 멤버 버튼 */}
      <button onClick={handleMembersModalToggle} className="rounded-full p-2 transition-colors hover:bg-white" aria-label="모임 멤버 보기">
        <FaUserFriends size={24} className="text-black" />
      </button>

      {/* 중앙 모임 제목 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 transform text-xl font-bold">{meetupData.name}</h1>

      {/* 우측 정보 버튼 */}
      <button onClick={handleInfoModalToggle} className="rounded-full p-2 transition-colors hover:bg-white" aria-label="모임 정보 보기">
        <FaInfoCircle size={24} />
      </button>
    </div>
  );
};

export default MeetupSignboard;
