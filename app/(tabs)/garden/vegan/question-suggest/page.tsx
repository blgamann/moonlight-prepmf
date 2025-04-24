"use client";

import { useState } from "react";
import data from "../../../../../data.json"; // Import data for fallback
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component

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
    <div className="w-full min-h-screen bg-zinc-950 text-white px-4 py-6 pt-12 space-y-6">
      <div className="w-full rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="max-w-[680px] mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 ">
            <Link
              href="/garden/vegan"
              className="text-sm text-gray-400 hover:text-white"
            >
              &larr; 이전 페이지
            </Link>
          </div>

          {/* Heading Section with Book Cover */}
          <div className="flex gap-4 pt-4 pb-8 mb-4 justify-center items-center">
            {/* Left: Book Cover */}
            <div className="flex-shrink-0 w-[40px] text-center">
              <div className="relative aspect-[3/4] w-full rounded overflow-hidden shadow-sm border border-white/10">
                <Image
                  src={book.imageUrl}
                  alt={`${book.title} 책 표지`}
                  fill
                  sizes="70px"
                  className="object-cover"
                />
              </div>
              {/* Optional: Book title/author below cover */}
              {/* <p className="text-xs font-medium text-white/80 truncate mt-1">{book.title}</p> */}
              {/* <p className="text-xs text-white/60 truncate">{book.author}</p> */}
            </div>

            {/* Right: Heading */}
            <div className="flex-1 pt-1">
              <h2 className="text-2xl font-semibold text-white/95">
                질문 제안하기
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="coSuggesters"
                className="block text-xl font-medium text-white/85 mb-3"
              >
                공동 제안자 (선택 사항)
              </label>
              <input
                type="text"
                id="coSuggesters"
                value={coSuggesters}
                onChange={(e) => setCoSuggesters(e.target.value)}
                placeholder="함께 제안하는 친구가 있다면 @아이디 태그"
                className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-xl transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6ABECF] focus:bg-white/15 placeholder:text-xl placeholder:text-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="questionText"
                className="block text-xl font-medium text-white/85 mb-3"
              >
                질문 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="questionText"
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="다른 사람들과 나누고 싶은 질문을 작성해주세요."
                required
                className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-xl transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6ABECF] focus:bg-white/15 placeholder:text-xl placeholder:text-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="questionContext"
                className="block text-xl font-medium text-white/85 mb-3"
              >
                질문의 맥락 (선택 사항)
              </label>
              <textarea
                id="questionContext"
                rows={4}
                value={questionContext}
                onChange={(e) => setQuestionContext(e.target.value)}
                placeholder="질문의 배경이나 관련 내용을 추가하면 토론에 도움이 됩니다."
                className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-xl transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6ABECF] focus:bg-white/15 placeholder:text-xl placeholder:text-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="ownAnswer"
                className="block text-xl font-medium text-white/85 mb-3"
              >
                나의 답변/생각 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ownAnswer"
                rows={8}
                value={ownAnswer}
                onChange={(e) => setOwnAnswer(e.target.value)}
                placeholder="이 질문에 대한 자신의 생각을 미리 적어두면 다른 사람들의 참여를 유도할 수 있습니다."
                className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-xl transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6ABECF] focus:bg-white/15 placeholder:text-xl placeholder:text-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                className="py-2 px-3 border-none rounded-md bg-[#4A9DAF] text-white text-base cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#5FA8B9] hover:-translate-y-0.5"
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
