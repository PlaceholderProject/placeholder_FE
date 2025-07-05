"use client";

import React from "react";
import { Meetup } from "@/types/meetupType";

const AdSignboard = ({ adData }: { adData: Meetup }) => {
  return (
    <>
      <div className="mx-auto mt-[2rem] w-[95%] space-y-[0.5rem] md:max-w-[90rem]">
        <div className="w-full">
          <div className="flex justify-start text-lg">{adData.adTitle}</div>
        </div>
        <div className="w-full">
          <div className="flex justify-end text-xs text-gray-medium">{adData.adEndedAt?.substring(0, 10)}까지 모집</div>
        </div>
      </div>
    </>
  );
};

export default AdSignboard;
