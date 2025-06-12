export const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();

  // 같은 날짜인지 확인
  const isSameDay = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

  if (isSameDay) {
    // 같은 날짜면 시간만 표시 (HH:MM)
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else {
    // 다른 날짜면 YYYY-MM-DD 형식으로 표시
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
};
