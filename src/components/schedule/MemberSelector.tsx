import { useMeetupMembers } from "@/hooks/useSchedule";
import { Member } from "@/types/scheduleType";
import Image from "next/image";

interface MemberSelectorProps {
  meetupId: number,
  selectedMember: number[],
  onMemberSelect: (memberId: number) => void,
}

const MemberSelector = ({ meetupId, selectedMember, onMemberSelect }: MemberSelectorProps) => {

  const { data: members, isPending } = useMeetupMembers(meetupId);

  let profileImage;
  return (
    <div className="space-y-2">
      <label className="font-medium">참석자 등록하기</label>
      <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
        {isPending ? (
          <div className="text-center py-4 text-gray-500">
            멤버 정보를 불러오는 중...
          </div>
        ) : members?.length ? (
          members.map((member: Member) => (
            <div key={member.id} className="flex items-center py-2 border-b">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">
                {member.user.image ? (
                  <img
                    src={member.user.image}
                    alt={member.user.nickname}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : <Image src={profileImage || "/profile.png"} alt="프로필 이미지" width="100" height="100"
                           unoptimized={true} />}
              </div>
              <div className="flex-1 font-medium">
                {member.role === "organizer" && "👑 "}
                {member.user.nickname}
              </div>
              <input
                type="checkbox"
                checked={selectedMember.includes(member.id)}
                onChange={() => onMemberSelect(member.id)}
                className="w-5 h-5"
              />
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            모임에 등록된 멤버가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSelector;