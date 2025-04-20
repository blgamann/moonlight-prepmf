"use client";

import { useState } from "react";
import data from "@/data.json"; // Import the data
import UserInfoSection from "../discover/UserInfoSection"; // Adjust path as needed
import AnswerSection from "../discover/AnswerSection"; // Adjust path as needed
import BookInfo from "../discover/BookInfo"; // Adjust path as needed
import { Star } from "lucide-react"; // Import the Star icon
import UserRelationSection from "../discover/UserRelationSection"; // Import the relation section

// --- Define Interfaces (Copied from discover/page.tsx for consistency) ---
/* interface UserProfile {
  profile_id: string;
  name: string;
  imageUrl: string;
  bio?: string;
} */ // Commented out as it's unused locally, assuming UserInfoSection defines its own prop type

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

interface Question {
  id: string;
  question_text: string;
  book_id: string; // Added book_id for linking
  question_context: string; // Added question_context property
}

interface Answer {
  id: string;
  title: string;
  answer_text: string;
  question_id: string; // Added question_id for linking
  profile_id: string; // Added profile_id
  date: string; // Added date property
}

// Define a type for the combined data needed for display
interface UserAnswerData {
  answer: Answer;
  question: Question;
  book: Book;
}

// --- Define CommonBooksInfo Interface needed for UserRelationSection ---
interface CommonBookDetail {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

interface CommonBooksInfo {
  books: CommonBookDetail[];
}
// ---------------------------------------------

// --- Profile Page Logic ---
export default function ProfilePage() {
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [isInterested, setIsInterested] = useState(false); // State for interest button
  const [showInterestTooltip, setShowInterestTooltip] = useState(false); // State for tooltip visibility

  // Define the current user ID (김민준)
  const myProfileId = "profile-1";

  // Find the current user's profile data
  const myProfile = data.profiles.find((profile) => profile.id === myProfileId);

  // Filter the user's answers
  const myAnswersRaw = data.book_answers.filter(
    (answer) => answer.profile_id === myProfileId
  );

  // Limit to the first 3 answers as requested
  const myAnswersLimited = myAnswersRaw.slice(0, 3);

  // Combine answer with corresponding question and book data
  const myDisplayableAnswers: UserAnswerData[] = myAnswersLimited
    .map((answer) => {
      const question = data.book_questions.find(
        (q) => q.id === answer.question_id
      );
      if (!question) return null; // Handle case where question is not found

      const book = data.books.find((b) => b.id === question.book_id);
      if (!book) return null; // Handle case where book is not found

      // Explicitly cast the answer and question to the correct interface type
      return {
        answer: answer as Answer,
        question: question as Question,
        book: book as Book,
      };
    })
    .filter((item): item is UserAnswerData => item !== null); // Filter out nulls

  const totalAnswers = myDisplayableAnswers.length;

  // Create CommonBooksInfo based on the books from the displayed answers
  const myBooks = myDisplayableAnswers.map((data) => data.book);
  // Remove duplicates - Ensure mapping to CommonBookDetail structure if needed
  const uniqueBooks: CommonBookDetail[] = Array.from(
    new Map(
      myBooks.map((book) => [
        book.id,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
        },
      ])
    ).values()
  );
  const myBooksInfo: CommonBooksInfo | undefined =
    uniqueBooks.length > 0 ? { books: uniqueBooks } : undefined;

  // --- Navigation Handlers ---
  const handlePreviousAnswer = () => {
    setCurrentAnswerIndex((prevIndex) =>
      prevIndex === 0 ? totalAnswers - 1 : prevIndex - 1
    );
  };

