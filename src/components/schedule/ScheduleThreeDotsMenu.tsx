"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSchedule } from "@/services/schedule.service";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

interface ScheduleActionsProps {
  scheduleId: number;
  meetupId: number;
}

const ScheduleActions = ({ scheduleId, meetupId }: ScheduleActionsProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setMenuOpen(false);
    router.push(`/meetup/${meetupId}/schedule/${scheduleId}/edit`);
  };

  const handleDeleteClick = async () => {
    if (window.confirm("정말로 이 스케줄을 삭제하시겠습니까?")) {
      try {
        setIsDeleting(true);
        await deleteSchedule(scheduleId);

        queryClient.invalidateQueries({ queryKey: ["schedules", meetupId] });

        router.refresh();
      } catch (err) {
        console.error("스케줄 삭제 오류 발생:", err);
        alert("스케줄 삭제에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsDeleting(false);
        setMenuOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-1 rounded-full  focus:outline-none"
        aria-label="스케줄 메뉴"
      >
        <BsThreeDotsVertical className="text-gray-600" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white z-10">
          <div className="py-1">
            <button
              onClick={handleEditClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiEdit className="mr-2" /> 수정하기
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <FiTrash2 className="mr-2" />
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleActions;