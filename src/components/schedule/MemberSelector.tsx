import { useMeetupMembers } from "@/hooks/useSchedule";
import { Member } from "@/types/scheduleType";
import { getS3ImageURL } from "@/utils/getImageURL";
import Image from "next/image";
import { LuCheck, LuCrown } from "react-icons/lu";

interface MemberSelectorProps {
  meetupId: number;
  selectedMember: number[];
  onMemberSelect: (memberId: number) => void;
}

const MemberSelector = ({ meetupId, selectedMember, onMemberSelect }: MemberSelectorProps) => {
  const { data: members, isPending } = useMeetupMembers(meetupId);

  if (isPending) {
    return (
      <div className="space-y-[0.8rem]">
        {[0, 1, 2].map(item => (
          <div key={item} className="border-border bg-muted/60 flex items-center gap-[0.9rem] rounded-[1.4rem] border p-[0.9rem]">
            <div className="bg-muted h-[3.8rem] w-[3.8rem] animate-pulse rounded-full" />
            <div className="bg-muted h-[1.2rem] flex-1 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!members?.length) {
    return <div className="border-border bg-muted/60 text-muted-foreground rounded-[1.4rem] border border-dashed px-[1rem] py-[2rem] text-center text-sm">모임에 등록된 멤버가 없습니다.</div>;
  }

  return (
    <div className="max-h-[34rem] space-y-[0.8rem] overflow-y-auto pr-[0.2rem]">
      {members.map((participant: Member) => {
        const isSelected = selectedMember.includes(participant.id);

        return (
          <button
            key={participant.id}
            type="button"
            onClick={() => onMemberSelect(participant.id)}
            className={`flex w-full items-center gap-[0.9rem] rounded-[1.4rem] border p-[0.9rem] text-left transition-colors ${
              isSelected ? "border-primary bg-primary-soft/80" : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="relative h-[4rem] w-[4rem] shrink-0 overflow-hidden rounded-full">
              {participant.user.image ? (
                <Image unoptimized src={getS3ImageURL(participant.user.image)} alt={participant.user.nickname} fill sizes="4rem" className="object-cover" />
              ) : (
                <div className="bg-muted text-muted-foreground grid h-full w-full place-items-center text-sm font-bold">{participant.user.nickname.charAt(0)}</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground flex items-center gap-[0.4rem] truncate text-sm font-bold">
                {participant.role === "organizer" && <LuCrown className="text-primary fill-primary/20 h-[1.4rem] w-[1.4rem] shrink-0 stroke-[2]" />}
                {participant.user.nickname}
              </p>
              <p className="text-muted-foreground mt-[0.2rem] text-xs">{participant.role === "organizer" ? "모임장" : "멤버"}</p>
            </div>
            <span
              className={`grid h-[2.4rem] w-[2.4rem] shrink-0 place-items-center rounded-full border transition-colors ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
            >
              {isSelected && <LuCheck className="h-[1.4rem] w-[1.4rem] stroke-[2.4]" />}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MemberSelector;
