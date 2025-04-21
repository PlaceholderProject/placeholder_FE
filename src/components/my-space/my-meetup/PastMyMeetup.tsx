import React, { useState } from "react";

import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupsApi } from "@/services/my.space.service";

const SIZE_LIMIT = 10;
const PastMyMeetup = () => {
  const [page, setPage] = useState(1);
  const {
    data: myMeetupsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetups", "ended"],
    queryFn: () => getMyMeetupsApi("ended", page, SIZE_LIMIT),
  });

  if (isPending) return <div>로딩 중...</div>;
  if (isError) return <div> 에러 발생: {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.length === 0) return <div>참여했던 모임이 없습니다.</div>;

  return (
    <>
      <div className="grid grid-cols-1">
        {myMeetupsData.map(
          myMeetup => (
            console.log(typeof myMeetup.is_organizer),
            (
              <div key={myMeetup.id} className="flex justify-between">
                <RoleIcon isOrganizer={myMeetup.is_organizer} />
                모임이름: {myMeetup.name}
                <MemberOutContainer />
              </div>
            )
          ),
        )}
      </div>
    </>
  );
};

export default PastMyMeetup;
