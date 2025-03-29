import React from "react";
import MemberOutContainer from "./MemberOutContainer";
import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import { getEndedMyMeetupsApi } from "@/services/my.space.service";

const PastMyMeetup = () => {
  const {
    data: myMeetupsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetups", "ended"],
    queryFn: getEndedMyMeetupsApi,
  });

  if (isPending) return <div>로딩 중...</div>;
  if (isError) return <div> 에러 발생: {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.length === 0) return <div>참여했던 모임이 없습니다.</div>;

  return (
    <>
      <div className="grid grid-cols-1">
        {myMeetupsData.map(myMeetup => (
          <div key={myMeetup.id} className="flex justify-between">
            <MemberOutContainer /> 방장이니?: {`${myMeetup.is_organizer}`} 모임이름: {myMeetup.name}
            <RoleIcon />
          </div>
        ))}
      </div>
    </>
  );
};

export default PastMyMeetup;
