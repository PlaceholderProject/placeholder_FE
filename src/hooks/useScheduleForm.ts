import { useCallback, useEffect, useState } from "react";
import { getS3ImageURL } from "@/utils/getImageURL";
import type { Participant, Schedule } from "@/types/scheduleType";

export interface ScheduleFormData {
  date: string;
  time: string;
  place: string;
  address: string;
  latitude: string;
  longitude: string;
  memo: string;
  participant: number[];
  image: File | null;
}

export interface UseScheduleFormReturn {
  formData: ScheduleFormData;
  imagePreview: string | null;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMemberSelect: (memberId: number) => void;
  handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: () => void;
  setAddress: (address: string, latitude: string, longitude: string) => void;
}

const initialFormData: ScheduleFormData = {
  date: "",
  time: "12:00",
  place: "",
  address: "",
  latitude: "0",
  longitude: "0",
  memo: "",
  participant: [],
  image: null,
};

export const useScheduleForm = (mode: "create" | "edit", scheduleData?: Schedule): UseScheduleFormReturn => {
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && scheduleData) {
      const scheduledDate = new Date(scheduleData.scheduledAt);
      setFormData({
        date: scheduledDate.toISOString().split("T")[0],
        time: scheduledDate.toTimeString().slice(0, 5),
        place: scheduleData.place,
        address: scheduleData.address,
        latitude: scheduleData.latitude,
        longitude: scheduleData.longitude,
        memo: scheduleData.memo,
        participant: scheduleData.participant.map((participant: Participant) => participant.id),
        image: null,
      });
      if (scheduleData.image) {
        setImagePreview(getS3ImageURL(scheduleData.image));
      }
    }
  }, [scheduleData, mode]);

  useEffect(() => {
    const blobUrl = imagePreview;
    const isBlob = blobUrl?.startsWith("blob:");

    return () => {
      if (isBlob && blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imagePreview]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(previousFormData => ({ ...previousFormData, [name]: value }));
  }, []);

  const handleMemberSelect = useCallback((memberId: number) => {
    setFormData(previousFormData => ({
      ...previousFormData,
      participant: previousFormData.participant.includes(memberId) ? previousFormData.participant.filter(id => id !== memberId) : [...previousFormData.participant, memberId],
    }));
  }, []);

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(previousFormData => ({ ...previousFormData, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageRemove = useCallback(() => {
    setFormData(previousFormData => ({ ...previousFormData, image: null }));
    setImagePreview(null);
  }, []);

  const setAddress = useCallback((address: string, latitude: string, longitude: string) => {
    setFormData(previousFormData => ({
      ...previousFormData,
      address,
      latitude,
      longitude,
    }));
  }, []);

  return { formData, imagePreview, handleChange, handleMemberSelect, handleImageSelect, handleImageRemove, setAddress };
};
