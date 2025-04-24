"use client";

import { useState } from "react";
import Image from "next/image";
import data from "../../../../data.json"; // Import data for fallback
import { MessageSquare } from "lucide-react";
import Link from "next/link"; // Import Link for navigation

// Define the Book type based on the expected props
type Book = {
  id: string;
  title: string;
  author: string;
  description?: string; // Make description optional
  imageUrl: string;
};

// Book Detail Card Component (Updated Theme)
function BookDetailCard() {
  // Use fallback book data
  const book: Book = data.books[0];
  const { title, imageUrl } = book;

  return (
    <div className="w-full p-6">
      <div className="flex flex-col items-center justify-center">
        <Image
          src={imageUrl}
          alt={title}
          width={150}
          height={150}
          className="rounded-lg"
        />
        <div className="text-center mt-6">
          <h2 className="text-xl font-['NanumMyeongjo'] text-white/90">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

// Placeholder data for questions
const questions = [
  {
    id: "q1",
    text: "이 책을 읽고 무엇을 느끼셨나요?",
    answerCount: 78,
    context: "",
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

export default function VeganGardenPage() {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white px-4 py-6 pt-12 space-y-6">
      {/* Book Detail Card Container (Use themed background/border if needed, currently transparent bg on zinc-950) */}
      <div className="w-full rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="max-w-[680px] mx-auto">
          <BookDetailCard />
        </div>
      </div>

      {/* Conditional Rendering: List or Detail (Answers) View */}
      <div className="max-w-[680px] mx-auto p-6">
        {/* Tabs (Updated Theme) */}
        {/* Use themed border */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            className={`py-2 px-4 text-base font-medium transition-colors ${
              activeTab === "questions"
                ? // Use white for active tab
                  "border-b-2 border-white text-white/90"
                : // Use themed text color for inactive tab
                  "text-[#999] hover:text-white/90"
            }`}
            onClick={() => setActiveTab("questions")}
          >
            질문
          </button>
          <button
            className={`py-2 px-4 text-base font-medium transition-colors ${
              activeTab === "events"
                ? // Use white for active tab
                  "border-b-2 border-white text-white/90"
                : // Use themed text color for inactive tab
                  "text-[#999] hover:text-white/90"
            }`}
            onClick={() => setActiveTab("events")}
          >
            이벤트
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "questions" && (
          <div>
            {/* Question List (Uses themed border for separation) */}
            <ul className="space-y-6">
              {questions.map((q) => (
                <li
                  key={q.id}
                  // Use themed border
                  className="pb-6 border-b border-white/10 last:border-b-0 flex flex-col"
                >
                  {/* Top section for text and context */}
                  <div className="mb-3">
                    <Link href={`/garden/vegan/answer`}>
                      <span className="text-xl font-semibold text-white/85 cursor-pointer hover:underline">
                        {q.text}
                      </span>
                    </Link>
                    {/* Use white text */}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#999]" />
                    <span className="text-base text-[#999]">
                      {q.answerCount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "events" && (
          // Use themed secondary text color
          <div className="text-center text-[#999] py-8">
            이벤트 내용이 여기에 표시됩니다. (아직 구현되지 않음)
          </div>
        )}
      </div>
      <div className="pb-16"></div>
    </div>
  );
}
