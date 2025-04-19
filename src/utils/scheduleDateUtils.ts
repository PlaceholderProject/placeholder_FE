/**
 * 날짜 및 시간을 한국 형식으로 포맷팅하는 함수
 * @param dateTimeString
 * @returns 0000년 00월 00일 오후 00:00
 */
export function formatDateTime(dateTimeString: string): string {
  // 문자열을 Date 객체로 변환
  const date = new Date(dateTimeString);

  // 포맷팅 옵션 설정
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",   // 연도를 숫자로 표시 (예: 2023)
    month: "long",     // 월을 전체 이름으로 표시 (예: 6월)
    day: "numeric",    // 일을 숫자로 표시 (예: 10)
    hour: "2-digit",   // 시간을 두 자리로 표시 (예: 02 또는 14)
    minute: "2-digit", // 분을 두 자리로 표시 (예: 05 또는 30)
  };

  // Intl.DateTimeFormat을 사용하여 지역화된 날짜/시간 문자열 생성
  return new Intl.DateTimeFormat("ko-KR", options).format(date);
}