"use client";

import { useSchedules } from "@/hooks/useSchedule";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ScheduleItem from "@/components/schedule/ScheduleItem";


const ScheduleArea = ({ meetupId }: { meetupId: number }) => {

  const router = useRouter();
  const { data: schedules, isPending, error } = useSchedules(meetupId);

  const handleCreateClick = useCallback(() => {
    router.push(`/meetup/${meetupId}/schedule/create`);
  }, [router, meetupId]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const hasSchedules = schedules && schedules.length > 0;

  return (
    <div className="flex flex-col p-4">
      {!hasSchedules ? (
        <div className="flex flex-col items-center gap-4">
          <p>버튼을 눌러 스케줄을 등록해보세요</p>
          <button onClick={handleCreateClick}>+</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schedules.map((schedule, index) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              number={index + 1}
            />
          ))}
          <button onClick={handleCreateClick} className="self-end">
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleArea;

// Area에서 버튼 컴포넌트 구현하기
// 버튼을 눌렀을 때 ScheduleItem이 생성, ScheduleItem이 버튼 컴포넌트 상단에 생성
// 아이템 리스트는 날짜가 최신순으로 최상단 1번부터 시작,
// 숫자는 ScheduleNumber 컴포넌트
// three dots 메뉴 (각 아이템에 수정 삭제 드롭다운) 는 어떻게 구현할지 생각하기 (새로운 컴포넌트? 아니면 Item 컴포넌트에 생성?)

// 여기까지 구현을 했을 때 create 페이지 폼, 컴포넌트 구현, 우편 API 구현
// erd place 값은 모임 장소 인풋 값이, 날짜 입력은 date 객체로 하면 될 듯
// 참석자는 해당 모임에 있는 명단이, 체크한 인원들이 해당 스케줄에 참여하는 인원들
// 메모 부분은 개행과 스케줄 아이템 부분에서 어떻게 보여줄지 생각해야함

// 이게 다 이루어졌을 때 카카오 지도 연동
// 스케줄의 개수에 따라 다르겠지만, 모든 스케줄의 마커들을 표시한다고 가정했을 때 리소스를 많이 잡아먹을 것 같다는 생각이 듦
// 클러스터 이용하기? 스케줄이 다섯개 이상일 때? 근데 직관적이지 않을 것 같다는 생각이 든다.
// 일단 클러스터 구현은 하는 식으로 하고 몇개 이상일 때 표시할지는 생각해보기

// 여기까지 구현했을 때 버튼 컴포넌트 따로 빼야할 듯?
