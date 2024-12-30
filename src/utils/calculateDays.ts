import { DateRange } from "@/types/adType";

const calculateDays = ({ startedAt, endedAt }: DateRange) => {
  const start = new Date(startedAt);
  const end = new Date(endedAt);

  // 밀리초 단위 시간차 계산
  const timeDifference = end - start;

  // 밀리초를 일수로 변환
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return numberOfDays;
};

export default calculateDays;