  const handleNextAnswer = () => {
    setCurrentAnswerIndex((prevIndex) =>
      prevIndex === totalAnswers - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the current answer data object to display
  const currentDisplayData = myDisplayableAnswers[currentAnswerIndex];

  // Handle cases where data might be missing
  if (!myProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Profile not found.
      </div>
    );
  }

  if (totalAnswers === 0 && !currentDisplayData) {
    // Adjusted condition
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="max-w-[680px] mx-auto w-full flex-grow pt-12">
          {/* User Info Section */}
          <UserInfoSection
            user={myProfile}
            booksReadCount={myAnswersRaw.length}
          />
          {/* Action Buttons - Aligned Right */}
          <div className="flex space-x-2 mt-4 justify-end items-center">
            {/* Interest Button with Tooltip */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsInterested(!isInterested);
                  // Add logic here to persist the interest status (e.g., API call)
                  console.log("Interest toggled:", !isInterested);
                }}
                onMouseEnter={() => setShowInterestTooltip(true)}
                onMouseLeave={() => setShowInterestTooltip(false)}
                className={`p-2 rounded-full focus:outline-none ${
                  isInterested
                    ? "bg-yellow-900 text-yellow-500"
                    : "bg-gray-800 hover:bg-gray-700 text-yellow-500"
                }`}
                aria-label={
                  isInterested ? "프로필 관심 해제" : "프로필 관심 등록"
                }
              >
                <Star
                  className="h-5 w-5"
                  fill={isInterested ? "currentColor" : "none"}
                  aria-hidden="true"
                />
              </button>
              {showInterestTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                  {isInterested ? "프로필 관심 해제" : "프로필 관심 등록"}
                </div>
              )}
            </div>

            {/* SoulLink Button */}
            <button
              onClick={() => console.log("SoulLink button clicked")}
              className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white text-sm"
              title="소울링크 정보 보기"
            >
              소울링크 띄우기
            </button>
          </div>
          <p className="text-center text-gray-400 mt-8">
            작성한 답변이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  if (!currentDisplayData) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Error loading answer data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content Area */}
      <div className="max-w-[680px] mx-auto w-full flex-grow pt-12 pb-24">
        {/* User Info Section */}
        <UserInfoSection
          user={myProfile}
          booksReadCount={myAnswersRaw.length}
        />

        {/* Action Buttons - Aligned Right */}
        <div className="flex space-x-2 mt-4 justify-end items-center">
          {/* Interest Button with Tooltip */}
          <div className="relative">
            <button
              onClick={() => {
                setIsInterested(!isInterested);
                // Add logic here to persist the interest status (e.g., API call)
                console.log("Interest toggled:", !isInterested);
              }}
              onMouseEnter={() => setShowInterestTooltip(true)}
              onMouseLeave={() => setShowInterestTooltip(false)}
              className={`p-2 rounded-full focus:outline-none ${
                isInterested
                  ? "bg-yellow-900 text-yellow-500"
                  : "bg-gray-800 hover:bg-gray-700 text-yellow-500"
              }`}
              aria-label={
                isInterested ? "프로필 관심 해제" : "프로필 관심 등록"
              }
            >
              <Star
                className="h-5 w-5"
                fill={isInterested ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
            {showInterestTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                {isInterested ? "프로필 관심 해제" : "프로필 관심 등록"}
              </div>
            )}
          </div>

          {/* SoulLink Button */}
          <button
            onClick={() => console.log("SoulLink button clicked")}
            className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white text-sm"
            title="소울링크 정보 보기"
          >
            소울링크 띄우기
          </button>
        </div>

        {/* Answer Section */}
        <AnswerSection answer={currentDisplayData.answer} />

        {/* Context Area (Question & Book) */}
        <div className="flex items-start space-x-6 border-t border-gray-700 pt-6 mt-8">
          {/* Left: Context Text (Question only) */}
          <div className="flex flex-col flex-grow pt-1">
            <p className="text-base text-gray-300">
              {currentDisplayData.question.question_text}
            </p>
          </div>
          {/* Right: Book Cover and Info */}
          <BookInfo book={currentDisplayData.book} />
        </div>

        {/* Answer Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePreviousAnswer}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm disabled:opacity-50"
            disabled={totalAnswers <= 1}
          >
            이전 답변
          </button>
          <span className="text-sm text-gray-400">
            {currentAnswerIndex + 1} / {totalAnswers}
          </span>
          <button
            onClick={handleNextAnswer}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm disabled:opacity-50"
            disabled={totalAnswers <= 1}
          >
            다음 답변
          </button>
        </div>

        {/* User Relation Section (Added at the bottom) */}
        {/* Displaying user's books from displayed answers */}
        {myProfile && (
          <UserRelationSection
            viewingUser={{ ...myProfile, profile_id: myProfile.id }} // Map id to profile_id
            targetUser={{ ...myProfile, profile_id: myProfile.id }} // Map id to profile_id
            connectionInfo={undefined} // No specific connection path on own profile
            commonBooksInfo={myBooksInfo} // Pass the user's books
          />
        )}
      </div>
    </div>
  );
}
