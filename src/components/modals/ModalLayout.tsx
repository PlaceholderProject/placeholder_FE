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
        className="bg-white p-6 rounded-lg shadow-lg"
        onClick={e => e.stopPropagation()} // 안쪽 누르면 닫기 막기
      >
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
