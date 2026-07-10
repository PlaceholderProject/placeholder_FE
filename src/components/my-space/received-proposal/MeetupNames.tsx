"use client";

import Spinner from "@/components/common/Spinner";
import { useOrganizedMeetups } from "@/hooks/useProposal";
import { setSelectedMeetupId } from "@/stores/proposalSlice";
import { RootState } from "@/stores/store";
import { OrganizedMeetup } from "@/types/proposalType";
import { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import MySpaceEmptyState from "../MySpaceEmptyState";

const MeetupNames = () => {
  const selectedMeetupId = useSelector((state: RootState) => state.proposal.selectedMeetupId);
  const dispatch = useDispatch();
  const { data: organizedMeetups, isLoading, isError, error } = useOrganizedMeetups();

  useEffect(() => {
    if (organizedMeetups && organizedMeetups.length > 0 && !organizedMeetups.some((meetup: OrganizedMeetup) => meetup.id === selectedMeetupId)) {
      dispatch(setSelectedMeetupId(organizedMeetups[0].id));
    }
  }, [organizedMeetups, dispatch, selectedMeetupId]);

  if (isLoading) return <Spinner isLoading />;
  if (isError) {
    return (
      <div className="border-error/20 bg-error/5 text-error rounded-[1.6rem] border px-[1.4rem] py-[2.4rem] text-center text-sm font-medium">
        {error.message || "운영 중인 모임을 불러오지 못했어요."}
      </div>
    );
  }
  if (!organizedMeetups || organizedMeetups.length === 0) {
    return <MySpaceEmptyState title="운영 중인 모임이 없어요" description="가입 신청을 받으려면 먼저 모집 중인 모임이 필요해요." actionHref="/my-space/my-ad" actionLabel="모집 관리 보기" />;
  }

  return (
    <section aria-labelledby="approval-meetup-title">
      <p id="approval-meetup-title" className="text-foreground mb-[0.8rem] text-sm font-black">
        신청을 확인할 모임
      </p>
      <div className="scroll-container -mx-[0.2rem] flex gap-[0.7rem] px-[0.2rem] pb-[0.4rem]">
        {organizedMeetups.map((meetup: OrganizedMeetup) => {
          const isSelected = selectedMeetupId === meetup.id;

          return (
            <button
              key={meetup.id}
              type="button"
              onClick={() => dispatch(setSelectedMeetupId(meetup.id))}
              aria-pressed={isSelected}
              className={`inline-flex shrink-0 items-center gap-[0.5rem] rounded-full border px-[1.2rem] py-[0.7rem] text-sm font-bold whitespace-nowrap transition-colors ${
                isSelected ? "border-primary/15 bg-primary-soft text-primary-soft-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:text-foreground"
              }`}
            >
              {isSelected && <LuCheck className="h-[1.4rem] w-[1.4rem] stroke-[2.2]" />}
              {meetup.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MeetupNames;
