"use client";

import AnswerSection from "@/app/(tabs)/discover/AnswerSection";
import SoulLine from "@/app/(tabs)/discover/SoulLine";
import MutualBooks from "@/app/(tabs)/discover/MutualBooks";
import data from "@/data.json";
import Image from "next/image";

// TODO: Implement navigation logic (e.g., fetching next/previous answer)
const handleNext = () => {
  console.log("Navigate to next answer");
};

const handlePrevious = () => {
  console.log("Navigate to previous answer");
};

export default function ProfileAnswerDetailPage() {
  // TODO: Implement logic to get the specific answer based on params
  const user = data.profiles[0]; // Example: Get the first profile

  // Get the first answer related to the first user/book for now
  const answersToShow = data.book_answers
    .filter((ans) => ans.profile_id === user.id) // Filter answers by user for demo
    .slice(0, 1) // Take the first answer of this user
    .map((answer) => {
      const question = data.book_questions.find(
        (q) => q.id === answer.question_id
      );
      const book = data.books.find((b) => b.id === question?.book_id);
      // Find the actual user who wrote the answer
      const answerUser =
        data.profiles.find((prof) => prof.id === answer.profile_id) || user; // Fallback to the main user

      return { answer, question, book, answerUser };
    })
    .filter((item) => item.question && item.book); // Filter out items with missing question/book

  // Assuming we always find at least one answer for the demo
  const displayData = answersToShow[0];

  if (!displayData) {
    // Handle case where no data is found
    return <div>데이터를 불러오는 중이거나 표시할 답변이 없습니다.</div>;
  }

  const { answer, question, book, answerUser } = displayData;

  // Prepare sample data for SoulLine and MutualBooks
  const soulLineUsers = data.profiles
    .slice(0, 2)
    .map((p) => ({ name: p.name, imageUrl: p.imageUrl }));
  // For MutualBooks, let's find books the answerUser has answered about, or just take first 3 books as fallback
  const userAnswers = data.book_answers.filter(
    (ans) => ans.profile_id === answerUser.id
  );
  const userQuestionIds = userAnswers.map((ans) => ans.question_id);
  const userQuestions = data.book_questions.filter((q) =>
    userQuestionIds.includes(q.id)
  );
  const userBookIds = [...new Set(userQuestions.map((q) => q.book_id))]; // Use Set to get unique book IDs
  let mutualBooksData = data.books
    .filter((b) => userBookIds.includes(b.id))
    .map((b) => ({ title: b.title, imageUrl: b.imageUrl }));

  // Fallback if the user has no books in common or data is sparse
  if (mutualBooksData.length === 0) {
    mutualBooksData = data.books
      .slice(0, 3)
      .map((b) => ({ title: b.title, imageUrl: b.imageUrl }));
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Back Button, Question Text, and Book Cover */}
      <div className="flex items-center justify-between border-b border-white/30 px-6 py-2">
        {/* Back Button */}
        <div className="cursor-pointer text-white/65 text-lg font-medium py-4 w-5">
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
        </div>

        {/* Centered Profile Section */}
        <div className="flex items-center gap-2 flex-shrink-0 py-2">
          {/* Wrapper div for circular image */}
          <div className="w-[35px] h-[35px] rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={answerUser?.imageUrl || "/default-avatar.png"}
              alt={`${answerUser?.name || "사용자"} 프로필 이미지`}
              width={35}
              height={35}
              className="object-cover w-full h-full" // Fill the container
            />
          </div>
          <span className="text-white/65 text-base">
            {answerUser?.name || "사용자"}
          </span>
        </div>

        {/* Invisible Placeholder for centering */}
        <div className="w-5" aria-hidden="true"></div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-24 pt-20 pb-12">
        {/* Pass the actual user who wrote the answer */}

        {/* Render the specific AnswerSection */}
        <AnswerSection answer={answer} question={question!} book={book} />
        <div>
          {/* Add SoulLine and MutualBooks components */}
          <SoulLine users={soulLineUsers} />
          <MutualBooks books={mutualBooksData} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation onNext={handleNext} onPrevious={handlePrevious} />
    </div>
  );
}

// Define BottomNavigation component specific to this page or import if reused
function BottomNavigation({
  onNext,
  onPrevious,
}: {
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <div className="p-6 border-t border-white/30 flex justify-between items-center">
      <div
        onClick={onPrevious}
        className="text-white/65 text-lg font-medium flex items-center gap-2 hover:underline hover:cursor-pointer"
      >
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
        이전 답변
      </div>
      <div
        onClick={onNext}
        className="text-white/65 text-lg font-medium flex items-center gap-2 hover:underline hover:cursor-pointer"
      >
        다음 답변
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 mt-1"
        >
          <path
            fillRule="evenodd"
            d="M14.47 2.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L19.19 9.75H4.5a.75.75 0 0 1 0-1.5h14.69l-4.72-4.72a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
