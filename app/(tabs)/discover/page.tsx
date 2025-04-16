"use client";

import data from "@/data.json";

import Image from "next/image";
import { useState } from "react";

const question = `영혜처럼 사회의 '정상성'에 의문을 품고 자신만의 길을 가고 싶었던 적이 있나요? 어떤 경험이었나요?`;
const questionContext = `소설 속 영혜는 폭력적인 꿈을 꾼 뒤 육식을 거부하며 사회가 요구하는 '정상성'에서 벗어납니다. 그녀의 선택은 가족과의 갈등을 야기하지만, 동시에 자신만의 신념을 따르는 여정의 시작이기도 합니다. 영혜의 모습에 비추어, 사회적 통념에 맞서 자신만의 가치를 추구했던 경험이 있는지 돌아봅시다.`;
const answer = `
           대학교 때, 모두가 취업 준비에 몰두할 때 혼자서 인문학 스터디를 계속했던 기억이 나요. 당장은 불확실해 보였지만, 그때의 고민과 독서가 지금의 저를 만든 자양분이 되었다고 생각해요. 영혜처럼 거창하진 않아도, 남들이 '정상'이라고 생각하는 길에서 잠시 벗어나 자신만의 가치를 따랐던 작은 용기였죠.
`;

const profile = data.profiles.find((p) => p.id === "profile-5");
const book = data.books.find((b) => b.id === "book-vegetarian");
const currentAnswer = data.book_answers.find((a) => a.id === "a-veg-1");

// Function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString.replace(/-/g, ". ") + ".";
};

// Star SVG Icon Component
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`cursor-pointer ${
      filled ? "text-yellow-400" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// Placeholder for total number of answers
const totalAnswers = 10; // Example: Assume there are 10 answers

export default function DiscoverPage() {
  const [isInterested, setIsInterested] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Start at the first answer

  // Placeholder navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalAnswers - 1 : prevIndex - 1
    );
    // TODO: Add logic to update displayed answer, profile, etc.
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalAnswers);
    // TODO: Add logic to update displayed answer, profile, etc.
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Question Card */}
      <div className="w-full bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        <div className="max-w-[680px] mx-auto">
          {book && (
            <div className="flex items-center mb-6">
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={40}
                height={60}
                className="rounded mr-4 shadow-sm"
              />
              <h1 className="font-sans font-semibold text-gray-800 hover:text-gray-900 hover:underline cursor-pointer">
                {book.author}의 『{book.title}』
              </h1>
            </div>
          )}
          <h2 className="font-sans text-2xl font-bold text-gray-800 mb-4">
            {question}
          </h2>
          <p className="font-sans text-base leading-relaxed text-gray-400 mb-2">
            {questionContext}
          </p>
        </div>
      </div>

      {/* Answer Card */}
      <div className="w-full bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] mt-6">
        <div className="max-w-[680px] mx-auto">
          {profile && (
            <div className="flex items-center mb-4">
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <span className="font-semibold text-gray-800 hover:text-gray-900 hover:underline cursor-pointer">
                {profile.name}
              </span>
            </div>
          )}
          <p className="font-sans text-xl leading-[1.7] text-gray-700 whitespace-pre-line mt-[-35px]">
            {answer}
          </p>
          <div className="flex justify-between items-center mt-4">
            <div className="relative group">
              <button onClick={() => setIsInterested(!isInterested)}>
                <StarIcon filled={isInterested} />
              </button>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap invisible group-hover:visible">
                꾹 눌러서 관심
              </span>
            </div>
            {currentAnswer && (
              <p className="text-right text-sm text-gray-400">
                {formatDate(currentAnswer.date)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Container for Soul Line and Books Read Together Cards */}
      <div className="flex flex-col md:flex-row md:space-x-6 mt-6">
        {/* Soul Line Section Card */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
          {" "}
          {/* Removed mx-auto */} {/* Removed mt-6 */}
          <div className="max-w-[680px] mx-auto">
            {" "}
            {/* Inner content wrapper */}
            <p className="text-center text-gray-600 text-sm mb-6">
              {/* TODO: Update this text based on profiles related to currentIndex */}
              {data.profiles.length > 1
                ? `${data.profiles[0].name}님과 ${
                    data.profiles[data.profiles.length - 1].name
                  }님은 ${data.profiles.length - 1}촌 관계입니다.`
                : "프로필이 더 필요합니다."}
            </p>
            <div className="flex justify-center items-center">
              {/* TODO: Update this list based on profiles related to currentIndex */}
              {data.profiles.map((profile, index, arr) => (
                <div key={profile.id} className="flex items-center">
                  <div className="flex flex-col items-center text-center mx-2">
                    <Image
                      src={profile.imageUrl}
                      alt={profile.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover shadow-md mb-1"
                    />
                    <span
                      className={`text-sm text-gray-700 hover:underline cursor-pointer ${
                        index === 0 || index === arr.length - 1
                          ? "font-bold"
                          : "font-medium"
                      }`}
                    >
                      {profile.name}
                    </span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="w-8 h-px border-t border-dashed border-cyan-400"></div> // Adjusted shorter line
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Books Read Together Card */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] mt-6 md:mt-0">
          {" "}
          {/* Removed mx-auto */} {/* Removed mt-6, added md:mt-0 */}
          <div className="max-w-[680px] mx-auto">
            {" "}
            {/* Inner content wrapper */}
            <p className="text-center text-gray-600 text-sm mb-6">
              {/* TODO: Update this text based on profiles/books related to currentIndex */}
              {data.profiles.length > 1
                ? `${data.profiles[0].name}님과 ${
                    data.profiles[data.profiles.length - 1].name
                  }님은 함께 읽은 책이 ${
                    data.books.slice(0, 3).length
                  }권입니다.`
                : "프로필 정보를 불러올 수 없습니다."}
            </p>
            <div className="flex space-x-4 justify-center">
              {/* TODO: Update this list based on profiles/books related to currentIndex */}
              {data.books.slice(0, 3).map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col items-center text-center w-20"
                >
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={50} // Adjust size as needed
                    height={75} // Adjust size as needed
                    className="rounded shadow-md mb-2 object-cover"
                  />
                  {/* Apply hover effect and ensure consistent height/alignment */}
                  <span
                    className="text-xs text-gray-600 leading-tight hover:underline cursor-pointer line-clamp-2 h-8" /* Use fixed height h-8, removed min-h */
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }} /* Necessary for line-clamp */
                  >
                    {book.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Card - Padding already p-6 */}
      <div className="w-full bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] mt-6">
        <div className="flex items-center justify-between space-x-4">
          {" "}
          {/* Changed justify-center to justify-between */}
          <button
            onClick={goToPrevious}
            className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-center" /* Added flex-1, py-2, text-center */
            // disabled={currentIndex === 0} // Enable/disable logic if needed
          >
            이전
          </button>
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
            {" "}
            {/* Added whitespace-nowrap */}
            {currentIndex + 1} / {totalAnswers}
          </span>
          <button
            onClick={goToNext}
            className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-center" /* Added flex-1, py-2, text-center */
            // disabled={currentIndex === totalAnswers - 1} // Enable/disable logic if needed
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
