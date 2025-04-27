"use client";

import { useRouter, usePathname } from "next/navigation";
import { MoveLeft } from "lucide-react";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="ml-8 mt-8">
      {pathname !== "/moonlight-components" && (
        <button
          onClick={() => router.push("/moonlight-components")}
          className="hover:cursor-pointer mb-4"
        >
          <MoveLeft size={60} color="gray" />
        </button>
      )}
      <main>{children}</main>
    </div>
  );
}
