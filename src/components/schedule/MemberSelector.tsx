import { useMeetupMembers } from "@/hooks/useSchedule";
import { Member } from "@/types/scheduleType";
import Image from "next/image";
import { getImageURL } from "@/utils/getImageURL";

interface MemberSelectorProps {
  meetupId: number;
  selectedMember: number[];
  onMemberSelect: (memberId: number) => void;
}

const MemberSelector = ({ meetupId, selectedMember, onMemberSelect }: MemberSelectorProps) => {
  const { data: members, isPending } = useMeetupMembers(meetupId);

  return (
    <div className="space-y-2">
      <label className="font-medium">참석자 등록하기</label>
      <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
        {isPending ? (
          <div className="py-4 text-center text-gray-500">멤버 정보를 불러오는 중...</div>
        ) : members?.length ? (
          members.map((participant: Member) => (
            <div key={participant.id} className="flex items-center border-b py-2">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                {participant.user.image ? (
                  <Image src={getImageURL(participant.user.image)} alt={participant.user.nickname} width={32} height={32} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">{participant.user.nickname.charAt(0)}</div>
                )}
              </div>
              <div className="flex-1 font-medium">
                {participant.role === "organizer" && "👑 "}
                {participant.user.nickname}
              </div>
              <input type="checkbox" checked={selectedMember.includes(participant.id)} onChange={() => onMemberSelect(participant.id)} className="h-5 w-5" />
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">모임에 등록된 멤버가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MemberSelector;
