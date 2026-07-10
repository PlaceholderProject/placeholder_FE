// 마감일(ISO/날짜 문자열) → D-day 문자열 변환
// 예) "D-7", "D-DAY", "마감"
export const getDday = (dateString: string | null | undefined): string => {
  if (!dateString) return "";

  const target = new Date(dateString).getTime();
  if (Number.isNaN(target)) return "";

  // 자정 기준으로 비교해 같은 날이면 D-DAY가 되도록 보정
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetDate = new Date(target);
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

  const diffDays = Math.round((targetDay - today) / 86400000);

  if (diffDays === 0) return "D-DAY";
  if (diffDays < 0) return "마감";
  return `D-${diffDays}`;
};
