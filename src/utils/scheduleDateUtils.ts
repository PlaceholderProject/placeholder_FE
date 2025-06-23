/**
 * 날짜 및 시간을 한국 형식(YYYY.MM.DD HH:MM)으로 포맷팅하는 함수
 * @param dateTimeString
 * @returns YYYY.MM.DD HH:MM
 */
export function formatDateTime(dateTimeString: string): string {
  // 문자열을 Date 객체로 변환
  const date = new Date(dateTimeString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
