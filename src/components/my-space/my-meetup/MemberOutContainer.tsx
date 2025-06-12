"use client";

import React, { useEffect } from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MyMeetupItem } from "@/types/mySpaceType";
import { useModal } from "@/hooks/useModal";
import { setChosenMeetupId } from "@/stores/memberOutSlice";

interface MemberOutContainerProps {
  meetupId: MyMeetupItem["id"];
  isOrganizer: MyMeetupItem["is_organizer"];
  onSelfLeave: (meetupId: number) => void;
  isPending: boolean;
}

const MemberOutContainer: React.FC<MemberOutContainerProps> = ({ meetupId, isOrganizer, onSelfLeave, isPending }) => {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const handleMemberListButtonClick = () => {
    dispatch(setChosenMeetupId(meetupId));
    openModal("MEMBER_DELETE");
  };

  const handleSelfLeaveClick = () => {
    // alert("내발로 내가 퇴장한다");
    onSelfLeave(meetupId);
  };

  // const [isOrganizer, setIsOrganizer] = useState(false);
  // 모임 정보에서 isOrganizer 가져오기
  // const { data: myMeetupDetailsData } = useQuery({
  //   queryKey: ["myMeetupDetailsData", meetupId],
  //   queryFn: () => getMyMeetupMembersApi(meetupId),
  //   enabled: !!meetupId,
  // });
  // const isOrganizer = myMeetupDetailsData?.is_organizer || false;

  // const handleMemberListButtonClick = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
  //   // 아이콘 클릭했는데 Link 이동까지 되는 이벤트 버블링 발생,
  //   // 이벤트 버블링과 기본 동작 모두 방지
  //   // event.stopPropagation();
  //   // event.preventDefault();
  //   // 근데 Link 안에서 밖으로 빼니까 전파 안 일어남

  //   console.log("====1. 버튼 클릭 시작====");
  //   console.log("클릭된 meetupId:", meetupId);

  //   //모달 토글
  //   dispatch(setSelectedMeetupId(meetupId));
  //   console.log("==2. setSelectedMeetupId 디스패치 했어==");
  //   dispatch(toggleMemberDeleteModal());
  //   console.log("===3. toggleMemberDeleteModal 디스패치 햇어==");
  //   console.log("===4. 버튼 클릭 우선 끝===");
  //   console.log("멤버모달 열렸니?", isMemberDeleteModalOpen);
  // };
  //모달 토글
  // dispatch(setSelectedMeetupId(meetupId));
  // console.log("==2. setSelectedMeetupId 디스패치 했어==");
  // dispatch(toggleMemberDeleteModal());
  // console.log("===3. toggleMemberDeleteModal 디스패치 햇어==");
  // console.log("===4. 버튼 클릭 우선 끝===");
  // console.log("멤버모달 열렸니?", isMemberDeleteModalOpen);

  // 새로운 모달 시스템의 openModal 함수를 사용하여 모달을 엽니다.
  // 이전 코드의 dispatch 로직을 이 한 줄로 대체합니다.
  // openModal("MEMBER_DELETE", { meetupId });
  return (
    <>
      <div>
        {isOrganizer ? (
          <button onClick={handleMemberListButtonClick} className="p-2">
            <FaRegUserCircle size={20} />
          </button>
        ) : (
          // <OutButton isOrganizer={isOrganizer} isInMemberDeleteModal={false} onClick={handleSelfLeaveClick} />
          <OutButton text="퇴장" onClick={handleSelfLeaveClick} isPending={isPending} />
        )}
      </div>
    </>
  );
};

export default MemberOutContainer;
