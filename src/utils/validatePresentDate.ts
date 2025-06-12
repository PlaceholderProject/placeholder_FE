// startedAt :
// endedAt :
// adEndedAt :

// 1.
// 미정이 아니라면 오늘 이후여야 함

// 2.
// 둘 다 null이 아니라면 enedAt - startedAt

// ***** 오늘 이후로 설정하기 *****
// switch case

// null이 아니어야 실행
// (매개변수 !== null)
// case : startedAt이면 '모임 시작일'이 이미 지난 날짜로 설정되었습니다.
// case : endedAt이면 '모임 종료일'이 이미 지난 날짜로 설정되었습니다.

// case:  adEndedAt이면 '광고 종료일'이 이미 지난 날짜로 설정되었습니다.

// ***** 모임 종료 - 시작은 음수일 수 없음*****

const validatePresentDate = (date: string) => {
  const now = Number(new Date());
  const inputDate = Number(date.substring(10, 0));
  const isNegative = inputDate - now < 0 ? true : false;

  return isNegative ? alert("날짜가 이미 지난 날짜로 설정되었습니다.") : null;
};

export default validatePresentDate;
