"use client";

import React from "react";
import { Meetup } from "@/types/meetupType";

const AdSignboard = ({ adData }: { adData: Meetup }) => {
  return (
    <>
      {}
      <div className="w-full flex-col border-b-[0.1rem] border-gray-medium md:mt-[2rem] md:grid md:grid-cols-2 md:pb-[1rem]">
        <div className="mx-auto flex w-[95%] py-[1rem] text-lg md:max-w-[90rem] md:py-[0.5rem] md:text-[18px]">{adData.adTitle}</div>
        <div className="mx-auto flex w-[95%] justify-end py-[0.5rem] text-xs text-gray-medium md:max-w-[90rem] md:py-0 md:pt-[0.6rem] md:text-[16px]">
          {adData.adEndedAt?.substring(0, 10)}까지 모집
        </div>
        {}
      </div>
    </>
  );
};

export default AdSignboard;
