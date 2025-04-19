// 현재 시간 0000-00-00 포맷
const transformCurrentDate = () => {
  const currentToday = new Date();
  const currentYear = currentToday.getFullYear();
  const currentMonth = ("0" + (currentToday.getMonth() + 1)).slice(-2);
  const currentDay = ("0" + currentToday.getDate()).slice(-2);

  const currentDateString = currentYear + "-" + currentMonth + "-" + currentDay;

  return currentDateString;
};

// UTC 기준 생성일 -> 댓글 포맷
export const transformCreatedDate = (date: string) => {
  const createdDate = new Date(date);
  const createdYear = createdDate.getFullYear();
  const createdMonth = ("0" + (createdDate.getMonth() + 1)).slice(-2);
  const createdDay = ("0" + createdDate.getDate()).slice(-2);

  const createdDateString = createdYear + "-" + createdMonth + "-" + createdDay;

  if (createdDateString === transformCurrentDate()) {
    const createdHour = ("0" + createdDate.getHours()).slice(-2);
    const createdMinute = ("0" + createdDate.getMinutes()).slice(-2);

    const createdTimeString = createdHour + ":" + createdMinute;

    return createdTimeString;
  }

  return createdDateString;
};
