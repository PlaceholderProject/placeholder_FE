"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaHome, FaPlus, FaTimes, FaUser, FaUsers } from "react-icons/fa";

const HamburgerMenu = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navItems = [
    { href: "/", icon: FaHome, label: "홈", isActive: pathname === "/" },
    {
      href: "/my-space/my-meetup",
      icon: FaUsers,
      label: "내 공간",
      isActive: pathname.startsWith("/my-space"),
    },
    {
      href: "/meetup/create",
      icon: FaPlus,
      label: "모임 만들기",
      isActive: pathname === "/meetup/create",
    },
    {
      href: "/account",
      icon: FaUser,
      label: "계정 관리",
      isActive: pathname.startsWith("/account"),
    },
  ];

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {}
      <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-white transition-colors hover:text-gray-200">
        <FaBars />
      </button>

      {}
      {menuOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300" onClick={() => setMenuOpen(false)} />}

      {}
      <div
        ref={menuRef}
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {}
        <div className="flex items-center justify-between border-b p-6">
          <button onClick={() => setMenuOpen(false)} className="text-gray-500 transition-colors hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        {}
        <nav className="mt-6">
          {navItems.map(item => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                className={`flex items-center px-6 py-4 text-base transition-colors ${item.isActive ? "bg-blue-50 text-[#006B8B]" : "text-gray-700 hover:border-gray-300 hover:bg-gray-50"}`}
              >
                <IconComponent className="mr-3" size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
