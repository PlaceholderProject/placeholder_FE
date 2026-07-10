"use client";

import { LikeItemProps } from "@/types/likeType";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeItem = ({ isLike, likeCount, onToggle, isPending, disabled = false }: LikeItemProps) => {
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
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled || isPending}
        aria-label="좋아요"
        className="hover:bg-primary-soft disabled:text-muted-foreground inline-flex h-[2.8rem] min-w-[2.8rem] items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLike ? <IoMdHeart className="text-primary h-[1.8rem] w-[1.8rem]" /> : <IoMdHeartEmpty className="h-[1.8rem] w-[1.8rem]" />}
      </button>
      <span className="text-muted-foreground min-w-[1.6rem] text-right text-[1.3rem]">{likeCount}</span>
    </div>
  );
};

export default LikeItem;
