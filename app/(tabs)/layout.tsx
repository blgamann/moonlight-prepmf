import Sidebar from "@/components/app/sidebar";
import Header from "@/components/app/header";

export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overscroll-none bg-black">
      <Sidebar />
      <div className="ml-[72px]">{children}</div>
    </div>
  );
}
