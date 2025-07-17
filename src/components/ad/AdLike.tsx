import React from "react";
import { IoMdHeart } from "react-icons/io";

const AdLike = () => {
  return (
    <div className="flex flex-wrap justify-between">
      <div className="flex items-center">
        <IoMdHeart className="h-[1.5rem] w-[1.5rem] text-primary md:h-[20px] md:w-[20px]" />
      </div>
      <div className="text-base md:text-[18px]">15</div>
    </div>
  );
};

export default AdLike;
