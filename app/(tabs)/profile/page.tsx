"use client";

import Image from "next/image";
import { useState } from "react";

// Define the Profile type
type Profile = {
  id: string;
  name: string;
  bio?: string;
  imageUrl: string;
  bookCount: number;
  friendCount: number;
};

// Define Question type
type Question = {
  id: string;
  text: string;
  answerCount: number;
  context?: string; // Context is optional
};

// Define Answer type
type Answer = {
  id: string;
  questionId: string; // Link to the question
  text: string;
  date: string;
};

// Define Book type (simplified for list display)
type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

// Profile Card Component
function ProfileCard({ profile }: { profile: Profile }) {
  const { name, bio, imageUrl, bookCount, friendCount } = profile;

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
      <div className="flex gap-6 md:gap-8">
        {/* Profile Image */}
        <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] flex-shrink-0">
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-sm">
            <Image
              src={imageUrl}
              alt={`${name}의 프로필 사진`}
              fill
              sizes="(max-width: 768px) 100px, 120px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Profile Information and Actions */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Top Information */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
            {bio && <p className="text-sm text-gray-500">{bio}</p>}
            {/* Counts */}
            <div className="flex gap-4 text-sm text-gray-500 pt-1">
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 hover:underline">
                <span>읽은 책</span>
                <span className="font-semibold text-cyan-600">{bookCount}</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 hover:underline">
                <span>친구</span>
                <span className="font-semibold text-cyan-600">
                  {friendCount}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button className="flex-1 px-3 py-1.5 text-sm rounded bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-100">
              프로필 편집
            </button>
            <button className="flex-1 px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200">
              설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"answers" | "readBooks">(
    "answers"
  );

  // Placeholder profile data (Replace with actual data fetching)
  const userProfile: Profile = {
    id: "user1",
    name: "김민준",
    bio: "책과 함께 성장하는 개발자. 새로운 아이디어를 탐구하는 것을 좋아합니다.",
    imageUrl: "/profiles/profile1.png", // Use actual image path
    bookCount: 42,
    friendCount: 15,
  };

  // Placeholder questions data (from vegan/page.tsx)
  const questions: Question[] = [
    {
      id: "q1",
      text: "영혜처럼 사회적 시선이나 통념에 맞서 '다른' 선택을 해본 경험이 있나요?",
      answerCount: 78,
      context:
        "소설 속 영혜는 폭력적인 꿈을 꾼 뒤 육식을 거부하며 사회가 요구하는 '정상성'에서 벗어납니다. 그녀의 선택은 가족과의 갈등을 야기하지만, 동시에 자신만의 신념을 따르는 여정의 시작이기도 합니다. 영혜의 모습에 비추어, 사회적 통념에 맞서 자신만의 가치를 추구했던 경험이 있는지 돌아봅시다.",
    },
    {
      id: "q2",
      text: "소설 속 폭력적인 장면(꿈, 아버지의 폭력 등) 중 가장 인상 깊었거나 불편했던 장면은 무엇인가요? 그 이유는?",
      answerCount: 23,
      context:
        "작품은 단순히 육식 거부를 넘어, 인간 사회에 내재된 다양한 형태의 폭력성을 고발합니다. 가정 내에서의 억압, 사회적 편견, 타인에 대한 무관심 등, 영혜가 겪는 고통은 여러 층위의 폭력과 연결됩니다. 우리 주변에서 발견할 수 있는 다양한 폭력의 양상에 대해 이야기해 봅시다.",
    },
    {
      id: "q3",
      text: "영혜의 채식 선언은 단순한 식습관 변화일까요, 아니면 더 깊은 의미(저항, 자기 파괴, 구원 등)를 담고 있을까요?",
      answerCount: 47,
      context:
        "영혜는 점차 인간이기를 포기하고 나무가 되기를 갈망하며 식물적인 삶을 꿈꿉니다. 이는 현실의 고통과 폭력으로부터 완전히 벗어나고자 하는 극단적인 소망의 표현일 수 있습니다. 현실의 어려움에서 벗어나 다른 존재가 되고 싶은 욕망에 대해 생각해 봅시다.",
    },
  ];

  // Placeholder answers data (representing user's answers)
  const userAnswers: Answer[] = [
    {
      id: "userAns1",
      questionId: "q1",
      text: "제 경우에는 대학 전공을 선택할 때 부모님의 기대와 다른 길을 선택했던 경험이 있습니다. 처음에는 걱정도 많았지만, 결국 제가 원하는 분야에서 즐겁게 공부하고 일할 수 있게 되었죠.",
      date: "2024-05-10",
    },
    {
      id: "userAns2",
      questionId: "q2",
      text: "아버지의 폭력 장면이 가장 불편했습니다. 영혜가 겪는 고통이 단순히 개인적인 문제를 넘어 가정 내 권력 관계와 연결되어 있다는 생각이 들었습니다.",
      date: "2024-05-12",
    },
  ];

  // Placeholder read books data
  const readBooks: Book[] = [
    {
      id: "book1",
      title: "채식주의자",
      author: "한강",
      imageUrl: "/books/book1.jpg", // Use actual image path
    },
    {
      id: "book2",
      title: "파과",
      author: "구병모",
      imageUrl: "/books/book2.jpg", // Use actual image path
    },
    {
      id: "book3",
      title: "달러구트 꿈 백화점",
      author: "이미예",
      imageUrl: "/books/book3.jpg", // Use actual image path
    },
  ];

  // Helper function to get question text by ID
  const getQuestionText = (questionId: string): string => {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.text : "알 수 없는 질문";
  };

  // Helper function to format date (can be moved to utils)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.replace(/-/g, ". ") + ".";
  };

  return (
    <div className="w-full px-4 py-6 space-y-6">
      <div className="max-w-[680px] mx-auto">
        <ProfileCard profile={userProfile} />

        {/* Tab Section */}
        <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] mt-6">
          <div className="p-6">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "answers"
                    ? "border-b-2 border-cyan-500 text-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("answers")}
              >
                답변
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "readBooks"
                    ? "border-b-2 border-cyan-500 text-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("readBooks")}
              >
                읽은 책
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "answers" && (
              <div>
                {/* Summary Line */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    나의 답변 {userAnswers.length}개
                  </span>
                  {/* Optional: Add a button if needed */}
                </div>

                {/* Answer List - Applying card styling */}
                <ul className="space-y-6">
                  {userAnswers.map((answer) => {
                    // TODO: Fetch the actual book associated with answer.questionId
                    const associatedBook =
                      answer.id === "userAns1"
                        ? readBooks[0] // "채식주의자" for userAns1
                        : answer.id === "userAns2"
                        ? readBooks[1] // "파과" for userAns2
                        : readBooks[0]; // Default fallback

                    const questionText = getQuestionText(answer.questionId);

                    return (
                      <li
                        key={answer.id}
                        className="bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      >
                        {/* Inner Card for Book and Question (Placeholder book) */}
                        {associatedBook && questionText && (
                          <div className="bg-gray-50 p-4 rounded-md mb-4 shadow-inner">
                            <div className="flex items-start space-x-4">
                              <Image
                                src={associatedBook.imageUrl}
                                alt={associatedBook.title}
                                width={40}
                                height={60}
                                className="rounded shadow-sm flex-shrink-0"
                              />
                              <div className="flex-grow">
                                <h3 className="font-sans font-semibold text-gray-700 mb-1 hover:text-gray-900 hover:underline cursor-pointer">
                                  {associatedBook.author}의 『
                                  {associatedBook.title}』
                                </h3>
                                <p className="font-sans text-base text-gray-600">
                                  {questionText}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Answer Text - Applied discover page style */}
                        <p className="font-sans text-xl leading-[1.7] text-gray-700 whitespace-pre-line mb-4">
                          {answer.text}
                        </p>
                        {/* Date and Actions */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            {formatDate(answer.date)}
                          </span>
                          {/* TODO: Add actions like Edit/Delete? */}
                          <button className="text-cyan-600 hover:underline focus:outline-none">
                            수정
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {activeTab === "readBooks" && (
              <div>
                {/* Summary Line */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    읽은 책 {readBooks.length}권
                  </span>
                  {/* Optional: Add a button if needed, e.g., '책 추가'? */}
                </div>

                {/* Book List */}
                <ul className="space-y-4">
                  {readBooks.map((book) => (
                    <li
                      key={book.id}
                      className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                    >
                      {/* Book Cover */}
                      <div className="w-[60px] flex-shrink-0">
                        <div className="relative aspect-[3/4] rounded overflow-hidden shadow-sm">
                          <Image
                            src={book.imageUrl}
                            alt={`${book.title} 책 표지`}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      {/* Book Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {book.title}
                        </p>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        {/* Optional: Add actions like '리뷰 쓰기' or '상세 보기' */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
