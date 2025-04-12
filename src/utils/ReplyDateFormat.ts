const transformCurrentDate = () => {
  const currentToday = new Date();
  const currentYear = currentToday.getFullYear();
  const currentMonth = ("0" + (currentToday.getMonth() + 1)).slice(-2);
  const currentDay = ("0" + currentToday.getDate()).slice(-2);

  const currentDateString = currentYear + "-" + currentMonth + "-" + currentDay;

  return currentDateString;
};

export const transformCreatedDate = (date: string) => {
  const createdDate = new Date(date);
  const createdYear = createdDate.getFullYear();
  const createdMonth = ("0" + (createdDate.getMonth() + 1)).slice(-2);
  const createdDay = ("0" + createdDate.getDate()).slice(-2);

  const createdDateString = createdYear + "-" + createdMonth + "-" + createdDay;

  if (createdDateString === transformCurrentDate()) {
    const createdHour = createdDate.getHours();
    const createdMinute = createdDate.getMinutes();

    const createdTimeString = createdHour + ":" + createdMinute;

    return createdTimeString;
  }

  return createdDateString;
};
