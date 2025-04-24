"use client";

import { useState, useRef, useEffect } from "react";
import UserInfoSection from "./UserInfoSection";
import AnswerSection from "./AnswerSection";
import SoulLine from "./SoulLine";
import MutualBooks from "./MutualBooks";
import data from "@/data.json";

export default function DiscoverPage() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const user = data.profiles[currentProfileIndex];

  const soulLineUsers = [
    { name: "나", imageUrl: user.imageUrl },
    ...data.profiles.filter((p) => p.id !== user.id).slice(0, 2),
  ];

  const mutualBooksData = data.books.slice(0, 3).map((book) => ({
    title: book.title,
    imageUrl: book.imageUrl,
  }));

  const answersToShow = data.book_answers
    .filter((answer) => answer.profile_id === user.id)
    .slice(0, 3)
    .map((answer) => {
      const question = data.book_questions.find(
        (q) => q.id === answer.question_id
      );
      const book = data.books.find((b) => b.id === question?.book_id);
      return { answer, question, book };
    })
    .filter((item) => item.question && item.book);

  const handleNextProfile = () => {
    setCurrentProfileIndex(
      (prevIndex) => (prevIndex + 1) % data.profiles.length
    );
  };

  const handlePreviousProfile = () => {
    setCurrentProfileIndex((prevIndex) =>
      prevIndex === 0 ? data.profiles.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentProfileIndex]);

  return (
    <div className="flex flex-col h-screen">
      <div className="text-center border-b border-white/30 text-white/65 text-lg font-medium py-4">
        2025년 4월 24일
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto p-4 flex flex-col gap-24 pt-18"
      >
        <UserInfoSection user={user} />
        {answersToShow.length > 0 ? (
          answersToShow.map(({ answer, question, book }) => (
            <div key={answer.id}>
              <AnswerSection
                answer={answer}
                question={question!}
                book={book!}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-white/65 py-8">
            이 사용자의 답변이 없습니다.
          </div>
        )}
        <div>
          <SoulLine users={soulLineUsers} />
          <MutualBooks books={mutualBooksData} />
        </div>
      </div>
      <BottomNavigation
        onNext={handleNextProfile}
        onPrevious={handlePreviousProfile}
      />
    </div>
  );
}

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
        이전 프로필
      </div>
      <div
        onClick={onNext}
        className="text-white/65 text-lg font-medium flex items-center gap-2 hover:underline hover:cursor-pointer"
      >
        다음 프로필
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
