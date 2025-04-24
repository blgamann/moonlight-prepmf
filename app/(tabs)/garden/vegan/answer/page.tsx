import { Infinity, MessageSquare } from "lucide-react"; // Assuming lucide-react for icons
import jsonData from "@/data.json"; // Corrected import path relative to component
import AnswerCard from "@/components/AnswerCard"; // Import the new component

// Type definitions (consider moving to a separate types file)
interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  bio?: string; // Optional based on JSON structure
}

interface BookQuestion {
  id: string;
  book_id: string;
  question_text: string;
  question_context?: string; // Optional
}

interface BookAnswer {
  id: string;
  question_id: string;
  title: string;
  answer_text: string;
  date?: string; // Optional
  profile_id: string;
}

// Data processing
const { book_questions, book_answers, profiles } = jsonData as {
  book_questions: BookQuestion[];
  book_answers: BookAnswer[];
  profiles: Profile[];
};

const QUESTION_ID = "q-sh-1";

const question = book_questions.find((q) => q.id === QUESTION_ID);
const relevantAnswers = book_answers.filter(
  (a) => a.question_id === QUESTION_ID
);

export default function VeganAnswerPage() {
  if (!question) {
    return <div>Question not found.</div>; // Handle case where question doesn't exist
  }

  return (
    // Apply discover page main container style - remove h-screen
    <div className="flex flex-col max-w-[680px] mx-auto bg-zinc-950 text-white pt-12">
      {/* Header adapted from discover page style */}
      <div className="text-white/65 text-lg font-medium flex items-center gap-2 hover:underline hover:cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 mt-1"
        >
          <path
            fillRule="evenodd"
            d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H19.5a.75.75 0 0 1 0 1.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        채식주의자
      </div>

      {/* Content area adapted from discover page style - remove flex-grow overflow-y-auto */}
      <div className="flex flex-col mt-12 pb-12">
        {" "}
        {/* Added padding bottom */}
        {/* Question Section */}
        <div>
          <h2 className="text-xl text-white/90 font-['NanumMyeongjo']">
            {question.question_text} {/* Use question text from JSON */}
          </h2>
          {/* Metadata - Use dynamic answer count from data.json */}
          <div className="flex gap-4 justify-end mt-4 mr-3">
            <div className="flex items-center gap-1.5">
              {" "}
              {/* Added margin top */}
              <MessageSquare className="w-4 h-4 text-[#999]" />
              <span className="text-base text-[#999]">50</span>
            </div>
            <div className="flex items-center gap-1.5">
              {" "}
              {/* Added margin top */}
              <Infinity className="w-6 h-6 text-[#999]" />
              <span className="text-base text-[#999]">4</span>
            </div>
          </div>
        </div>
        {/* Display all relevant answers using AnswerCard */}
        <div className="flex flex-col mt-12 border-b border-t border-white/30">
          {relevantAnswers.map((answer) => {
            const profile = profiles.find((p) => p.id === answer.profile_id);
            if (!profile) return null; // Skip if profile not found

            return (
              <AnswerCard
                key={answer.id}
                imageUrl={profile.imageUrl}
                name={profile.name}
                title={answer.title}
                answerText={answer.answer_text}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
