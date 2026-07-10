import { Meetup } from "@/types/meetupType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useMeetupForm = (mode: "create" | "edit", previousData?: Meetup) => {
  //상태들 : 제출, 글자수, 체크박스, 미리보기
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameLength, setNameLength] = useState(0);
  const [placeLength, setPlaceLength] = useState(0);
  const [adTitleLength, setAdTitleLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);
  const [previewImage, setPreviewImage] = useState("/meetup_default_image.png");

  useEffect(() => {
    if (mode === "edit" && previousData) {
      setNameLength(previousData.name?.length || 0);
      setPlaceLength(previousData.placeDescription?.length || 0);
      setAdTitleLength(previousData.adTitle?.length || 0);
      setDescriptionLength(previousData.description?.length || 0);
      setIsStartedAtNull(previousData.startedAt === null);
      setIsEndedAtNull(previousData.endedAt === null);

      if (previousData.image) {
        setPreviewImage(previousData.image);
      }
    }
  }, [mode, previousData]);

  //핸들러들 : 글자수, 미리보기
  const handleNameLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameLength(event.target.value.length);
  };
  const handlePlaceLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceLength(event.target.value.length);
  };
  const handleAdTitleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdTitleLength(event.target.value.length);
  };
  const handleDescriptionLengthChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionLength(event.target.value.length);
  };
  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
  };

  //유효성검사
  const meetupValidateDates = (startDate: string | null, endDate: string | null, adEndDate: string): boolean => {
    //create mode
    const validateCreateDates = (startDate: string | null, endDate: string | null, adEndDate: string): boolean => {
      // 사용자 입력값 미정이면 실행X, 즉 잇을 때만 실행하자
      // const inputDate = new Date(date); date 파라미터로 받은 값을 변환
      // inputDate.setHours(0, 0, 0, 0);

      const now = new Date(); //이제 각 날짜별로 직접 변환
      now.setHours(0, 0, 0, 0);

      // 시작일 검사
      if (startDate) {
        const inputStartDate = new Date(startDate); // ← startDate를 직접 변환
        inputStartDate.setHours(0, 0, 0, 0);
        if (inputStartDate < now) {
          toast.error("모임 시작일은 이미 지난 날짜로 설정할 수 없습니다.");
          return false;
        }
      }

      //종료일 검사
      if (endDate) {
        const inputEndDate = new Date(endDate);
        inputEndDate.setHours(0, 0, 0, 0);
        if (inputEndDate < now) {
          toast.error("모임 종료일은 이미 지난 날짜로 설정할 수 없습니다.");
          return false;
        }
      }

      //광고 종료일 검사
      const inputAdEndDate = new Date(adEndDate);
      inputAdEndDate.setHours(0, 0, 0, 0);
      if (inputAdEndDate < now) {
        toast.error("광고 종료일은 이미 지난 날짜로 설정할 수 없습니다.");
        return false;
      }

      // 시작일-종료일 비교 (둘 다 있을 때만)
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        toast.error("모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.");
        return false;
      }
      return true;
    };

    //edit mode

    const validateEditDates = (startDate: string | null, endDate: string | null, adEndDate: string, previousData?: Meetup): boolean => {
      if (!previousData) return false;

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // 시작일 검증
      if (startDate) {
        const inputStartDate = new Date(startDate);
        inputStartDate.setHours(0, 0, 0, 0);
        const previousStartDate = previousData.startedAt ? new Date(previousData.startedAt) : null;

        if (previousStartDate) {
          previousStartDate.setHours(0, 0, 0, 0);
        }

        if (previousStartDate && previousStartDate < now && +inputStartDate !== +previousStartDate) {
          toast.error("이미 시작된 모임의 시작일은 수정할 수 없습니다.");
          return false;
        }

        if (previousStartDate && +inputStartDate !== +previousStartDate && inputStartDate < now) {
          toast.error("모임 시작일은 오늘보다 이전으로 설정할 수 없습니다.");
          return false;
        }
      }

      // 종료일 검증
      if (endDate) {
        const inputEndDate = new Date(endDate);
        inputEndDate.setHours(0, 0, 0, 0);
        const previousEndDate = previousData.endedAt ? new Date(previousData.endedAt) : null;

        if (previousEndDate) {
          previousEndDate.setHours(0, 0, 0, 0);
        }

        if (previousEndDate && previousEndDate < now && inputEndDate < now) {
          toast.error("이미 종료된 모임의 종료일은 지난 날짜로 설정할 수 없습니다.");
          return false;
        }

        if (previousEndDate && previousEndDate >= now && inputEndDate < now) {
          toast.error("모임 종료일은 지난 날짜로 설정할 수 없습니다.");
          return false;
        }
      }

      // 광고 종료일 검증
      const inputAdEndDate = new Date(adEndDate);
      inputAdEndDate.setHours(0, 0, 0, 0);
      const previousAdEndDate = new Date(previousData.adEndedAt);
      previousAdEndDate.setHours(0, 0, 0, 0);

      if (+inputAdEndDate !== +previousAdEndDate && inputAdEndDate < now) {
        toast.error("광고 종료일은 지난 날짜로 설정할 수 없습니다.");
        return false;
      }

      // 시작일-종료일 비교
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        toast.error("모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.");
        return false;
      }

      return true;
    };

    if (mode === "create") {
      return validateCreateDates(startDate, endDate, adEndDate);
    } else {
      return validateEditDates(startDate, endDate, adEndDate, previousData);
    }
  };

  return {
    // 상태들
    formStates: { nameLength, placeLength, descriptionLength, adTitleLength, isStartedAtNull, setIsStartedAtNull, isEndedAtNull, setIsEndedAtNull, previewImage, isSubmitting, setIsSubmitting },
    // 핸들러들
    handlers: { handleNameLengthChange, handlePlaceLengthChange, handleAdTitleLengthChange, handleDescriptionLengthChange, handlePreviewImageChange },
    // 유효성 검사
    validateDates: meetupValidateDates,
  };
};
