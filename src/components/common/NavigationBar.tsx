"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaArrowUp, FaHome, FaPlus, FaUser, FaUsers } from "react-icons/fa";

const NavigationBar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      icon: FaHome,
      label: "홈",
      isActive: pathname === "/",
    },
    {
      href: "/my-space/my-meetup",
      icon: FaUsers,
      label: "내 공간",
      isActive: pathname.startsWith("/my-space"),
    },
    {
      href: "/meetup-create",
      icon: FaPlus,
      label: "모임 만들기",
      isActive: pathname === "/meetup-create",
    },
    {
      href: "/account",
      icon: FaUser,
      label: "계정 관리",
      isActive: pathname.startsWith("/account"),
    },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-[#FEFFEC] lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rem:1.4 flex flex-col items-center rounded-lg p-2 transition-colors ${item.isActive ? "text-[#006B8B]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <IconComponent size={24} />
              <span className="mt-1 text-xs">{item.label}</span>
            </Link>
          );
        })}

        <button onClick={handleScrollToTop} className="flex flex-col items-center rounded-lg p-2 text-gray-500 transition-colors hover:text-gray-700">
          <FaArrowUp size={24} />
          <span className="mt-1 text-xs">맨 위로</span>
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
