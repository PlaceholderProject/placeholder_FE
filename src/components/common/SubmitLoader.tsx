import React from "react";
import { RiseLoader } from "react-spinners";

interface SubmitLoaderProps {
  isLoading: boolean;
  // loaderColor: string;
  // loaderSize: number;
  // overlayColor: string;
  // overlayOpacity: number;
  // zIndex: number;
  message?: string;
}

const SubmitLoader = ({ isLoading, message = "처리 중..." }: SubmitLoaderProps) => {
  if (!isLoading) return null;
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50`}>
      <RiseLoader color="#FBFFA9" size={15} />
    </div>
  );
};

export default SubmitLoader;
