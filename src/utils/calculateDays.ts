import { Meetup } from "@/types/meetupType";

const calculateDays = ({ startedAt, endedAt }: { startedAt: Meetup["startedAt"]; endedAt: Meetup["endedAt"] }) => {
  if (!startedAt || !endedAt) {
    return "미정 날짜는 계산할 수 없습니다.";
  }
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  const timeLength = end.getTime() - start.getTime();
  const numberOfDays = Math.ceil(timeLength / (1000 * 60 * 60 * 24)) + 1;
  if (numberOfDays === 1) {
    return `${numberOfDays} day`;
  } else {
    return `${numberOfDays} days`;
  }
};

export default calculateDays;
