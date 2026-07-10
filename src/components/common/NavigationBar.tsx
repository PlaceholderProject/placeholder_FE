"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCompass, LuPlus, LuSearch } from "react-icons/lu";

const NavigationBar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: LuCompass, label: "둘러보기", isActive: pathname === "/" },
    { href: "/meetup/create", icon: LuPlus, label: "만들기", isActive: pathname === "/meetup/create", isAction: true },
    { href: "/search", icon: LuSearch, label: "검색", isActive: pathname.startsWith("/search") },
  ];

  return (
    <nav
      className="border-border bg-card/94 fixed right-[1.4rem] bottom-[calc(0.8rem+env(safe-area-inset-bottom))] left-[1.4rem] z-50 rounded-[1.8rem] border px-[0.6rem] shadow-[0_1.2rem_3rem_-1.8rem_rgba(24,23,29,0.32)] backdrop-blur-2xl md:hidden"
      aria-label="하단 메뉴"
    >
      <div className="mx-auto grid h-[6rem] max-w-[42rem] grid-cols-3 items-center">
        {navItems.map(item => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? "page" : undefined}
              className={`group flex h-[5rem] flex-col items-center justify-center gap-[0.2rem] rounded-[1.4rem] px-[0.5rem] text-xs font-bold transition-colors ${
                item.isAction ? "text-foreground" : item.isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`grid place-items-center transition-all ${
                  item.isAction
                    ? "bg-primary text-primary-foreground h-[3.6rem] w-[3.6rem] rounded-full shadow-[0_0.8rem_1.8rem_-1rem_rgba(108,77,255,0.72)] group-active:scale-95"
                    : "h-[3rem] w-[4.2rem] rounded-full"
                }`}
              >
                <Icon className={`${item.isAction ? "h-[2.1rem] w-[2.1rem]" : "h-[2rem] w-[2rem]"} stroke-[2]`} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;
