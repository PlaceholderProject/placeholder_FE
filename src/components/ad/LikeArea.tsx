"use client";

import { LikeProps } from "@/types/likeType";
import React, { useState } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeArea = ({ isLike, likeCount, handleToggleLike }: LikeProps) => {
  // const [isHeadhuntingLike, setIsHeadhuntingLike] = useState(false);

  return (
    <>
      <div>🌟Like Area🌟</div>
      <p>{isLike?.toString()}</p>
      <p>{likeCount}</p>
      {/* <button onClick={() => setIsHeadhuntingLike(!isHeadhuntingLike)}>좋아요 눌렀니? {isHeadhuntingLike ? <IoMdHeart /> : <IoMdHeartEmpty />}</button> */}
      <button onClick={handleToggleLike}>{isLike ? <IoMdHeart /> : <IoMdHeartEmpty />}</button>

      {/* 👇👇👇👇👇👇👇👇아래 thumbnail.isLike로 접근한 건 잘못된 코드인데 기억하라고 남겨둠 */}
      {/* <p>좋아요 눌렀니? {thumbnail.isLike.toString()}</p>
          <button onClick={() => setIsHeadhuntingLike(!isHeadhuntingLike)}>좋아요 눌렀니? {isHeadhuntingLike ? <IoMdHeart /> : <IoMdHeartEmpty />}</button>

          <p>좋아요 숫자 : {thumbnail.likeCount}</p> */}
    </>
  );
};

export default LikeArea;
