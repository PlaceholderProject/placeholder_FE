"use client";

import { deleteMeetupMemberApi, getMyMeetupMembersApi } from "@/services/my.space.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
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
  const [imageSource, setImageSource] = useState("/profile.png");

  useEffect(() => {
    if (myMeetupMembersData && myMeetupMembersData.user.image) {
      const profileImageUrl = myMeetupMembersData.user?.image.startsWith("http") ? myMeetupMembersData.user.image : `${BASE_URL}${myMeetupMembersData.user?.image}`;
      const imgElement = document.createElement("img");
      imgElement.onload = () => {
        setImageSource(profileImageUrl);
      };
      imgElement.onerror = () => {
        setImageSource("/profile.png");
      };
      imgElement.src = profileImageUrl; // 이 부분이 누락되어 있었음
    }
    // --TO DO--
    // 클린업 함수 및 let imgElement상단 선언 필요
    // return () => {
    //   if (imgElement) {
    //     imgElement.onload = null;
    //     imgElement.onerror = null;
    //     imgElement.src = "";
    //     imgElement = null;
    //   }
    // };

    // --TO DO--
    // 이미지 경로 validate 함수 따로 만들어서 빼기!!!!
  }, []);
  //myMeetupmembersData를 넣으려고 했더니 선언 전에 쓰려고 했대..
  // use 커스텀훅으로 빼야한다 AdOrganizer 처럼..

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
          <Image src={imageSource} alt="내 모임 회원 이미지" width={50} height={50} className="size-8 rounded-full" />
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
