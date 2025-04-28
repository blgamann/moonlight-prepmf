import { MessageSquare, Infinity } from "lucide-react";

export function BadgeAnswerCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <MessageSquare className="w-4 h-4 text-white/60" />
      <span className="text-base text-white/60">{count}</span>
    </div>
  );
}

export function BadgeSoulinkCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Infinity className="w-4 h-4 text-white/60" />
      <span className="text-base text-white/60">{count}</span>
    </div>
  );
}
