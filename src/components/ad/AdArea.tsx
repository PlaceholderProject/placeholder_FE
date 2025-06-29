import React from "react";
import AdSignboard from "./AdSignboard";
import AdOrganizer from "./AdOrganizer";
import AdDetail from "./AdDetail";
import AdButton from "./AdButton";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

const AdArea = () => {
  const { meetupId } = useParams();
  const meetupIdNum = Number(meetupId);
  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user?.nickname || "";
  return (
    <div>
      <AdSignboard meetupId={meetupIdNum} />
      <AdOrganizer meetupId={meetupIdNum} />
      <AdDetail meetupId={meetupIdNum} userNickname={userNickname} />
      <AdButton meetupId={meetupIdNum} />
    </div>
  );
};

export default AdArea;
