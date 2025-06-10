"use client";

import { getMyMeetupMembersApi } from "@/services/my.space.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import OutButton from "./OutButton";
import { MyMeetupMember } from "@/types/myMeetupMemberType";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

interface MyMeetupMembersProps {
  meetupId: number;
  onKickMember: (memberId: number) => void;
  isPending: boolean;
}
const MyMeetupMembers: React.FC<MyMeetupMembersProps> = ({ meetupId, onKickMember, isPending }) => {
  // 개별 유저 이미 관리 스테이트
  const [userImages, setUserImages] = useState<{ [userId: number]: string }>({});
  const selectedMeetupId = useSelector((state: RootState) => state.modal.selectedMeetupId);

  const {
    data: myMeetupMembersData,
    isPending: isDataPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetupMembers", meetupId],
    queryFn: () => {
      if (!selectedMeetupId) {
        throw new Error("meetupId가 필요하다고");
      }
      return getMyMeetupMembersApi(meetupId);
    },
    enabled: !!meetupId,
  });

  useEffect(() => {
    if (myMeetupMembersData?.result) {
      // 개별 멤버 이미지 처리
      const imageMap: { [userId: number]: string } = {};

      myMeetupMembersData.result.forEach((member: MyMeetupMember) => {
        if (member.user?.id) {
          if (member.user.image) {
            const userImage = member.user.image;
            const profileImageUrl = userImage.startsWith("http") ? userImage : `${BASE_URL}${userImage}`;
            imageMap[member.user.id] = profileImageUrl;
          } else {
            imageMap[member.user.id] = "/profile.png";
          }
        }
      });
      setUserImages(imageMap);
    }
  }, [myMeetupMembersData]);
  console.log(`프로필이미지url:, ${userImages}`);

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
      {myMeetupMembersData.result.map((member: MyMeetupMember) => {
        const userImageSource = userImages[member.user?.id || 0] || "/profile.png";
        return (
          <div key={member.id}>
            {member.role == "organizer" && <span>👑</span>}mebmer.id래요 언제 생성되심? : {member.id}
            <Image src={userImageSource} alt="내 모임 회원 프로필 이미지" width={32} height={32} className="rounded-full" />
            모임아이디 : {member.meetupId}
            <br />
            모임에서 역할 : {member.role}
            <br />
            이게 유저아이디 member.user.id 이게 맞는거같은데: {member.user?.id}
            <br />
            유저닉넴 : {member.user?.nickname}
            <br />
            {member.role !== "organizer" && <OutButton text="강퇴" onClick={() => onKickMember(member.id)} isPending={isPending} />}
          </div>
        );
      })}
    </>
  );
};

export default MyMeetupMembers;
