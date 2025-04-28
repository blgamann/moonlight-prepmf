"use client";

import { Tabs } from "@/components/tabs";
import { BookXl } from "@/components/book";
import { ItemQuestion } from "@/components/item";

import data from "@/data.json";

export default function VeganPage() {
  const bookId = "book-vegetarian";

  const questions = data.book_questions.filter((q) => q.book_id === bookId);

  const answersByQuestionId = data.book_answers.reduce((acc, answer) => {
    acc[answer.question_id] = (acc[answer.question_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tabItems = [
    {
      label: "질문",
      value: "questions",
      content: (
        <div className="text-white/95 flex flex-col gap-8 mt-8">
          {questions.map((q) => (
            <ItemQuestion
              key={q.id}
              question={q.question_text}
              answerCount={answersByQuestionId[q.id] || 0}
              link={`/garden/vegan/answer-list`}
            />
          ))}
        </div>
      ),
    },
    {
      label: "이벤트",
      value: "events",
      content: (
        <div className="text-white/95">
          여기에 이벤트 리스트를 렌더링하세요.
        </div>
      ),
    },
    {
      label: "자매 가든",
      value: "sister-gardens",
      content: (
        <div className="text-white/95">
          여기에 자매 가든 리스트를 렌더링하세요.
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-12 pt-24 max-w-[680px] mx-auto">
      <BookXl imageUrl={data.books[0].imageUrl} title={data.books[0].title} />
      <Tabs tabs={tabItems} />
    </div>
  );
}
