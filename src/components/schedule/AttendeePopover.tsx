"use client";

import { useEffect, useRef, useState } from "react";
import { Participant } from "@/types/scheduleType";
import Image from "next/image";
import { getS3ImageURL } from "@/utils/getImageURL";

interface AttendeePopoverProps {
  participants: Participant[];
}

const AttendeePopover = ({ participants }: AttendeePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (!participants || participants.length === 0) {
    return <div className="text-gray-500">참석자 없음</div>;
  }
  const displayAttendee = participants.length === 1 ? participants[0].nickname : `${participants[0].nickname} 외 ${participants.length - 1}인 참석`;

  return (
    <div className="relative" ref={popoverRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex cursor-pointer items-center space-x-2 text-gray-700 hover:text-gray-900">
        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          <Image src={getS3ImageURL(participants[0].image)} alt={participants[0].nickname} width={32} height={32} className="h-full w-full object-cover" />
        </div>
        <span>{displayAttendee}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-56 rounded-md bg-white p-2 shadow-lg">
          <div className="py-1">
            <div className="max-h-60 overflow-y-auto">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center px-3 py-2 hover:bg-gray-100">
                  <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    <Image src={getS3ImageURL(participant.image)} alt={participant.nickname} width={32} height={32} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-sm text-gray-700">{participant.nickname}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeePopover;
