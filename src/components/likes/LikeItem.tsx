"use client";

import { LikeItemProps } from "@/types/likeType";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeItem = ({ isLike, likeCount, onToggle, disabled = false }: LikeItemProps) => {
  // return (
  //   <>
  //     <div className="grid grid-cols-2 gap-[0.4rem]">
  //       <button onClick={onClick} disabled={disabled} className="{`flex ${disabled ? 'opacity-50 cursor-not-allowed'
  //        : hover:opacity-80'}} items-center">
  //         {isLike ? <IoMdHeart className="h-[1.5rem] w-[1.5rem] text-primary" />
  //         : <IoMdHeartEmpty className="h-[1.5rem] w-[1.5rem]" />}
  //       </button>
  //       <div className="w-[1rem] text-sm">{likeCount}</div>
  //     </div>
  //   </>
  // );

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
