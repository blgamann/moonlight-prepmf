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

export default function ExpandedSidebar() {
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
    { href: "/collection", icon: Library, label: "나의 관심" },
  ];

  return (
    <aside className="w-[336px] bg-zinc-950 border-r border-white/30 flex flex-col pt-8 fixed h-screen z-10 px-6">
      <div className="mb-20 pl-2">
        {/* Consider using a larger or different logo version for expanded state */}
        <Link href="/discover" className="flex items-center gap-2">
          {/* <Image src="/logo.svg" alt="moonlight Logo" width={38} height={38} /> */}
          {/* <span className="font-['Nunito'] text-[#38d4e7] text-[1.5rem] font-bold tracking-[-0.2px]">
            moonlight
          </span> */}
          <span className="font-['GurmukhiMN'] text-[#38d4e7] text-[1.5rem] tracking-[-0.2px]">
            moonlight
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-5 px-3 py-3 rounded-lg ${
                active
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
              } transition-all duration-200 ease-in-out group relative`}
            >
              <Icon
                className={`w-[28px] h-[28px] stroke-current fill-none ${
                  active ? "stroke-white" : "group-hover:stroke-white"
                }`}
              />
              <span className="text-lg font-medium flex-1">{item.label}</span>
              {item.href === "/notification" && (
                <span className="w-[8px] h-[8px] bg-[#6ABECF] rounded-full mr-1"></span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
