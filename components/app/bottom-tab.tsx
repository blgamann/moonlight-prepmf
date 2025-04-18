"use client";

import {
  Bell,
  Sparkles,
  Activity,
  BookOpen,
  UserRound,
  Library,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTab() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  const navItems = [
    { href: "/discover", icon: Sparkles, label: "발견" },
    { href: "/garden", icon: BookOpen, label: "가든 검색" },
    { href: "/soullink", icon: Activity, label: "소울링크" },
    { href: "/notification", icon: Bell, label: "알림" },
    { href: "/profile", icon: UserRound, label: "프로필" },
    { href: "/collection", icon: Library, label: "나의 모음" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#111] border-t border-white/10 flex justify-around items-center z-10 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              active ? "text-white" : "text-[#94a3b8] hover:text-white"
            } transition-colors duration-200 relative`}
          >
            <Icon
              className={`w-[20px] h-[20px] stroke-current fill-none ${
                active ? "stroke-white" : ""
              }`}
            />
            <span className="text-[10px]">{item.label}</span>
            {item.href === "/notification" && (
              <span className="absolute top-0 right-0 w-[6px] h-[6px] bg-[#ff6b6b] rounded-full"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
