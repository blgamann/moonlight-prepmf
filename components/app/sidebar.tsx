"use client";

import { Home, Bell, Send, Sparkles, Activity } from "lucide-react";
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
        <Link href="/app">
          <Image src="/logo.svg" alt="Moonlight Logo" width={30} height={30} />
        </Link>
      </div>
      <div className="flex flex-col gap-12 items-center">
        <Link
          href="/app"
          className={`${
            isActive("/app")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Home
            className={`w-full h-full stroke-current fill-none ${
              isActive("/app") ? "stroke-white" : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            홈
          </div>
        </Link>
        <Link
          href="/match"
          className={`${
            isActive("/match")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Sparkles
            className={`w-full h-full stroke-current fill-none ${
              isActive("/match") ? "stroke-white" : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            소울연결
          </div>
        </Link>
        <Link
          href="/meet"
          className={`${
            isActive("/meet")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Activity
            className={`w-full h-full stroke-current fill-none ${
              isActive("/meet") ? "stroke-white" : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            소울만남
          </div>
        </Link>
        <Link
          href="/messages"
          className={`${
            isActive("/messages")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Send
            className={`w-full h-full stroke-current fill-none ${
              isActive("/messages")
                ? "stroke-white"
                : "group-hover:stroke-white"
            }`}
          />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            메시지
          </div>
        </Link>
        <Link
          href="/notifications"
          className={`${
            isActive("/notifications")
              ? "text-white scale-[1.3]"
              : "text-[#94a3b8] hover:text-white hover:scale-[1.3]"
          } w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out group relative`}
        >
          <Bell
            className={`w-full h-full stroke-current fill-none ${
              isActive("/notifications")
                ? "stroke-white"
                : "group-hover:stroke-white"
            }`}
          />
          <span className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] bg-[#ff6b6b] rounded-full"></span>
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            알림
          </div>
        </Link>
      </div>
    </aside>
  );
}
