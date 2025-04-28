export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-xl font-semibold text-white/95 ${className || ""}`}
    >
      {children}
    </h2>
  );
}
