"use client";

import { Bell, Sparkles, Activity, BookOpen, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <aside className="w-[72px] bg-[#111] border-r border-white/10 flex flex-col items-center pt-8 fixed h-screen z-10">
      <div className="mb-20">
        <Link href="/discover">
          <Image src="/logo.svg" alt="moonlight Logo" width={30} height={30} />
        </Link>
      </div>
      <div className="flex flex-col gap-12 items-center">
        <Link
          href="/discover"
          className={`${
            isActive("/discover")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Sparkles
            className={`w-full h-full stroke-current fill-none ${
              isActive("/discover")
                ? "stroke-white"
                : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            발견
          </div>
        </Link>
        <Link
          href="/garden"
          className={`${
            isActive("/garden")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <BookOpen
            className={`w-full h-full stroke-current fill-none ${
              isActive("/garden") ? "stroke-white" : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            가든
          </div>
        </Link>
        <Link
          href="/soullink"
          className={`${
            isActive("/soullink")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Activity
            className={`w-full h-full stroke-current fill-none ${
              isActive("/soullink")
                ? "stroke-white"
                : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            소울링크
          </div>
        </Link>
        <Link
          href="/notification"
          className={`${
            isActive("/notification")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Bell
            className={`w-full h-full stroke-current fill-none ${
              isActive("/notification")
                ? "stroke-white"
                : "group-hover:stroke-white"
            }`}
          />
          <span className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] bg-[#ff6b6b] rounded-full"></span>
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            알림
          </div>
        </Link>
        <Link
          href="/profile"
          className={`${
            isActive("/profile")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <UserRound
            className={`w-full h-full stroke-current fill-none ${
              isActive("/profile") ? "stroke-white" : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            프로필
          </div>
        </Link>
      </div>
    </aside>
  );
}
