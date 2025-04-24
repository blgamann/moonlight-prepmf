import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AnswerCardProps {
  imageUrl: string;
  name: string;
  title: string;
  answerText: string;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  imageUrl,
  name,
  title,
  answerText,
}) => {
  return (
    <div className="flex items-start space-x-6 py-8 border-b border-white/30 last:border-b-0">
      {/* Container for Image and Name */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-black">
          {/* Placeholder Image - Replace with actual Image component and src */}
          <Image
            src={imageUrl || "/placeholder-profile.png"} // Added fallback
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            // Add placeholder style if needed
            // style={{ filter: 'blur(5px)' }}
          />
        </div>
        {/* Name below the image */}
        <span className="text-base text-white/80 mt-2 w-16 text-center truncate cursor-pointer hover:underline">
          {name}
        </span>
      </div>

      {/* Container for Title and Answer Text */}
      <div className="flex flex-col flex-1 overflow-hidden mt-1">
        <Link href="/garden/vegan/answer-detail">
          <span className="text-xl font-semibold text-white/90 cursor-pointer hover:underline">
            {title}
          </span>
        </Link>
        <p className="text-base text-white/65 mt-2 leading-relaxed line-clamp-2">
          {answerText}
        </p>
      </div>
    </div>
  );
};

export default AnswerCard;
