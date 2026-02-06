import { Meetup } from "@/types/meetupType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useMeetupForm = (mode: "create" | "edit", previousData?: Meetup) => {
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
  const meetupValidateDates = (startDate: string | null, endDate: string | null, adEndDate: string): boolean => {
    const validateCreateDates = (startDate: string | null, endDate: string | null, adEndDate: string): boolean => {

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (startDate) {
        const inputStartDate = new Date(startDate);
        inputStartDate.setHours(0, 0, 0, 0);
        if (inputStartDate < now) {
          toast.error("모임 시작일은 이미 지난 날짜로 설정할 수 없습니다.");
          return false;
        }
      }
      if (endDate) {
        const inputEndDate = new Date(endDate);
        inputEndDate.setHours(0, 0, 0, 0);
        if (inputEndDate < now) {
          toast.error("모임 종료일은 이미 지난 날짜로 설정할 수 없습니다.");
          return false;
        }
      }
      const inputAdEndDate = new Date(adEndDate);
      inputAdEndDate.setHours(0, 0, 0, 0);
      if (inputAdEndDate < now) {
        toast.error("광고 종료일은 이미 지난 날짜로 설정할 수 없습니다.");
        return false;
      }
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        toast.error("모임 종료일은 시작일보다 빠르게 설정할 수 없습니다.");
        return false;
      }
      return true;
    };

    const validateEditDates = (startDate: string | null, endDate: string | null, adEndDate: string, previousData?: Meetup): boolean => {
      if (!previousData) return false;

      const now = new Date();
      now.setHours(0, 0, 0, 0);
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
      const inputAdEndDate = new Date(adEndDate);
      inputAdEndDate.setHours(0, 0, 0, 0);
      const previousAdEndDate = new Date(previousData.adEndedAt);
      previousAdEndDate.setHours(0, 0, 0, 0);

      if (+inputAdEndDate !== +previousAdEndDate && inputAdEndDate < now) {
        toast.error("광고 종료일은 지난 날짜로 설정할 수 없습니다.");
        return false;
      }
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
    formStates: { nameLength, placeLength, descriptionLength, adTitleLength, isStartedAtNull, setIsStartedAtNull, isEndedAtNull, setIsEndedAtNull, previewImage, isSubmitting, setIsSubmitting },
    handlers: { handleNameLengthChange, handlePlaceLengthChange, handleAdTitleLengthChange, handleDescriptionLengthChange, handlePreviewImageChange },
    validateDates: meetupValidateDates,
  };
};
