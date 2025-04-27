export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/15 py-8">
      <h2 className="text-xl font-semibold mb-8 text-white/95">{title}</h2>
      {children}
    </div>
  );
}
