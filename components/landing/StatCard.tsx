interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard = ({ value, label, className = "" }: StatCardProps) => {
  return (
    <div className={`${className}`}>
      <div className="text-[#6dd1e4] text-[2.5rem] font-bold">{value}</div>
      <div className="text-[#888] text-[0.9rem]">{label}</div>
    </div>
  );
};
