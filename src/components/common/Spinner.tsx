import React from "react";
import { MoonLoader } from "react-spinners";

interface SpinnerProps {
  isLoading: boolean;
  // loaderColor: string;
  // loaderSize: number;
  // overlayColor: string;
  // overlayOpacity: number;
  // zIndex: number;
  message?: string;
}

const Spinner = ({ isLoading }: SpinnerProps) => {
  if (!isLoading) return null;
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center`}>
      <MoonLoader color="#006B8B" size={30} />
    </div>
  );
};

export default Spinner;
