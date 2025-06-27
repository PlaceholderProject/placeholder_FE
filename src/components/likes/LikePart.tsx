"use client";

import { LikePartProps } from "@/types/likeType";
import React from "react";
import LikeItem from "./LikeItem";

const LikePart = ({ isLike, likeCount, onToggle, isPending = false }: LikePartProps) => {
  return <LikeItem isLike={isLike} likeCount={likeCount} onClick={onToggle} disabled={isPending} />;
};

export default LikePart;
