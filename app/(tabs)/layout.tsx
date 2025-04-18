export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overscroll-none bg-white">
      {/* <CollapsedSidebar /> */}
      {/* The main layout now handles sidebar rendering */}
      {/* The padding is handled in the main layout */}
      <div>{children}</div>
    </div>
  );
}
