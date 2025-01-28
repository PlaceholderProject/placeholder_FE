import { DateRange } from "@/types/adType";

// const now = new Date();
// const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
// const koreaTimeDiff = 9 * 60 * 60 * 1000;
// const korNow = new Date(utc+koreaTimeDiff);

const calculateDays = ({ startedAt, endedAt }: DateRange) => {
  const start = new Date(startedAt);
  const end = new Date(endedAt);

  // 밀리초 단위 시간차 계산
  const timeLength = end - start;

  // 밀리초를 일수로 변환
  const numberOfDays = Math.ceil(timeLength / (1000 * 60 * 60 * 24)) + 1;
  if (numberOfDays === 1) {
    return `${numberOfDays} day`;
  } else {
    return `${numberOfDays} days`;
  }
};

export default calculateDays;
