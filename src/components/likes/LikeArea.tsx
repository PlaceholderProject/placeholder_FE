"use client";

import { LikeAreaProps } from "@/types/likeType";
import React from "react";
import LikeItem from "./LikeItem";

const LikeArea = ({ isLike, likeCount, onToggle, isPending = false }: LikeAreaProps) => {
  return (
    <div>
      <LikeItem isLike={isLike} likeCount={likeCount} onClick={onToggle} disabled={isPending} />
    </div>
  );
};

export default LikeArea;
