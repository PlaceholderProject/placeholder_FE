"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { getMeetupByIdApi } from "@/services/meetup.service";
import { Meetup } from "@/types/meetupType";
import { FaInfoCircle, FaUserFriends } from "react-icons/fa";
import { useModal } from "@/hooks/useModal";

interface MeetupSignboardProps {
  meetupId: number;
}

const MeetupSignboard = ({ meetupId }: MeetupSignboardProps) => {
  const { openModal } = useModal();

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
  if (isLoading) return <div className="h-11 animate-pulse bg-gray-300">로딩 중...</div>;
  if (error) return <div className="h-11 bg-red-300">{error}</div>;
  if (!meetupData) return <div className="h-11 bg-orange-300">모임 데이터를 찾을 수 없습니다</div>;

  return (
    <div className="relative flex h-16 items-center justify-between bg-[#FBFFA9] px-4 text-black">
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
