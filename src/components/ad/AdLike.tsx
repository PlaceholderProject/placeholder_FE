import React from "react";
import { IoMdHeart } from "react-icons/io";

const AdLike = () => {
  return (
    <div className="flex flex-wrap justify-between">
      <div className="flex items-center">
        <IoMdHeart className="h-[1.5rem] w-[1.5rem] text-primary" />
      </div>
      <div className="text-base">15</div>
    </div>
  );
};

export default AdLike;
