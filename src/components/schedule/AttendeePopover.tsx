"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Participant } from "@/types/scheduleType";

interface AttendeePopoverProps {
  participants: Participant[];
}

const AttendeePopover = ({ participants }: AttendeePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지하여 팝오버 닫기
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

  // 참가자가 없는 경우
  if (!participants || participants.length === 0) {
    return <div className="text-gray-500">참석자 없음</div>;
  }

  // 참석자 정보 표시 텍스트 생성
  const displayAttendee = participants.length === 1
    ? participants[0].nickname
    : `${participants[0].nickname} 외 ${participants.length - 1}인 참석`;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {participants[0].image ? (
            <Image
              src={participants[0].image}
              alt={participants[0].nickname}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              {participants[0].nickname.charAt(0)}
            </div>
          )}
        </div>
        <span>{displayAttendee}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10 p-2">
          <div className="py-1">
            <div className="max-h-60 overflow-y-auto">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center px-3 py-2 hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                    {participant.image ? (
                      <Image
                        src={participant.image}
                        alt={participant.nickname}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {participant.nickname.charAt(0)}
                      </div>
                    )}
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