"use client";

import DaumPostcode, { type Address } from "react-daum-postcode";
import { useModal } from "@/hooks/useModal";

interface PostcodeContentProps {
  onComplete: (data: Address) => void;
}

const PostcodeContent = ({ onComplete }: PostcodeContentProps) => {
  const { closeModal } = useModal();

  const handleComplete = (data: Address) => {
    onComplete(data);
    closeModal();
  };

  return (
    <div className="pt-10">
      <DaumPostcode onComplete={handleComplete} style={{ width: "100%", height: "460px" }} />
    </div>
  );
};

export default PostcodeContent;
