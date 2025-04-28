"use client";

import { usePathname } from "next/navigation";
import BottomTab from "@/components/app/bottom-tab";
import CollapsedSidebar from "@/components/app/collapsed-sidebar";
import ExpandedSidebar from "@/components/app/expanded-sidebar";

export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isRoot = pathname === "/";

  return (
    <>
      {!isRoot && <BottomTab />}
      {!isRoot && (
        <div className="hidden md:block xl:hidden">
          <CollapsedSidebar />
        </div>
      )}
      {!isRoot && (
        <div className="hidden xl:block">
          {/* <ExpandedSidebar /> */}
          <CollapsedSidebar />
        </div>
      )}
      <main
        className={isRoot ? "" : "pb-[60px] md:pb-0 md:pl-[72px] xl:pl-[72px]"}
      >
        {children}
      </main>
    </>
  );
}
