import React from "react";

// 이거 isOrganizer냐에 따라서 강퇴, 퇴장으로 빨간 버튼 재사용하게 분리?
// 재사용이 되긴 하는데 isOrganizer를 떠나서 그냥 순수 UI 컴포넌트로 갖다 쓰기만 하기로!!!

interface OutButtonProps {
  text: string;
  onClick: () => void;
  isPending?: boolean;
}

const OutButton: React.FC<OutButtonProps> = ({ text, onClick, isPending = false }) => {
  // // 삭제 뮤테이션
  // const deleteMutation = useMutation({
  //   mutationFn: (member_id: number) => deleteMeetupMemberApi(member_id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
  //   },
  // });
  // // const handleDeleteClick = (member_id: number) => {
  // //1. onClick 이벤트 핸들러 에러
  // // 현재 OutButton 컴포넌트에서 버튼의 onClick에 handleDeleteClick 함수를 직접 할당하고 있는데,
  // // 이 함수는 member_id라는 매개변수를 받도록 정의되어 있습니다.
  // // 하지만 React의 onClick 이벤트 핸들러는 기본적으로 이벤트 객체(MouseEvent)를 매개변수로 받아야 합니다.

  // const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   // 위 오류를 해결하기 위해 클로저를 활용, 이벤트 객체와 memberId 모두를 활용
  //   // 왜냐면 클로저를 통헤ㅐ 그 자기 외부 환경의 변수들을 참조할 수 있으므로

  //   event.preventDefault();

  //   if (onClick) {
  //     onClick(event);
  //   } else if (memberId && isInMemberDeleteModal) {
  //     alert("멤버 강퇴 눌림");
  //     const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
  //     if (confirmed) deleteMutation.mutate(memberId);
  //   }
  // };

  return (
    <div>
      <button onClick={onClick} disabled={isPending} className="rounded-md bg-red-500 px-2 py-1 text-white">
        {isPending ? "처리중..." : text}
      </button>
    </div>
  );
};

export default OutButton;
