"use client";

import { deleteMeetupMemberApi, getMyMeetupMembersApi } from "@/services/my.space.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { MyMeetupItem } from "@/types/mySpaceType";
import { BASE_URL } from "@/constants/baseURL";
import OutButton from "./OutButton";
import { MeetupMemberProps } from "@/types/myMeetupMemberType";
import { MyMeetupMember } from "@/types/myMeetupMemberType";
import { MyMeetupUser } from "@/types/myMeetupMemberType";
import Image from "next/image";

// const MyMeetupMembers = (meetupId: number) => {

const MyMeetupMembers: React.FC<{ meetupId: MyMeetupItem["id"] }> = ({ meetupId }) => {
  const queryClient = useQueryClient();

  const {
    data: myMeetupMembersData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetupMembers", meetupId],
    queryFn: () => getMyMeetupMembersApi(meetupId),
  });

  // // 삭제 뮤테이션
  // const deleteMutation = useMutation({
  //   mutationFn: (member_id: number) => deleteMeetupMemberApi(member_id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
  //   },
  // });

  // const handleDeleteClick = (member_id: number) => {
  //   alert("멤버 강퇴 눌림");
  //   const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
  //   if (confirmed) deleteMutation.mutate(member_id);
  // };

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupMembersData || !myMeetupMembersData.result || myMeetupMembersData.result.length === 0) return <div>멤버가 없습니다.</div>;

  return (
    <>
      {myMeetupMembersData.result.map((myMeetupMember: MyMeetupMember) => (
        <div key={myMeetupMember.id}>
          {myMeetupMember.id}
          <Image src={`${BASE_URL}${myMeetupMember.user?.image}`} alt="내 모임 회원 이미지" width={50} height={50} className="size-8 rounded-full" />
          {myMeetupMember.user?.nickname}
          {myMeetupMember.role} {myMeetupMember.user?.id}
          {/* <OutButton onClick={() => handleDeleteClick(myMeetupMember.id)} /> */}
          <OutButton isInMemberDeleteModal={true} memberId={myMeetupMember.id} />
          {/* 이거 함수를 인터페이스 지정하고 프롭스로 전달할 게 아니라 OutButton에서 강퇴일 경우 버튼에 붙일까? */}
        </div>
      ))}
    </>
  );
};

export default MyMeetupMembers;
