"use client";

import { LikePartProps } from "@/types/likeType";
import React from "react";
import LikeItem from "./LikeItem";

const LikePart = ({ isLike, likeCount, onToggle, isPending = false }: LikePartProps) => {
  return (
    <div>
      <LikeItem isLike={isLike} likeCount={likeCount} onClick={onToggle} disabled={isPending} />
    </div>
  );
};

export default LikePart;
