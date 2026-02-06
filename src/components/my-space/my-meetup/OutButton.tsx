import React from "react";

interface OutButtonProps {
  text: string;
  onClick: () => void;
  isPending?: boolean;
}

const OutButton: React.FC<OutButtonProps> = ({ text, onClick, isPending = false }) => {

  return (
    <div>
      <button onClick={onClick} disabled={isPending} className="h-[2rem] w-[2.5rem] rounded-[0.5rem] bg-warning text-xs font-bold text-white">
        {isPending ? "처리 중..." : text}
      </button>
    </div>
  );
};

export default OutButton;
