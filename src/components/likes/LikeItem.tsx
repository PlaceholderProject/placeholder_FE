"use client";

import { LikeItemProps } from "@/types/likeType";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeItem = ({ isLike, likeCount, onToggle, disabled = false }: LikeItemProps) => {

  return (
    <div className="flex items-center gap-[0.4rem]">
      <button onClick={onToggle} disabled={disabled}>
        {isLike ? <IoMdHeart className="h-[1.7rem] w-[1.7rem] text-primary" /> : <IoMdHeartEmpty className="h-[1.7rem] w-[1.7rem]" />}
      </button>
      <span className="text-[1.3rem]">{likeCount}</span>
    </div>
  );
};

export default LikeItem;
