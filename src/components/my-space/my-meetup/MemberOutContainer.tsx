"use client";

import React, { useEffect } from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMeetupId, toggleMemberDeleteModal } from "@/stores/modalSlice";
import { MyMeetupItem } from "@/types/mySpaceType";

interface MemberOutContainerProps {
  meetupId: MyMeetupItem["id"];
  isOrganizer: MyMeetupItem["is_organizer"];
  onSelfLeave: (meetupId: number) => void;
  isPending: boolean;
}

const MemberOutContainer: React.FC<MemberOutContainerProps> = ({ meetupId, isOrganizer, onSelfLeave, isPending }) => {
  const dispatch = useDispatch();

  const handleMemberListButtonClick = () => {
    dispatch(setSelectedMeetupId(meetupId));
    dispatch(toggleMemberDeleteModal());
  };

  const handleSelfLeaveClick = () => {
    alert("내발로 내가 퇴장한다");
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

  useEffect(() => {
    console.log("받은 meetupId:", meetupId);
  }, [meetupId]);

  // // 삭제 뮤테이션
  // const deleteMutation = useMutation({
  //   mutationFn: (member_id: number) => deleteMeetupMemberApi(member_id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
  //   },
  // });

  // const handleSelfOutButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   // 모임 퇴장 (isOrganizer = false)
  //   if (!isOrganizer) {
  //     const confirmed = window.confirm("정말 이 모임에서 퇴장하시겠습니까?");
  //     if (confirmed) {
  //       alert("내 발로 내가 퇴장한다");
  //       deleteMutation.mutate(meetupId);
  //     }
  //   }
  // };
  return (
    <>
      <div>
        {isOrganizer ? (
          <button onClick={handleMemberListButtonClick} className="p-2">
            <FaRegUserCircle size={20} />
          </button>
        ) : (
          // <OutButton isOrganizer={isOrganizer} isInMemberDeleteModal={false} onClick={handleSelfLeaveClick} />
          <OutButton text="강퇴" onClick={handleSelfLeaveClick} isPending={isPending} />
        )}
      </div>
    </>
  );
};

export default MemberOutContainer;
