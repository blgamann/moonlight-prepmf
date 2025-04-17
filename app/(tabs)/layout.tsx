import Sidebar from "@/components/app/sidebar";

export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overscroll-none bg-white">
      <Sidebar />
      <div className="ml-[72px]">{children}</div>
    </div>
  );
}
