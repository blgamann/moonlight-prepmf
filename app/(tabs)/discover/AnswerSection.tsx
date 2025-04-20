"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";

// Define data shapes for props
interface Answer {
  title: string;
  answer_text: string;
  // created_at: string; // Remove unused field
  // other answer fields if needed...
}

// Define component props interface
interface AnswerSectionProps {
  answer: Answer;
  // question: Question; // Remove question prop
}

// Define the AnswerSection component
export default function AnswerSection({ answer }: AnswerSectionProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Add logic here to persist the favorite status (e.g., API call)
  };

  return (
    <section className="mt-10">
      {/* Answer Title */}
      <h2 className="text-2xl font-semibold text-white mb-4">{answer.title}</h2>

      {/* Main Answer Text */}
      <p className="text-xl text-gray-200 mb-4 leading-relaxed">
        {answer.answer_text}
      </p>

      <div className="flex justify-between items-center mb-8 ml-[-4px]">
        {/* Left: Favorite Button with Tooltip */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleFavorite}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`p-1 rounded-full focus:outline-none ${
              isFavorited
                ? "text-blue-500"
                : "text-gray-400 hover:text-blue-500"
            }`}
            aria-label={isFavorited ? "Remove from inbox" : "Add to inbox"}
          >
            <Inbox
              className="h-6 w-6"
              fill={isFavorited ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
              답변 보관
            </div>
          )}
        </div>

        {/* Right: Date */}
        <p className="text-base text-gray-500">
          2025. 04. 19. {/* Display fixed date */}
        </p>
      </div>

      {/* Context Area (Book & Question) - Removed */}
      {/* <div className="flex items-start space-x-6 border-t border-gray-700 pt-6">
        <div className="flex flex-col flex-grow pt-1">
          <p className="text-base text-gray-300">{question.question_text}</p>
        </div>
      </div> */}
    </section>
  );
}
