import { Home, Users, MessageCircle, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-[72px] bg-[#111] border-r border-white/10 flex flex-col items-center pt-8 fixed h-screen z-10">
      <div className="mb-20">
        <Image src="/logo.svg" alt="Moonlight Logo" width={30} height={30} />
      </div>
      <div className="flex flex-col gap-12 items-center">
        <Link
          href="/app"
          className="text-[#94a3b8] w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out hover:text-white hover:scale-[1.3] group"
        >
          <Home className="w-full h-full stroke-current fill-none group-hover:stroke-white" />
        </Link>
        <Link
          href="/app/users"
          className="text-[#94a3b8] w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out hover:text-white hover:scale-[1.3] group"
        >
          <Users className="w-full h-full stroke-current fill-none group-hover:stroke-white" />
        </Link>
        <Link
          href="/app/messages"
          className="text-[#94a3b8] w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out hover:text-white hover:scale-[1.3] group"
        >
          <MessageCircle className="w-full h-full stroke-current fill-none group-hover:stroke-white" />
        </Link>
        <div className="text-[#94a3b8] w-[22px] h-[22px] cursor-pointer transition-all duration-300 ease-in-out hover:text-white hover:scale-[1.3] group relative">
          <Bell className="w-full h-full stroke-current fill-none group-hover:stroke-white" />
          <span className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] bg-[#ff6b6b] rounded-full"></span>
        </div>
      </div>
    </aside>
  );
}
