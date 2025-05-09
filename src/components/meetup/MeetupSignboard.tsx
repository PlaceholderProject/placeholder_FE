"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { toggleMeetupInfoModal, toggleMeetupMembersModal } from "@/stores/modalSlice";
import { getMeetupByIdApi } from "@/services/meetup.service";
import { Meetup } from "@/types/meetupType";
import { FaInfoCircle, FaUserFriends } from "react-icons/fa";
import MeetupMembersModal from "@/components/schedule/MeetupMembersModal";
import MeetupInfoModal from "@/components/schedule/MeetupInfoModal";

interface MeetupSignboardProps {
  meetupId: number;
}

const MeetupSignboard = ({ meetupId }: MeetupSignboardProps) => {
  // Redux 상태 및 dispatch 함수 가져오기
  const dispatch = useDispatch();
  const isMeetupInfoModalOpen = useSelector(
    (state: RootState) => state.modal.isMeetupInfoModalOpen,
  );
  const isMeetupMembersModalOpen = useSelector(
    (state: RootState) => state.modal.isMeetupMembersModalOpen,
  );

  const userFromRedux = useSelector((state: RootState) => state.user.user);

  // 모임 데이터를 위한 상태 관리, 임시로 state로 로딩 에러처리
  const [meetupData, setMeetupData] = useState<Meetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);

  // 컴포넌트 마운트 시 모임 데이터 가져오기
  useEffect(() => {
    const fetchMeetupData = async () => {
      try {
        setIsLoading(true);
        const data = await getMeetupByIdApi(meetupId);
        setMeetupData(data);

        setIsOrganizer(data.organizer?.nickname === userFromRedux?.nickname);
      } catch (error) {
        console.error("모임 데이터 로드 실패:", error);
        setError("모임 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetupData();
  }, [meetupId]);

  // 모달 토글 핸들러 함수들
  const handleMembersModalToggle = () => {
    dispatch(toggleMeetupMembersModal());
  };

  const handleInfoModalToggle = () => {
    dispatch(toggleMeetupInfoModal());
  };

  // 로딩 및 에러 상태 처리
  if (isLoading) return <div className="h-11 bg-gray-300 animate-pulse">로딩 중...</div>;
  if (error) return <div className="h-11 bg-red-300">{error}</div>;
  if (!meetupData) return <div className="h-11 bg-orange-300">모임 데이터를 찾을 수 없습니다</div>;

  return (
    <div className="h-16 bg-[#FBFFA9] flex justify-between items-center px-4 relative text-black">
      {/* 좌측 멤버 버튼 */}
      <button
        onClick={handleMembersModalToggle}
        className="p-2 rounded-full hover:bg-white transition-colors"
        aria-label="모임 멤버 보기"
      >
        <FaUserFriends size={24} className="text-black" />
      </button>

      {/* 중앙 모임 제목 */}
      <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
        {meetupData.name}
      </h1>

      {/* 우측 정보 버튼 */}
      <button
        onClick={handleInfoModalToggle}
        className="p-2 rounded-full hover:bg-white transition-colors"
        aria-label="모임 정보 보기"
      >
        <FaInfoCircle size={24} />
      </button>

      {/* 모임 정보 모달 */}
      {isMeetupInfoModalOpen && (
        <MeetupInfoModal
          meetupData={meetupData}
          onClose={handleInfoModalToggle}
          isOrganizer={isOrganizer}
          meetupId={meetupId}
        />
      )}

      {/* 모임 멤버 모달 */}
      {isMeetupMembersModalOpen && (
        <MeetupMembersModal
          meetupName={meetupData.name}
          meetupId={meetupId}
          onClose={handleMembersModalToggle}
        />
      )}
    </div>
  );
};

export default MeetupSignboard;