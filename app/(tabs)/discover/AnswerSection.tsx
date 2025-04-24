"use client";

import Image from "next/image";
import Link from "next/link";

// Define data shapes for props
interface Book {
  id: string;
  title: string;
  imageUrl: string;
}

interface Question {
  id: string;
  book_id: string;
  question_text: string;
}

interface Answer {
  id: string;
  question_id: string;
  title: string;
  answer_text: string;
  date: string;
  // created_at: string; // Remove unused field
  // other answer fields if needed...
}

// Define component props interface
interface AnswerSectionProps {
  answer: Answer;
  question: Question;
  book?: Book | null;
}

// Define the AnswerSection component
export default function AnswerSection({
  answer,
  question,
  book,
}: AnswerSectionProps) {
  // Format date (Example: 2024-07-20 -> 2024. 07. 20.)
  const formattedDate = answer.date.replace(/-/g, ". ") + ".";

  return (
    <section className="max-w-[680px] mx-auto">
      {/* Answer Title */}
      <h2 className="text-4xl font-semibold text-white/90">{answer.title}</h2>

      {/* Book and Question Info Section - Added */}
      {book && (
        <div className="flex items-start space-x-4 border-b border-t border-white/30 py-8 my-8">
          <div className="flex-shrink-0">
            <Image
              src={book.imageUrl}
              alt={`${book.title} cover`}
              width={60}
              height={90}
              className="rounded object-cover"
            />
          </div>
          <div>
            <Link href={`/books/${book.id}`}>
              <span className="text-base text-white/65 hover:underline">
                {book.title}
              </span>
            </Link>
            <p className="text-lg mt-1 text-white/85">
              {question.question_text}
            </p>
          </div>
        </div>
      )}

      {/* Main Answer Text */}
      <p
        className={`text-xl text-white/85 mb-4 leading-relaxed whitespace-pre-line ${
          book ? "" : "mt-8"
        }`}
      >
        {answer.answer_text}
      </p>

      <div className="flex justify-between items-center ml-[-4px]">
        {/* Left: Favorite Button with Tooltip */}
        <div className="relative"></div>

        {/* Right: Date */}
        <p className="text-base text-white/65">{formattedDate}</p>
      </div>
    </section>
  );
}
