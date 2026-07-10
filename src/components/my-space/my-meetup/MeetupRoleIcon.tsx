import { LuCrown, LuUsersRound } from "react-icons/lu";

const MeetupRoleIcon = ({ isOrganizer }: { isOrganizer: boolean }) => {
  return (
    <span
      aria-hidden="true"
      className={`relative grid h-[5rem] w-[5rem] shrink-0 place-items-center rounded-[1.4rem] border ${
        isOrganizer ? "border-primary/15 bg-primary-soft text-primary" : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <LuUsersRound className="h-[2.2rem] w-[2.2rem] stroke-[1.8]" />
      {isOrganizer && (
        <span className="bg-primary text-primary-foreground ring-card absolute -top-[0.45rem] -right-[0.45rem] grid h-[2.2rem] w-[2.2rem] place-items-center rounded-full ring-[0.25rem]">
          <LuCrown className="h-[1.2rem] w-[1.2rem] stroke-[2]" />
        </span>
      )}
    </span>
  );
};

export default MeetupRoleIcon;
