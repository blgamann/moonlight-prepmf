import { Label } from "./label";

export function Section({
  title,
  children,
  className,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border-t border-white/15 py-8 ${className || ""}`}>
      <Label className="mb-8">{title}</Label>
      {children}
    </div>
  );
}
