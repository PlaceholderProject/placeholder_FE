import React, { useState } from "react";

import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupsApi } from "@/services/my.space.service";
import { SIZE_LIMIT, BUTTONS_PER_GROUP } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";

const PastMyMeetup = () => {
  const [page, setPage] = useState(1);
  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };

  const {
    data: myMeetupsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetups", "ended"],
    queryFn: () => getMyMeetupsApi("ended", page, SIZE_LIMIT),
  });

  // 이전 이후 그룹 버튼 핸들러

  //이전 버튼 클릭
  const handlePreviousGroupButtonClick = () => {
    // 현재 그룹 찾기
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 이전 그룹의 마지막 페이지는
    const previousGroupLastPage = (currentGroup - 1) * BUTTONS_PER_GROUP;
    setPage(previousGroupLastPage);
  };

  //  이후 버튼 클릭
  const handleNextGroupButtonClick = () => {
    //현재 그룹
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 다음 그룹 첫페이지는
    const nextGroupFirstPage = currentGroup * BUTTONS_PER_GROUP + 1;
    setPage(nextGroupFirstPage);
  };

  const totalPages = Math.ceil((myMeetupsData?.total ?? 0) / SIZE_LIMIT);

  // 현재 페이지가 속한 그룹
  const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);

  // 이전 그룹 있니?
  const hasPreviousGroup = currentGroup > 1;

  //다음 그룸 있니?
  const hasNextGroup = currentGroup * BUTTONS_PER_GROUP < totalPages;

  // 현재 그룹에 표시할 페이지 버튼 범위
  const startPage = (currentGroup - 1) * BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * BUTTONS_PER_GROUP, totalPages);

  if (isPending) return <div>로딩 중...</div>;
  if (isError) return <div> 에러 발생: {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.result.length === 0) return <div>참여했던 모임이 없습니다.</div>;

  return (
    <>
      <div className="grid grid-cols-1">
        {myMeetupsData.result.map(myMeetup => (
          <div key={myMeetup.id} className="flex justify-between">
            <RoleIcon isOrganizer={myMeetup.is_organizer} />
            모임이름: {myMeetup.name}
            모임종료일: {myMeetup.ended_at}
            <MemberOutContainer meetupId={myMeetup.id} isOrganizer={myMeetup.is_organizer} />
          </div>
        ))}
      </div>
      {/* 버튼 영역 */}

      <PaginationButtons
        page={page}
        startPage={startPage}
        endPage={endPage}
        hasPreviousGroup={hasPreviousGroup}
        hasNextGroup={hasNextGroup}
        onPageButtonClick={handlePageButtonClick}
        onPreviousGroupButtonClick={handlePreviousGroupButtonClick}
        onNextGroupButtonClick={handleNextGroupButtonClick}
      />
    </>
  );
};

export default PastMyMeetup;
