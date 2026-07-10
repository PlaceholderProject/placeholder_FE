export const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const elapsed = Date.now() - date.getTime();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (elapsed < minute) return "방금 전";
  if (elapsed < hour) return `${Math.floor(elapsed / minute)}분 전`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)}시간 전`;
  if (elapsed < day * 7) return `${Math.floor(elapsed / day)}일 전`;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
