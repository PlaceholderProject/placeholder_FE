"use client";

import React from "react";
import { Meetup } from "@/types/meetupType";

const AdSignboard = ({ adData }: { adData: Meetup }) => {
  return (
    <>
      {/* <div className="mx-auto mt-[2rem] w-[95%] space-y-[0.5rem] md:max-w-[90rem]">
        <div className="w-full">
          <div className="flex justify-start text-lg">{adData.adTitle}</div>
        </div>
        <div className="w-full">
          <div className="flex justify-end text-xs text-gray-medium">{adData.adEndedAt?.substring(0, 10)}까지 모집</div>
        </div>
      </div>
    </> */}
      <div className="border-border w-full flex-col border-b md:mt-[2rem] md:grid md:grid-cols-2 md:items-center md:pb-[1rem]">
        <div className="mx-auto flex w-[95%] py-[1rem] text-lg font-semibold md:max-w-[90rem] md:py-[0.5rem] md:text-[18px]">{adData.adTitle}</div>
        <div className="mx-auto flex w-[95%] justify-end py-[0.5rem] md:max-w-[90rem] md:py-0">
          <span className="bg-accent text-accent-foreground rounded-full px-[0.9rem] py-[0.3rem] text-xs font-medium">{adData.adEndedAt?.substring(0, 10)}까지 모집</span>
        </div>
      </div>
    </>
  );
};

export default AdSignboard;
