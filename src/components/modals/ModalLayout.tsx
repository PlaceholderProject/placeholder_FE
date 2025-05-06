"use client";

import { ReactNode } from "react";

interface ModalLayoutProps {
  children: ReactNode;
  onClose: () => void;
}

const ModalLayout = ({ children, onClose }: ModalLayoutProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose} // 바깥 눌렀을 때 닫기
    >
      <div
        className="bg-white w-[280px] h-[287px] p-6 rounded-xl shadow-lg flex items-center justify-center"
        onClick={e => e.stopPropagation()} // 안쪽 누르면 닫기 막기
      >
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
