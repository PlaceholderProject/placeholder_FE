"use client";

import React, { useEffect, useState } from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleMemberDeleteModal } from "@/stores/modalSlice";
import { RootState } from "@/stores/store";
import MemberDeleteModal from "./MemberDeleteModal";
import { MyMeetupItem } from "@/types/mySpaceType";
import { useQuery } from "@tanstack/react-query";

const MemberOutContainer: React.FC<{ meetupId: MyMeetupItem["id"]; isOrganizer: MyMeetupItem["is_organizer"] }> = ({ meetupId, isOrganizer }) => {
  // const [isOrganizer, setIsOrganizer] = useState(false);
  // 모임 정보에서 isOrganizer 가져오기
  // const { data: myMeetupDetailsData } = useQuery({
  //   queryKey: ["myMeetupDetailsData", meetupId],
  //   queryFn: () => getMyMeetupMembersApi(meetupId),
  //   enabled: !!meetupId,
  // });
  // const isOrganizer = myMeetupDetailsData?.is_organizer || false;

  const dispatch = useDispatch();
  const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isMemberDeleteModalOpen);

  // 아이콘 클릭했는데 Link 이동까지 되는 이벤트 버블링 발생,
  // 이벤트 버블링 방지용

  const handleMemberButtonClick = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
    // 이벤트 버블링과 기본 동작 모두 방지
    // event.stopPropagation();
    // event.preventDefault();
    // 근데 Link 안에서 밖으로 빼니까 전파 안 일어남

    //모달 토글
    dispatch(toggleMemberDeleteModal());
    console.log("멤버모달 열렸니?", isMemberDeleteModalOpen);
  };

  const handleOutButtonClick = () => {
    // 모임 퇴장 (isOrganizer = false)
    if (!isOrganizer) {
      const confirmed = window.confirm("정말 이 모임에서 퇴장하시겠습니까?");
      if (confirmed) {
        // -- TODO--
        // 퇴장 API 로직 여기 구현
        alert("내 발로 내가 퇴장한다");
      }
    }
  };
  return (
    <>
      {/* 스탑프로퍼게이션 왜 ㄷ르어감? */}
      {/* <div onClick={e => e.stopPropagation()}> */}
      <div>
        {isOrganizer ? (
          <button onClick={handleMemberButtonClick} className="p-2">
            <FaRegUserCircle size={20} />
          </button>
        ) : (
          <OutButton isOrganizer={isOrganizer} isInMemberDeleteModal={false} onClick={handleOutButtonClick} />
        )}
        <MemberDeleteModal meetupId={meetupId} />
      </div>
    </>
  );
};

export default MemberOutContainer;
