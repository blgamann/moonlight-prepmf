export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-zinc-950">
      <div>{children}</div>
    </div>
  );
}
