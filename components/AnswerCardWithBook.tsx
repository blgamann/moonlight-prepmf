import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AnswerCardWithBookProps {
  bookCoverUrl: string;
  title: string;
  answerText: string;
}

const AnswerCardWithBook: React.FC<AnswerCardWithBookProps> = ({
  bookCoverUrl,
  title,
  answerText,
}) => {
  return (
    <div className="flex items-center space-x-6 py-8 border-b border-white/30 last:border-b-0">
      {/* Container for Book Cover */}
      <div className="flex-shrink-0">
        <div className="relative w-15 h-22 overflow-hidden bg-zinc-700 rounded">
          {/* Placeholder Book Cover */}
          <Image
            src={bookCoverUrl || "/placeholder-book.png"} // Use book cover URL or fallback
            alt={`Cover for ${title}`} // Alt text using the answer title
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      </div>

      {/* Container for Title and Answer Text */}
      <div className="flex flex-col flex-1 overflow-hidden mt-1">
        {/* Link might need adjustment based on actual routing */}
        <Link href="/profile/answer/detail">
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

export default AnswerCardWithBook;
