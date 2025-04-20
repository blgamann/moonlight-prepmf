"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import data from "../../../../../data.json"; // Import data
import { useSearchParams } from "next/navigation";

// --- Types ---
type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

// --- Placeholder Data ---
// Cast the imported data to ensure type safety
const typedData = data as { books: Book[] };
const book: Book = typedData.books[0]; // Assuming book[0] is the relevant book ('채식주의자')

const questionText =
  "영혜처럼 사회의 '정상성'에 의문을 품고 자신만의 길을 가고 싶었던 적이 있나요? 어떤 경험이 었나요?";

// --- Page Component ---
export default function WriteAnswerPage() {
  const searchParams = useSearchParams();
  const from = searchParams?.get("from");

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const isFromList = from === "list";
  const backHref = isFromList ? "/garden/vegan" : "/garden/vegan/answer";
  const backText = isFromList ? "← 질문 목록으로 돌아가기" : "← 다른 답변 보기";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic (e.g., API call)
    console.log("Submitting Answer:", { title, text });
    // Potential redirect after submission
    // router.push('/garden/vegan/answer');
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 py-6 pt-16 space-y-6">
      {/* Header Section: Question + Book Info */}
      <div className="max-w-[680px] mx-auto border-b border-gray-700 pb-6">
        {/* Back Button/Link */}
        <div className="mb-6">
          <Link
            href={backHref}
            className="text-sm text-gray-400 hover:text-white"
          >
            {backText}
          </Link>
        </div>
        <div className="w-full flex justify-between items-stretch gap-4">
          {/* Left: Question Text */}
          <div className="flex-1 pr-4 flex flex-col items-stretch">
            <h2 className="text-2xl font-semibold text-white leading-snug mb-4">
              {questionText}
            </h2>
            {/* Removed "답변하기" button */}
          </div>

          {/* Right: Book Info */}
          <div className="flex-shrink-0 w-[80px] text-center">
            <div className="relative aspect-[3/4] w-full rounded overflow-hidden shadow-sm border border-gray-700">
              <Image
                src={book.imageUrl}
                alt={`${book.title} 책 표지`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium text-gray-300 truncate">
              {book.title}
            </p>
            <p className="text-xs text-gray-500 truncate">{book.author}</p>
          </div>
        </div>
      </div>

      {/* Answer Input Form Section */}
      <div className="max-w-[680px] mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Answer Title Input */}
          <div>
            <label
              htmlFor="answerTitle"
              className="block text-lg font-medium text-gray-300 mb-2"
            >
              답변 제목
            </label>
            <input
              type="text"
              id="answerTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="답변의 제목을 입력하세요"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Answer Text Input */}
          <div>
            <label
              htmlFor="answerText"
              className="block text-lg font-medium text-gray-300 mb-2"
            >
              답변 내용
            </label>
            <textarea
              id="answerText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="질문에 대한 당신의 생각이나 경험을 자유롭게 적어주세요."
              required
              rows={10}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              답변 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
