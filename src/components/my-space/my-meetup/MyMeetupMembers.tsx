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

const MyMeetupMembers: React.FC<{ meetupId?: number }> = ({ meetupId }) => {
  const [imageSource, setImageSource] = useState("/profile.png");

  const {
    data: myMeetupMembersData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetupMembers", meetupId],
    queryFn: () => {
      if (!meetupId) {
        throw new Error("meetupId가 필요하다고");
      }
      return getMyMeetupMembersApi(meetupId);
    },
    enabled: !!meetupId,
  });

  useEffect(() => {
    if (myMeetupMembersData?.result?.[0]?.user?.image) {
      const userImage = myMeetupMembersData.result[0].user.image;
      const profileImageUrl = userImage.startsWith("http") ? userImage : `${BASE_URL}${userImage}`;
      setImageSource(profileImageUrl);
      // const imgElement = document.createElement("img");
      // imgElement.onload = () => {
      //   setImageSource(profileImageUrl);
      // };
      // imgElement.onerror = () => {
      //   setImageSource("/profile.png");
      // };
      // imgElement.src = profileImageUrl; // 이 부분이 누락되어 있었음
      // // 클린업함수
      // return () => {
      //   if (imgElement) {
      //     imgElement.onload = null;
      //     imgElement.onerror = null;
      //   }
      // };
    }
  }, [myMeetupMembersData]);
  console.log(`프로필이미지url:, ${imageSource}`);

  //myMeetupmembersData를 넣으려고 했더니 선언 전에 쓰려고 했대..
  // use 커스텀훅으로 빼야한다 AdOrganizer 처럼..

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

  if (!meetupId) return <div>모임 아이디 필요핣니다.</div>;
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupMembersData || !myMeetupMembersData.result || myMeetupMembersData.result.length === 0) return <div>멤버가 없습니다.</div>;

  return (
    <>
      {myMeetupMembersData.result.map((myMeetupMember: MyMeetupMember) => {
        // const profileImageUrl = myMeetupMember.user?.image?.startsWith("http") ? myMeetupMember.user.image : `${BASE_URL}${myMeetupMember.user?.image}`;

        return (
          <div key={myMeetupMember.id}>
            {myMeetupMember.role == "organizer" && <span>👑</span>}이 아이디는 뭐야? : {myMeetupMember.id}
            <Image src={imageSource} alt="내 모임 회원 이미지" width={50} height={50} className="size-8 rounded-full" />
            모임아이디 : {myMeetupMember.meetupId}
            <br />
            모임에서 역할 : {myMeetupMember.role}
            <br />
            유저아이디 : {myMeetupMember.user?.id}
            <br />
            유저닉넴 : {myMeetupMember.user?.nickname}
            <br />
            {myMeetupMember.role !== "organizer" && <OutButton isInMemberDeleteModal={true} memberId={myMeetupMember.id} />}
          </div>
        );
      })}
    </>
  );
};

export default MyMeetupMembers;
