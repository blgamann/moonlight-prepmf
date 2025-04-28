"use client";

import {
  Bell,
  Sparkles,
  BookOpen,
  UserRound,
  Infinity,
  Moon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CollapsedSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  const navItems = [
    { href: "/discover", icon: Sparkles, label: "발견" },
    { href: "/garden", icon: BookOpen, label: "가든 검색" },
    { href: "/soullink", icon: Infinity, label: "소울링크" },
    { href: "/notification", icon: Bell, label: "알림" },
    { href: "/profile", icon: UserRound, label: "프로필" },
    { href: "/collection", icon: Moon, label: "나의 관심" },
  ];

  return (
    <aside className="w-[72px] bg-zinc-950 border-r border-white/5 flex flex-col items-center fixed pt-5 h-screen z-10">
      <div className="h-35">
        <Link href="/discover">
          <Image src="/logo.png" alt="moonlight Logo" width={30} height={30} />
          {/* <span className="font-['Nunito'] text-[#38d4e7] text-[1.5rem] font-bold tracking-[-0.2px]">
            m
          </span> */}
          {/* <span className="font-['GurmukhiMN'] text-[#38d4e7] text-[1.5rem] tracking-[-0.2px]">
            m
          </span> */}
        </Link>
      </div>
      <div className="flex flex-col gap-4.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-2 rounded-lg ${
                active
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
              } transition-all duration-200 ease-in-out group relative`}
            >
              <Icon
                className={`w-[22px] h-[22px] stroke-current fill-none ${
                  active ? "stroke-white" : "group-hover:stroke-white"
                }`}
              />
              <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-sm py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
