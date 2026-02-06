
import { toast } from "sonner";

const validatePresentDate = (date: string) => {
  const now = Number(new Date());
  const inputDate = Number(date.substring(10, 0));
  const isNegative = inputDate - now < 0 ? true : false;

  return isNegative ? toast.error("날짜가 이미 지난 날짜로 설정되었습니다.") : null;
};

export default validatePresentDate;
