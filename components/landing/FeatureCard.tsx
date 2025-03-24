interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({
  title,
  description,
  className = "",
}: FeatureCardProps) => {
  return (
    <div
      className={`
      bg-white/5 
      p-6 
      rounded-[15px] 
      border border-white/10
      ${className}
    `}
    >
      <h3 className="text-[#6dd1e4] text-[1.2rem] mb-2 font-normal">{title}</h3>
      <p className="text-[#888] text-[0.95rem]">{description}</p>
    </div>
  );
};
