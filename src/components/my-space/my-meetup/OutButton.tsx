import React from "react";

interface OutButtonProps {
  text: string;
  onClick: () => void;
  isPending?: boolean;
}

const OutButton: React.FC<OutButtonProps> = ({ text, onClick, isPending = false }) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={isPending}
        className="text-destructive hover:bg-destructive/5 border-border h-[3.2rem] rounded-full border px-[1.1rem] text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isPending ? "처리 중..." : text}
      </button>
    </div>
  );
};

export default OutButton;
