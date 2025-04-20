"use client";

import { useState } from "react";
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
          <h2 className="text-xl font-semibold text-gray-200">질문 제안하기</h2>

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
