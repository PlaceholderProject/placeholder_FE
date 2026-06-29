"use client";

import { MoonLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <MoonLoader color="#6e3bff" size={30} />
    </div>
  );
}
