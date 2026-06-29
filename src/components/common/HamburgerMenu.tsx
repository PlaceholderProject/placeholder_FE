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

    // ESC 키로 메뉴 닫기
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // 메뉴가 열렸을 때 스크롤 방지
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
      {/* 햄버거 메뉴 버튼 */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-white transition-colors hover:text-gray-200">
        <FaBars />
      </button>

      {/* 오버레이 배경 */}
      {menuOpen && <div className="bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity duration-300" onClick={() => setMenuOpen(false)} />}

      {/* 사이드바 메뉴 */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* 헤더 */}
        <div className="border-border flex items-center justify-between border-b p-6">
          <button onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* 메뉴 아이템들 */}
        <nav className="mt-6">
          {navItems.map(item => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                className={`flex items-center px-6 py-4 text-base transition-colors ${item.isActive ? "text-primary bg-primary-soft" : "text-foreground hover:bg-muted"}`}
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
