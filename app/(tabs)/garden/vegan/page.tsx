"use client";

import { useState } from "react"; // Import useState
import Image from "next/image";
import data from "../../../../data.json"; // Import data for fallback

// Define the Book type based on the expected props
type Book = {
  id: string;
  title: string;
  author: string;
  description?: string; // Make description optional
  imageUrl: string;
};

// Simple Profile Type (using structure from data.json)
type Profile = {
  id: string;
  name: string;
  imageUrl: string;
};

// Modal Component for displaying profile lists
const ProfileListModal = ({
  title,
  profiles,
  onClose,
}: {
  title: string;
  profiles: Profile[];
  onClose: () => void;
}) => {
  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {profiles.map((profile) => (
            <li key={profile.id} className="flex items-center">
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
              <span className="text-sm text-gray-700">{profile.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// The card component logic, integrated into the page
function BookDetailCard() {
  // State for interactivity
  const [isInterested, setIsInterested] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  // State for Modals
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [showReadersModal, setShowReadersModal] = useState(false);
  const [modalProfiles, setModalProfiles] = useState<Profile[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  // Use fallback book data
  const book: Book = data.books[0];
  const { title, author, imageUrl, description } = book;

  // -- Hardcoded counts for now --
  const interestedMembersCount = 3;
  const readersCount = 3;

  // Placeholder profile data for modals (replace with actual logic later)
  const placeholderInterestedProfiles = data.profiles.slice(0, 3);
  const placeholderReaderProfiles = data.profiles.slice(1, 4);

  // Handler functions
  const toggleInterest = () => setIsInterested(!isInterested); // Note: This doesn't update the count currently
  const toggleRead = () => setHasRead(!hasRead); // Note: This doesn't update the count currently

  const openModal = (type: "interested" | "readers") => {
    if (type === "interested") {
      setModalProfiles(placeholderInterestedProfiles);
      setModalTitle("관심 멤버");
      setShowInterestedModal(true);
    } else {
      setModalProfiles(placeholderReaderProfiles);
      setModalTitle("독자");
      setShowReadersModal(true);
    }
  };

  const closeModal = () => {
    setShowInterestedModal(false);
    setShowReadersModal(false);
    setModalProfiles([]); // Clear profiles on close
    setModalTitle("");
  };

  return (
    <div className="w-full p-6">
      <div className="flex gap-6 md:gap-8">
        {/* 책 표지 이미지 */}
        <div className="w-[120px] md:w-[150px] flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm">
            <Image
              src={imageUrl} // Use dynamic imageUrl
              alt={`${title} 책 표지`} // Use dynamic title for alt text
              fill
              sizes="(max-width: 768px) 120px, 150px"
              className="object-cover" // Changed to object-cover for better fit
              priority
            />
          </div>
        </div>

        {/* 정보 및 액션 섹션 (오른쪽) */}
        <div className="flex-1 flex flex-col justify-between">
          {/* 상단 정보 */}
          <div className="space-y-3">
            <h1 className="text-xl font-semibold text-gray-800">{`${author}의 『${title}』`}</h1>{" "}
            {/* Conditionally render description */}
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {/* 멤버 수와 독자 수 - Made clickable */}
            <div className="flex gap-4 text-sm text-gray-500">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-gray-700 hover:underline"
                onClick={() => openModal("interested")}
              >
                <span>관심 멤버</span>
                <span className="font-semibold text-green-600">
                  {interestedMembersCount}명 {/* Display hardcoded count */}
                </span>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-gray-700 hover:underline"
                onClick={() => openModal("readers")}
              >
                <span>독자</span>
                <span className="font-semibold text-green-600">
                  {readersCount}명 {/* Display hardcoded count */}
                </span>
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼들 (Update for interactivity) */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              className={`flex-1 px-3 py-1.5 text-sm rounded ${
                isInterested
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-50 border border-green-200 text-green-800 hover:bg-green-100"
              }`}
              onClick={toggleInterest}
            >
              {isInterested ? "관심 책 해제" : "관심 책 등록"}
            </button>
            <button
              className={`flex-1 px-3 py-1.5 text-sm rounded ${
                hasRead
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-50 border border-green-200 text-green-800 hover:bg-green-100"
              }`}
              onClick={toggleRead}
            >
              {hasRead ? "읽은 책 취소" : "읽은 책 등록"}
            </button>
            <button
              className="flex-1 px-3 py-1.5 text-sm rounded bg-green-50 border border-green-200 text-green-800 hover:bg-green-100"
              onClick={() => alert("책 구매 페이지로 이동합니다.")}
            >
              책 구매
            </button>
          </div>
        </div>
      </div>
      {/* Conditionally render modals */}
      {showInterestedModal && (
        <ProfileListModal
          title={modalTitle}
          profiles={modalProfiles}
          onClose={closeModal}
        />
      )}
      {showReadersModal && (
        <ProfileListModal
          title={modalTitle}
          profiles={modalProfiles}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Placeholder data for questions related to "The Vegetarian"
const questions = [
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

// Placeholder data for answers (link these to a specific question later if needed)
const answers = [
  {
    id: "ans1",
    profile: data.profiles[1], // Use profile data from data.json
    text: "대학교 때, 모두가 취업 준비에 몰두할 때 혼자서 인문학 스터디를 계속했던 기억이 나요. 당장은 불확실해 보였지만, 그때의 고민과 독서가 지금의 저를 만든 자양분이 되었다고 생각해요. 영혜처럼 거창하진 않아도, 남들이 '정상'이라고 생각하는 길에서 잠시 벗어나 자신만의 가치를 따랐던 작은 용기였죠.",
    date: "2023-10-26",
  },
  {
    id: "ans2",
    profile: data.profiles[2],
    text: "영혜의 마지막 모습이 강렬했어요. 식물이 되려는 듯한 모습은 현실 도피처럼 보이기도 했지만, 어쩌면 가장 순수한 형태의 존재를 갈망한 건 아닐까 싶기도 하고... 여러 해석이 가능한 것 같아요.",
    date: "2023-10-25",
  },
  {
    id: "ans3",
    profile: data.profiles[3],
    text: "아버지의 폭력이 너무 현실적으로 다가와서 읽는 내내 마음이 불편했어요. 영혜의 변화가 그 폭력에서 벗어나려는 절박한 몸부림처럼 느껴졌습니다.",
    date: "2023-10-24",
  },
];

// Type for a selected question
type SelectedQuestion = {
  id: string;
  text: string;
};

// Function to format date (can be moved to utils)
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString.replace(/-/g, ". ") + ".";
};

// Star SVG Icon Component (Copied from discover/page.tsx)
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

export default function VeganGardenPage() {
  const [activeTab, setActiveTab] = useState("questions");
  // State to track the selected question
  const [selectedQuestion, setSelectedQuestion] =
    useState<SelectedQuestion | null>(null);

  // Handler to select a question
  const handleQuestionSelect = (question: SelectedQuestion) => {
    setSelectedQuestion(question);
    setActiveTab("questions"); // Ensure questions tab is active when viewing details
  };

  // Handler to go back to the list view
  const handleGoBack = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Book Detail Card Container (Always Visible) */}
      <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        <div className="max-w-[680px] mx-auto">
          <BookDetailCard />
        </div>
      </div>

      {/* Dynamic Breadcrumb Card */}
      <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        <div className="max-w-[680px] mx-auto px-6 py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-gray-700 hover:underline">
                  가든
                </a>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
              {selectedQuestion ? (
                // Breadcrumb for Detail View
                <>
                  <li>
                    {/* Make this a link/button to go back */}
                    <button
                      onClick={handleGoBack}
                      className="hover:text-gray-700 hover:underline"
                    >
                      채식주의자
                    </button>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </li>
                  <li>
                    {/* Display truncated question text in breadcrumb */}
                    <span
                      className="font-medium text-gray-700 truncate max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md"
                      title={selectedQuestion.text}
                    >
                      {selectedQuestion.text}
                    </span>
                  </li>
                </>
              ) : (
                // Breadcrumb for List View
                <li>
                  <span className="font-medium text-gray-700">채식주의자</span>
                </li>
              )}
            </ol>
          </nav>
        </div>
      </div>

      {/* Conditional Rendering: List View or Detail View */}
      {selectedQuestion ? (
        // == Detail View ==
        <div className="space-y-6">
          {/* Answer List Card (Now directly follows breadcrumb) */}
          <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
            <div className="max-w-[680px] mx-auto p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                답변 {answers.length}개
              </h3>
              {answers.map((answer) => (
                // Answer Card Structure (Applying discover/page.tsx style)
                <div key={answer.id} className="pb-6 border-b last:border-b-0">
                  {/* Profile Section */}
                  <div className="flex items-center mb-4">
                    <Image
                      src={answer.profile.imageUrl}
                      alt={answer.profile.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                    <span className="font-semibold text-gray-800 hover:text-gray-900 hover:underline cursor-pointer">
                      {answer.profile.name}
                    </span>
                  </div>

                  {/* Answer Text - Note: Applying negative margin like discover page */}
                  <p className="font-sans text-xl leading-[1.7] text-gray-700 whitespace-pre-line">
                    {answer.text}
                  </p>

                  {/* Bottom Section: Interest Button & Date */}
                  <div className="flex justify-between items-center mt-4">
                    {/* Interest Button (Static for now) */}
                    <div className="relative group">
                      {/* TODO: Add state/handler for interest per answer */}
                      <button
                        onClick={() =>
                          alert("Interest toggle clicked for " + answer.id)
                        }
                      >
                        <StarIcon filled={false} />
                      </button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap invisible group-hover:visible">
                        꾹 눌러서 관심
                      </span>
                    </div>
                    {/* Date */}
                    <p className="text-right text-sm text-gray-400">
                      {formatDate(answer.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // == List View (Original Question/Event Card) ==
        <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
          <div className="max-w-[680px] mx-auto p-6">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              {/* Tab Buttons (remain the same) */}
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "questions"
                    ? "border-b-2 border-cyan-500 text-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("questions")}
              >
                질문
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "events"
                    ? "border-b-2 border-cyan-500 text-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("events")}
              >
                이벤트
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "questions" && (
              <div>
                {/* Summary Line (remains the same) */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    질문 {questions.length}개 · 답변{" "}
                    {questions.reduce((sum, q) => sum + q.answerCount, 0)}개
                  </span>
                  <button className="text-sm text-cyan-600 hover:underline hover:cursor-pointer">
                    질문 제안
                  </button>
                </div>

                {/* Question List */}
                <ul className="space-y-4">
                  {questions.map((q) => (
                    <li
                      key={q.id}
                      className="pb-4 border-b last:border-b-0 flex flex-col"
                    >
                      {/* Top section for text and context */}
                      <div className="mb-2">
                        <p className="text-xl font-bold text-gray-800 mb-1">
                          {q.text}
                        </p>
                        <p className="text-sm text-gray-500 my-2">
                          {q.context}
                        </p>
                      </div>

                      {/* Bottom section for count and buttons */}
                      <div className="flex justify-between items-center">
                        {/* Button Group on the left */}
                        <div className="flex space-x-2">
                          <button
                            className="text-sm text-cyan-600 hover:underline focus:outline-none hover:cursor-pointer"
                            onClick={() =>
                              handleQuestionSelect({ id: q.id, text: q.text })
                            }
                          >
                            답변하기
                          </button>
                          <button
                            className="text-sm text-cyan-600 hover:underline focus:outline-none hover:cursor-pointer"
                            onClick={() =>
                              handleQuestionSelect({ id: q.id, text: q.text })
                            }
                          >
                            답변보기
                          </button>
                        </div>
                        {/* Answer Count on the right */}
                        <span className="text-sm text-gray-500">
                          답변 {q.answerCount}개
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "events" && (
              <div className="text-center text-gray-500 py-8">
                이벤트 내용이 여기에 표시됩니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
