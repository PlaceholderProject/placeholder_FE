"use client";

import { getMyMeetupMembersApi } from "@/services/my.space.service";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import OutButton from "./OutButton";
import { MyMeetupMember } from "@/types/myMeetupMemberType";
import Image from "next/image";
import { useMemberDelete } from "@/hooks/useMemberDelete";
import { BASE_URL } from "@/constants/baseURL";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

interface MyMeetupMembersProps {
  meetupId: number;
}

const MyMeetupMembers: React.FC<MyMeetupMembersProps> = ({ meetupId }) => {
  const [userImages, setUserImages] = useState<{ [userId: number]: string }>({});

  const deleteMutation = useMemberDelete();
  const handleKickMember = (memberId: number) => {
    showConfirmToast({
      message: "정말 이 멤버를 강퇴하시겠습니까?",
      confirmText: "강퇴",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(memberId);
          toast.success("정상적으로 멤버를 강퇴했습니다.");
        } catch {
          toast.error("멤버 강퇴 처리 중 문제가 발생했습니다.");
        }
      },
    });
  };

  const {
    data: myMeetupMembersData,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetupMembers", meetupId],
    queryFn: () => getMyMeetupMembersApi(meetupId),
    enabled: !!meetupId,
  });
  useEffect(() => {
    if (myMeetupMembersData?.result) {
      const imageMap: { [userId: number]: string } = {};

      myMeetupMembersData.result.forEach((member: MyMeetupMember) => {
        if (member.user?.id) {
          if (member.user.image) {
            const userImage = member.user.image.startsWith("http") ? member.user.image : `${BASE_URL}/${member.user.image}`;
            const profileImageUrl = userImage;
            imageMap[member.user.id] = profileImageUrl;
          } else {
            imageMap[member.user.id] = "/profile.png";
          }
        }
      });
      setUserImages(imageMap);
    }
  }, [myMeetupMembersData]);

  if (!meetupId) return <div>모임 아이디 필요핣니다.</div>;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupMembersData || !myMeetupMembersData.result || myMeetupMembersData.result.length === 0) return <p>멤버가 없습니다.</p>;

  return (
    <>
      {myMeetupMembersData.result.map((member: MyMeetupMember) => {
        const userImageSource = userImages[member.user?.id || 0] || "/profile.png";
        return (
          <div key={member.id} className="mx-[1rem] my-[1rem] grid grid-cols-[10%_15%_60%_15%] items-center border-b-[0.1rem] border-gray-medium pb-[0.8rem] text-base last:border-b-0">
            <div>{member.role == "organizer" ? <span className="ml-[0.5rem]">👑</span> : <span className="ml-[0.5rem]"> </span>}</div>
            {}
            <div className="relative mx-auto flex h-[1.8rem] w-[1.8rem] items-center bg-purple-100">
              <Image src={userImageSource} alt="내 모임 회원 프로필 이미지" sizes="width=18rem, height=18rem" fill className="rounded-full bg-yellow-200 object-cover" />
            </div>
            <div>{member.user?.nickname}</div>
            {}
            {}
            {}
            <div>{member.role !== "organizer" && <OutButton text="강퇴" onClick={() => handleKickMember(member.id)} />}</div>
          </div>
        );
      })}
    </>
  );
};

export default MyMeetupMembers;
