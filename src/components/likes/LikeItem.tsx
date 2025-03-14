// "use client";

// import { LikeItemProps } from "@/types/likeType";
// import React from "react";
// import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

// const LikeItem = ({ isLike, likeCount, handleToggleLike }: LikeItemProps) => {
//   return (
//     <>
//       <div>🌟개별라이크🌟</div>
//       <button onClick={handleToggleLike}>{isLike ? <IoMdHeart /> : <IoMdHeartEmpty />}</button>
//       <p>좋아요 눌렸니? {isLike?.toString()}</p>
//       <p>좋아요 숫자 : {likeCount}</p>

//       {/* 👇👇👇👇👇👇👇👇아래 thumbnail.isLike로 접근한 건 잘못된 코드인데 기억하라고 남겨둠 */}
//       {/* <p>좋아요 눌렀니? {thumbnail.isLike.toString()}</p>
//           <button onClick={() => setIsHeadhuntingLike(!isHeadhuntingLike)}>좋아요 눌렀니? {isHeadhuntingLike ? <IoMdHeart /> : <IoMdHeartEmpty />}</button>

//           <p>좋아요 숫자 : {thumbnail.likeCount}</p> */}
//     </>
//   );
// };

// export default LikeItem;

"use client";

import { LikeItemProps } from "@/types/likeType";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeItem = ({ isLike, likeCount, onClick, disabled = false }: LikeItemProps) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className="{`flex items-center space-x-1 ${disabled ? 'opacity-50 cursor-not-allowed' :
      hoever:opacity-80}}"
      >
        {isLike ? <IoMdHeart className="text-red-500 text-xl" /> : <IoMdHeartEmpty className="text-xl" />}
      </button>
      <span className="text-sm">좋아요 수: {likeCount}</span>
    </div>
  );
};

export default LikeItem;
