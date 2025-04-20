"use client";

import { useState } from "react";
import Image from "next/image";
import data from "../../../../../data.json"; // Import data for fallback
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types ---
type Book = {
  id: string;
  title: string;
  author: string;
  description?: string;
  imageUrl: string;
};

type Profile = {
  id: string;
  name: string;
  imageUrl: string;
};

// --- Modal Component --- //
// NOTE: Assuming the full ProfileListModal implementation is here
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-xs mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
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
        <h3 className="text-xl font-semibold mb-4 text-gray-200">{title}</h3>
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
              <span className="text-base text-gray-300">{profile.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- BookDetailCard Component --- //
// NOTE: Assuming the full BookDetailCard implementation is here
function BookDetailCard() {
  const [isInterested, setIsInterested] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [showReadersModal, setShowReadersModal] = useState(false);
  const [modalProfiles, setModalProfiles] = useState<Profile[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  const book: Book = data.books[0];
  const { title, author, imageUrl, description } = book;
  const interestedMembersCount = 3;
  const readersCount = 3;
  const placeholderInterestedProfiles = data.profiles.slice(0, 3);
  const placeholderReaderProfiles = data.profiles.slice(1, 4);

  const toggleInterest = () => setIsInterested(!isInterested);
  const toggleRead = () => setHasRead(!hasRead);

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
    setModalProfiles([]);
    setModalTitle("");
  };

  return (
    <div className="w-full p-6">
      <div className="flex gap-6 md:gap-8">
        <div className="w-[120px] md:w-[150px] flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-gray-700">
            <Image
              src={imageUrl}
              alt={`${title} 책 표지`}
              fill
              sizes="(max-width: 768px) 120px, 150px"
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-gray-100">{`${author}의 『${title}』`}</h1>
            {description && (
              <p className="text-base text-gray-400 mt-1">{description}</p>
            )}
            <div className="flex gap-4 text-base text-gray-400">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-400 hover:underline"
                onClick={() => openModal("interested")}
              >
                <span>구독 멤버</span>
                <span className="font-semibold text-blue-400">
                  {interestedMembersCount}명
                </span>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-400 hover:underline"
                onClick={() => openModal("readers")}
              >
                <span>독자</span>
                <span className="font-semibold text-blue-400">
                  {readersCount}명
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              className={`flex-1 px-3 py-1.5 text-base rounded ${
                isInterested
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={toggleInterest}
            >
              {isInterested ? "구독 해제" : "가든 구독"}
            </button>
            <button
              className={`flex-1 px-3 py-1.5 text-base rounded ${
                hasRead
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={toggleRead}
            >
              {hasRead ? "읽은 책 취소" : "읽은 책 등록"}
            </button>
            <button
              className="flex-1 px-3 py-1.5 text-base rounded bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
              onClick={() => alert("책 구매 페이지로 이동합니다.")}
            >
              책 구매
            </button>
          </div>
        </div>
      </div>
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

// --- Main Page Component ---
export default function QuestionSuggestPage() {
  const router = useRouter();
  const [coSuggesters, setCoSuggesters] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionContext, setQuestionContext] = useState("");
  const [ownAnswer, setOwnAnswer] = useState("");

  // Access book data within the component where state is managed
  const book: Book = data.books[0]; // Assuming we need book info for submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert("질문 내용을 입력해주세요.");
      return;
    }

    const suggestionData = {
      coSuggesters: coSuggesters.trim() || null,
      questionText: questionText.trim(),
      questionContext: questionContext.trim() || null,
      ownAnswer: ownAnswer.trim() || null,
      bookId: book.id, // Example: Including bookId
      // userId: currentUser.id // Example: Include user ID if available
    };

    console.log("Submitting Question Suggestion:", suggestionData);

    try {
      // --- Placeholder API Call ---
      // const response = await fetch('/api/garden/vegan/suggest-question', { // Replace with actual endpoint
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(suggestionData),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      //   throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      // }
      // const result = await response.json();
      // console.log('Suggestion submitted:', result);

      // Simulate API call success for now
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      alert("질문 제안이 성공적으로 등록되었습니다.");
      router.push("/garden/vegan");
    } catch (error) {
      console.error("Failed to submit question suggestion:", error);
      alert(
        `질문 제안 등록 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 py-6 pt-12 space-y-6">
      <div className="w-full rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="max-w-[680px] mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 mb-4">
            <Link
              href="/garden/vegan"
              className="text-sm text-blue-400 hover:text-white hover:underline"
            >
              &larr; 가든으로 돌아가기
            </Link>
          </div>
            <h2 className="text-xl font-semibold text-gray-200">
              질문 제안하기
            </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="coSuggesters"
                className="block text-base font-medium text-gray-300 mb-1.5"
              >
                공동 제안자 (선택 사항)
              </label>
              <input
                type="text"
                id="coSuggesters"
                value={coSuggesters}
                onChange={(e) => setCoSuggesters(e.target.value)}
                placeholder="함께 제안하는 친구가 있다면 @아이디 태그"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="questionText"
                className="block text-base font-medium text-gray-300 mb-1.5"
              >
                질문 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="questionText"
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="다른 사람들과 나누고 싶은 질문을 작성해주세요."
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="questionContext"
                className="block text-base font-medium text-gray-300 mb-1.5"
              >
                질문의 맥락 (선택 사항)
              </label>
              <textarea
                id="questionContext"
                rows={4}
                value={questionContext}
                onChange={(e) => setQuestionContext(e.target.value)}
                placeholder="질문의 배경이나 관련 내용을 추가하면 토론에 도움이 됩니다."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="ownAnswer"
                className="block text-base font-medium text-gray-300 mb-1.5"
              >
                나의 답변/생각
              </label>
              <textarea
                id="ownAnswer"
                rows={5}
                value={ownAnswer}
                onChange={(e) => setOwnAnswer(e.target.value)}
                placeholder="이 질문에 대한 자신의 생각을 미리 적어두면 다른 사람들의 참여를 유도할 수 있습니다."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/garden/vegan")}
                className="px-4 py-2 text-base rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-base rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!questionText.trim()}
              >
                제안 등록
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="pb-16"></div>
    </div>
  );
}
