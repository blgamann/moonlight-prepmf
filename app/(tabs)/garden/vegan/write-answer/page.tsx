"use client";

import { useState, Suspense } from "react";
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

// --- Component to handle Suspense logic ---
function WriteAnswerContent() {
  const searchParams = useSearchParams();
  const from = searchParams?.get("from");

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const isFromList = from === "list";
  const backHref = isFromList ? "/garden/vegan" : "/garden/vegan/answer";
  const backText = isFromList ? "← 이전 페이지" : "← 이전 페이지";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic (e.g., API call)
    console.log("Submitting Answer:", { title, text });
    // Potential redirect after submission
    // router.push('/garden/vegan/answer');
  };

  // Function to handle textarea auto-resizing
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = "auto";
    // Set the height to the scrollHeight to fit the content
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white px-4 py-6 pt-16 space-y-6">
      {/* Header Section: Question + Book Info */}
      <div className="max-w-[680px] mx-auto border-b border-white/10 pb-6">
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
            <div className="relative aspect-[3/4] w-full rounded overflow-hidden shadow-sm border border-white/10">
              <Image
                src={book.imageUrl}
                alt={`${book.title} 책 표지`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium text-white/80 truncate">
              {book.title}
            </p>
            <p className="text-xs text-white/60 truncate">{book.author}</p>
          </div>
        </div>
      </div>

      {/* Answer Input Form Section */}
      <div className="max-w-[680px] mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Answer Title Input - Updated */}
          <div>
            <input
              type="text"
              id="answerTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              required
              className="w-full py-3 rounded-md border border-transparent bg-transparent text-2xl font-semibold text-white/95 transition-all duration-300 ease-in-out focus:outline-none placeholder:text-2xl placeholder:font-semibold placeholder:text-gray-500 focus:placeholder:text-gray-600"
            />
          </div>

          {/* Answer Text Input - Updated */}
          <div>
            <textarea
              id="answerText"
              value={text}
              onChange={handleTextareaInput}
              onInput={handleTextareaInput}
              placeholder="당신의 답변을 작성해주세요..."
              required
              rows={1}
              className="w-full py-3 rounded-md border border-transparent bg-transparent text-xl text-white/85 transition-all duration-300 ease-in-out focus:outline-none placeholder:text-xl placeholder:text-gray-500 focus:placeholder:text-gray-600 resize-none overflow-hidden"
            />
          </div>

          {/* Submit Button - Reverted to relative positioning within the form */}
          {/* Add back the wrapping div with flex end alignment */}
          <div className="flex justify-end pt-24">
            <button
              type="submit"
              // Removed fixed positioning classes, restored original/modified classes
              className="py-2 px-3 border-none rounded-md bg-[#4A9DAF] text-white text-base cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#5FA8B9] hover:-translate-y-0.5"
            >
              답변 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Page Component ---
export default function WriteAnswerPage() {
  // Wrap the component using useSearchParams with Suspense
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WriteAnswerContent />
    </Suspense>
  );
}
