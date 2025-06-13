"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDeleteSchedule } from "@/hooks/useSchedule";

interface ScheduleThreeDotsMenuProps {
  scheduleId: number;
  meetupId: number;
}

const ScheduleThreeDotsMenu = ({ scheduleId, meetupId }: ScheduleThreeDotsMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const deleteScheduleMutation = useDeleteSchedule(meetupId);

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

  const handleDeleteClick = () => {
    if (window.confirm("정말로 이 스케줄을 삭제하시겠습니까?")) {
      deleteScheduleMutation.mutate(scheduleId, {
        onSuccess: () => {
          router.refresh();
          setMenuOpen(false);
        },
        onError: () => {
          alert("스케줄 삭제 실패");
        },
      });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-1 focus:outline-none" aria-label="스케줄 메뉴">
        <BsThreeDotsVertical className="text-gray-600" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-10 mt-1 w-36 rounded-md bg-white shadow-lg">
          <div className="py-1">
            <button onClick={handleEditClick} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FiEdit className="mr-2" /> 수정하기
            </button>
            <button onClick={handleDeleteClick} disabled={deleteScheduleMutation.isPending} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <FiTrash2 className="mr-2" />
              {deleteScheduleMutation.isPending ? "삭제 중..." : "삭제하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleThreeDotsMenu;
