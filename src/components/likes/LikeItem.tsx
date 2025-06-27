"use client";

import { LikeItemProps } from "@/types/likeType";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeItem = ({ isLike, likeCount, onClick, disabled = false }: LikeItemProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-[0.2rem]">
        <button onClick={onClick} disabled={disabled} className="{`flex ${disabled ? 'opacity-50 cursor-not-allowed' : hover:opacity-80'}} items-center space-x-1">
          {isLike ? <IoMdHeart className="h-[1.5rem] w-[1.5rem] text-primary" /> : <IoMdHeartEmpty className="h-[1.5rem] w-[1.5rem]" />}
        </button>
        <div className="text-sm">{likeCount}</div>
      </div>
    </>
  );
};

export default LikeItem;
